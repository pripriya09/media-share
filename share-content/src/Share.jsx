import React, { useEffect, useState } from "react";
import axios from "axios";
import "./share.css"; 

function Share() {
  const [contendData, setContentData] = useState([]);
  const [title, setTitle] = useState(""); 
  const [image, setImage] = useState(null); 

  
  useEffect(() => {
    fetchContent();
  }, []);

  function handleClick(event) {
    event.preventDefault(); 
    console.log("Title:", title);
    console.log("Image:", image);

  
    const newDataContent = new FormData();
    newDataContent.append("title", title);
    newDataContent.append("image", image);

   
    axios
      .post("http://localhost:8006/upload", newDataContent, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Upload response:", res.data);
        setContentData((prevData) => [res.data, ...prevData])
        setTitle(""); 
        setImage(null); 
      })
      .catch((err) => {
        console.error("Error submitting content:", err);
      });
  }

 
  function fetchContent() {
    axios
      .get("http://localhost:8006/upload")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setContentData(res.data);
          console.log("Content fetched:", res.data);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching content:", err);
      });
  }

 
  function handleShare(cont) {
    const imageUrl = `http://localhost:8006/uploads/${cont.image}`; 
    
    axios
      .post("http://192.168.0.38:8006/postOnFB", { 
        title: cont.title,
        image: imageUrl,
      })
      .then((postRES) => {
        console.log("Post shared successfully:", postRES.data);
        alert("Post shared successfully!"); 
      })
      .catch((err) => {
        console.log("Error sharing post:", err);
        alert("Failed to share post. Please try again.");
      });
  }

  return (
    <div className="share-container">
 
      <input
        type="text"
        placeholder="Enter your title"
        value={title}
        onChange={(e) => setTitle(e.target.value)} 
      />
      <br />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={handleClick}>Upload</button> 

     
      <div className="item">
        <h1>Posts</h1>
        <div className="share-item">
          {contendData.map((cont, ind) => (
            <div key={ind} className="upload-itm">
              <h3>{cont.title}</h3>
              <img
                src={`http://localhost:8006/uploads/${cont.image}`} 
                alt={cont.title}
                style={{ width: "100px", height: "100px" }}
              />
              <button onClick={() => handleShare(cont)}>Share on FB</button> 
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Share;
