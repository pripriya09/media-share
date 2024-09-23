import React, { useEffect, useState } from 'react'
import axios from 'axios'


function Share() {
const [contendData,setContentData] =useState([]);
const [id,setID] = useState('')
const [title,setTitle] =useState('');
const [image ,setImage] = useState(null);

useEffect(() => {
    async function fetchContent(){
     
        const res = await axios.get('http://localhost:4001/upload')
        setContentData(res.data)
    
    }
fetchContent()
}, [])

function handleClick(){

const newDataContent = new FormData();
newDataContent.append('id',id)
newDataContent.append('title',title)
newDataContent.append('image',image)

axios.post('http://localhost:4001/upload',newDataContent,
  {
    headers:{
      "Content-Type":"multipart/form-data"
    }
  }
)
.then((res)=>{
    console.log(res.data)
    setContentData(res.data)
}).catch((err)=>{
    console.log({err:'error'})
})
}



  return (
    <>
  
      <input type="text" placeholder='ID'
      value={id}
      onChange={(e)=>setID(e.target.value)}
      /><br/>
        <input type="text" placeholder='enter your title'
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      /><br/>
      <input type='file'onChange={(e)=>setImage(e.target.files[0])}/>
      <button type='submit' onClick={handleClick}>show</button>
 
   

    <div className="item">
    <h1>post</h1>
    <div className="share-item">
        {contendData.map(cont=>(
           <div key={cont.id} className="upload-itm">
            <h3>{cont.title}</h3>
            <img src={`http://localhost:4001/${cont.image}`} style={{width:'300px'}} />
           </div>
        ))}
    </div>
    </div>
    
    </>
  )
}

export default Share