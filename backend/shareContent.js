import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:'http://localhost:5173'
  }));

const port = 8000;

const data = [
    {
        id:1,
        title:'Tree',
        body :'Human best friend'
    },
    {
        id:2,
        title:"Fruit",
        body: "testy "
    },
    {
        id:3,
        title:'laptop',
        body:"very useful"
    }

];

app.get('/show',(req,res)=>{
  res.status(200).json(data)
   console.log(data)
})


app.listen(port,()=>{
    console.log("Server Started")
})

