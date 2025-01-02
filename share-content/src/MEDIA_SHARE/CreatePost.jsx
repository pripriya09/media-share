import React, { useEffect, useState } from "react";
import axios from "axios";
import "./share.css";
import { NavLink, useNavigate } from "react-router-dom";

function CreatePost() {
  const [contendData, setContentData] = useState([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);

  // const apiUrl="https://6ce3-110-235-229-26.ngrok-free.app"
  useEffect(() => {
    fetchContent();
  }, []);

  const userAccessToken = localStorage.getItem("userAccessToken");
  function handleClick(event) {
    event.preventDefault();
    console.log("title:", title);
    console.log("image:", image);
    console.log("userAccessToken", userAccessToken);

    const newDataContent = new FormData();
    newDataContent.append("title", title);
    newDataContent.append("image", image);
    newDataContent.append("userAccessToken", userAccessToken);

    axios
      .post("http://localhost:8006/upload", newDataContent, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Upload response:", res.data);
        setContentData((prevData) => [{ ...res.data }, ...prevData]);
        setTitle("");
        setImage(null);
      })
      .catch((err) => {
        console.error("Error submitting content:", err);
      });
  }
  const navigate = useNavigate();
  function handleOut() {
    window.location.href = "/";
    navigate("/");
  }

  function fetchContent() {
    axios
      .get("http://localhost:8006/upload")
      // .get(`${apiUrl}/upload`)

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

  function getUserAccessToken(callback) {
    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        // The user is logged in, you can access the user access token
        const userAccessToken = response.authResponse.accessToken;
        callback(userAccessToken); // Pass the token to the callback function
      } else {
        alert("User is not logged in.");
      }
    });
  }
  function handleShare(cont) {
    const imageUrl = cont.image;
    getUserAccessToken((userAccessToken) => {
      axios
        .post("http://192.168.0.38:8006/postOnFB", {
          title: cont.title,
          image: imageUrl,
          userAccessToken: userAccessToken, // Pass the token here
        })
        .then((postRES) => {
          console.log("Post shared on FACEBOOK is successfully:", postRES.data);
          alert("Post shared successfully!");
        })
        .catch((err) => {
          console.error("Error facebook sharing post:", err);
          if (err.response) {
            console.error("Response data:", err.response.data);
            alert("Error: " + err.response.data.error.message);
          } else {
            alert("Failed to share post (fb). Please try again.");
          }
        });
    }
  );
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
  function postToInstagram(cont) {
    const imageUrl = cont.image;
    const pageAccessToken = localStorage.getItem("pageAccessToken"); // Get the page access token from localStorage
  
    if (!pageAccessToken) {
      alert("Page access token is missing. Please log in and link your Instagram account.");
      return;
    }
  
    try {
      axios
        .post("http://192.168.0.38:8006/postOnIG", {
          title: cont.title,
          image: imageUrl,
          pageAccessToken, // Include the Page Access Token
        })
        .then((postRES) => {
          console.log("Post shared on Instagram successfully:", postRES.data);
          alert("Post shared successfully!");
        })
        .catch((err) => {
          console.error("Error sharing post on Instagram:", err);
          if (err.response) {
            alert("Error: " + err.response.data.error.message);
          } else {
            alert("Failed to share post on Instagram. Please try again.");
          }
        });
    } catch (err) {
      console.error("Error in postToInstagram function:", err);
    }
  }
  
  // const instagramPageResponse = axios.get(
  //   `https://graph.facebook.com/v21.0/{PAGE_ID}?fields=instagram_business_account&access_token={PAGE_ACCESS_TOKEN}`
  // );
  // cosnole.log("instagramPageResponse---->",instagramPageResponse.data)

  // const postToTwitter = async (cont) => {
  //   const imageUrl = cont.image; // Assuming image URL is provided

  //   axios
  //     .post('http://192.168.0.38:8006/postOnTwitter', {
  //       title: cont.title,
  //       image: imageUrl
  //     })
  //     .then((postRES) => {
  //       console.log('Post shared on Twitter successfully:', postRES.data);
  //       alert('Post shared on Twitter successfully!');
  //     })
  //     .catch((err) => {
  //       console.error('Error sharing post on Twitter:', err);
  //       if (err.response) {
  //         console.error('Response data:', err.response.data);
  //         alert('Error: ' + err.response.data.error.message);
  //       } else {
  //         alert('Failed to share post on Twitter. Please try again.');
  //       }
  //     });
  // };

  console.log("Content Data to be posted:", contendData)

  const groupPost = async (cont) => {
    try {
      await handleShare(cont);
      await postToInstagram(cont);
      await postToTwitter(cont);

      setContentData((prevData) =>
        prevData.filter((item) => item.title !== cont.title)
      );
    } catch (error) {
      alert(
        `Error sharing ${cont.title}. Please check the console for details.`
      );
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
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleClick}>Upload</button>

      <button onClick={handleOut}> LOG OUT</button>
      <div className="item">
        <h1>Posts</h1>
        <div className="share-item">
          {contendData.map((cont, ind) => (
            <div key={ind} className="upload-itm">
              <img
                src={cont.image}
                alt="image"
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
              <NavLink to="/home/myPost">
                <button onClick={() => handleShare(cont)}>Share on FB</button>
                <button onClick={() => postToInstagram(cont)}>
                  Share on in
                </button>
                {/* <button onClick={() => postToTwitter(cont)}>Share on Twitter</button> */}

                <br />
                <button onClick={() => groupPost(cont)}>
                  Share FB/IG/twitter
                </button>
              </NavLink>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default CreatePost;
