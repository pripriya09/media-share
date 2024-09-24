import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './share.css'


function Share() {
const [contendData,setContentData] =useState([]);
const [title,setTitle] =useState('');
const [image ,setImage] = useState(null);

useEffect(() => {
 fetchContent();
}, []);

function handleClick(event) {
  event.preventDefault();
  console.log(title)
  console.log(image)

  const newDataContent = new FormData();
  newDataContent.append('title', title);
  newDataContent.append('image', image);

  axios.post('http://localhost:8006/upload', newDataContent, {
      headers: {
          "Content-Type": "multipart/form-data"
      }
  })
  .then((res) => {
      console.log(res.data);
      setContentData(prevData => [...prevData, res.data]); 
  })
  .catch((err) => {
      console.error('Error submitting data:', err);
  });
}

async function fetchContent() {
  try {
    const res = await axios.get('http://localhost:8006/upload');
    if (Array.isArray(res.data)) {
      setContentData(res.data);
      console.log('data upload',res.data)
    } else {
      console.error('Unexpected data format:', res.data);
    }
  } catch (err) {
    console.error('ErrorFetching content:', err);
  }
}
 function handleShare(){
  const FacebookShare= 'http://www.facebook.com/tgsanetechnologies'
  window.open(FacebookShare)
 }

  return (
    <>
        <input type="text" placeholder='enter your title'
      value={title}
      onChange={(e)=>setTitle(e.target.value)}
      /><br/>
      <input type='file'onChange={(e)=>setImage(e.target.files[0])}/>
      <button onClick={handleClick}>show</button>
 
   

    <div className="item">
    <h1>post</h1>
    <div className="share-item">
        { contendData == null  ? "" 
        : contendData.map((cont,ind)=>(
           <div key={ind} className="upload-itm">
            <h3>{cont.title}</h3>
            <img src= {`http://localhost:8006/uploads/${cont.image}`} style={{width:'100px',height:"100px"}} />
            <button onClick={handleShare}>share-and-post:fb/in</button>
           </div>
        )
      )}
    </div>
    </div>
    
    </>
  )
}

export default Share