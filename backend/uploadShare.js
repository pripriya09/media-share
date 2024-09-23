import express from "express";
import cors from 'cors'
import multer from 'multer'
import mongoose from 'mongoose'
// import Content from './../share-content/src/Content';

const app = express();
const port =4001;
app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173'
  }));
app.use(express.static('uploads'));


mongoose.connect('mongodb://localhost:27017/excelData').then(() => console.log('MongoDB connected'))
.catch(err => console.error(' error', err));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const ContentSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true
    },
    title:{
        type:String,
        require:true,
    },
    image:{
        type:String,
        require:true
    }
});

const dataContent = mongoose.model('dataContent',ContentSchema);

app.get('/upload', async(req,res)=>{
    // const {id,title,image} = req.body.params
    const data = await dataContent.find()
   res.status(200).json(data)

})

app.post("/upload",upload.single('image'),async(req,res)=>{
    
    const content = new dataContent({
        id:req.body.id,
        title:req.body.title,
        image:req.body.path
    })
    await content.save()
    res.status(200).json(content)
    
});

app.listen(port,()=>{
    console.log('server started')
})
