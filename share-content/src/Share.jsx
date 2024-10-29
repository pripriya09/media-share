import React, { useEffect, useState } from "react";
import axios from "axios";
import "./share.css"; 

function Share() {
  const [contendData, setContentData] = useState([]);
  const [title, setTitle] = useState(""); 
  const [image, setImage] = useState(null); 
  // const [shareOnFB,setShareOnFB] = useState();

  
  useEffect(() => {
    fetchContent();
  }, []);


  function handleClick(event) {
    event.preventDefault(); 
    console.log("title:", title);
    console.log("image:", image);

  
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

  function handleOut(){
window.location.href = "/";
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
    // const imageUrl = `http://localhost:8006/uploads/${cont.image}`; 
    const imageUrl = cont.image; 

    axios
      .post("http://192.168.0.38:8006/postOnFB"
      // .post("http://localhost:8006/postOnFB"

        , { 
        title: cont.title,
        image: imageUrl,
      })
      .then((postRES) => {
        console.log("Post shared successfully:", postRES.data);
        alert("Post shared successfully!"); 
      })
      .catch((err) => {
        console.error("Error sharing post:", err);
        if (err.response) {
            console.error("Response data:", err.response.data); 
            alert("Error: " + err.response.data.error.message);
        } else {
            alert("Failed to share post. Please try again.");
        }
    });



    

   
  }

  // function handleShare(cont) {
  //   const imageUrl = cont.image;
  
  //   axios
  //     .post("http://localhost:8006/postOnFB", {
  //       title: cont.title,
  //       image: imageUrl,
  //     })
  //     .then((postRES) => {
  //       console.log("API Test Response:", postRES.data);
  //       alert("API test success.");
  //     })
  //     .catch((err) => {
  //       console.error("Error testing post:", err);
  //       alert("Failed to test post.");
  //     });
  // }

  
  const postToInstagram = async (cont) => {
    const imageUrl = cont.image; 
      axios.post("http://192.168.0.38:8006/postOnIG"
      // .post("http://localhost:8006/postOnFB"

        , { 
        title: cont.title,
        image: imageUrl,
      })
      .then((postRES) => {
        console.log("Post shared successfully:", postRES.data);
        alert("Post shared successfully!"); 
      })
      .catch((err) => {
        console.error("Error sharing post:", err);
        if (err.response) {
            console.error("Response data:", err.response.data); 
            alert("Error: " + err.response.data.error.message);
        } else {
            alert("Failed to share post. Please try again.");
        }
    });

 
};

console.log("Content Data to be posted:", contendData);

  
const groupPost = async (cont) => {
  try {
    await handleShare(cont);
    await postToInstagram(cont);
  } catch (error) {

    alert(`Error sharing ${cont.title}. Please check the console for details.`);
  }
};


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

      <button onClick={handleOut}> LOG OUT</button>

     
      <div className="item">
        <h1>Posts</h1>
        <div className="share-item">
          {contendData.map((cont, ind) => (
            <div key={ind} className="upload-itm">
              <h3>{cont.title}</h3>
              <img
                src={cont.image} 
                alt={cont.title}
                style={{ width: "100px", height: "100px" }}
              />
               {/* <label>
                <input
                  type="checkbox"
                  checked={shareOnFB}
                  onChange={() => setShareOnFB((prev) => !prev)}
                />
                Share on FB
              </label> */}
              <button onClick={() => handleShare(cont)}>Share on FB</button> 
              <button onClick={() => postToInstagram(cont)}>Share on in</button> 
              <br/>
              <button onClick={() =>groupPost(cont)}>Share FB/IG</button> 

              

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Share;