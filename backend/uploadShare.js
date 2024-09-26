import express from "express";
import cors from 'cors'
import multer from 'multer'
import mongoose from 'mongoose'
import path from 'path';
import dotenv from 'dotenv';


dotenv.config()

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
   
});
app.post('/postOnFB',async(req,res)=>{
    const {title,image} =req.body 
const PageAccess_token = 'EAAMdXvOXwUYBO5khSKpy1oTv0a8eUe65dfqD4PH90U0ZC4VGoak3oNzzsUZBxcdNqynBAXSdhNluJel8ZCnqbxdnghZAc3ZCQ2TZBZA9W6CL3KFbTQChiwHFd6ZASSrBCcdEdW79hkmVnPLhyNKQoKCRS3LurWtmoWWkhfbBzgKCijcnxYHHnIxfRaqYpr1LMhlAugZDZD' ;
    const page_ID = '876718581072198' ;

    try{
        const titlePost =await axios.post(`https://graph.facebook.com/${page_ID}/feed`,{
            message:title,
            access_token:PageAccess_token,
        });

        if(image){
      const ImagePath =`http://localhost:8006/uploads/${image}`;
      await axios.post(`https://graph.facebook.com/${page_ID}/photo`,{
        url:ImagePath,
        access_token: PageAccess_token,

      });
        }
        console.log(titlePost);
        console.log(ImagePath)
        // res.status(200).json("post successfullyUpload",titlePost);
        res.send(titlePost)
    }
    catch(err){
        res.status(400).json({err:'post error'})
    }
})


app.listen(port,()=>{
    console.log('server started')
})
