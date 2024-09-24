import express from "express";
import cors from 'cors'
import multer from 'multer'
import mongoose from 'mongoose'
import path from 'path';


const app = express();
const port = 8006;
app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173'
  }));
app.use('/uploads',express.static('uploads'));


mongoose.connect('mongodb://localhost:27017/excelData').then(() => console.log('MongoDB connected'))
.catch(err => console.error(' error', err));

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads')
    },
    filename:(req,file,cb)=>{
        const uniqueFile = Date.now()
        cb(null,uniqueFile + file.originalname)
    }
});
const upload = multer({ storage });

const ContentSchema = new mongoose.Schema({
  
    title:{
        type:String,
        required:true,
    },

    image:{
        type:String,
        required:true
    }
});

const dataContent = mongoose.model('dataContent',ContentSchema);


app.post("/upload",upload.single('image'),async(req,res)=>{
    console.log(req.file)
   try{
    const content = new dataContent({
        title:req.body.title,
        image:req.file.filename
    })
    await content.save()
    res.status(200).json(content)
   } catch(err){
    res.status(400).json({'error saving content':err})
   }
 
    });

app.get('/upload', async(req,res)=>{
    try{
        const fullData = await dataContent.find()
        res.status(200).json(fullData)
     
    }catch(err){
        res.status(400).json({err:'error fetching data'})
    }
   
})




app.listen(port,()=>{
    console.log('server started')
})
