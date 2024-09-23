import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [ShareContent, setShareContent] = useState([]);

  useEffect(() => {
    async function fetchContentData() {
      const result = await axios.get(
        "https://jsonplaceholder.typicode.com/posts/"
      );
      console.log(result.data);
      setShareContent(result.data);
    }
    fetchContentData();
  }, []);

  const shareData = (title, body) => {
    const facebookShare = 'http://www.facebook.com/tgsanetechnologies'
    window.open(facebookShare);

    const InstagramShare ='http://www.instagram.com/tgsanetechnologies/'
     window.open(InstagramShare);
  };

  return (
    <>
      <div className="content">
        <h1>SHARE CONTENT</h1>
        <div className="Share-content">
          {ShareContent.map((content, index) => (
            <div key={index.id} className="share">
              <h3>{content.title}</h3>
              <p>{content.body}</p>
              <button onClick={() => shareData(content.title, content.body)}>
                shareContent:fb/in
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
