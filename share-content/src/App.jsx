import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [shareContent, setShareContent] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContentData() {
      try {
        const result = await axios.get("https://jsonplaceholder.typicode.com/posts/");
        setShareContent(result.data);
      } catch (error) {
        setError("Failed to fetch content. Please try again.");
        console.error("Error fetching data:", error);
      }
    }
    fetchContentData();
  }, []);

  const shareData = async (title, body) => {
    const accessToken = 'EAAMdXvOXwUYBO1G3K1SYJZCGizOUcPSdtDZBZBYaj8tGR1tZBL4xYAShZCzy2m8ZAhwDd9k1TGIuuGdd3cikSRThDBQKCsgwqDXYWxjbac4IaI1L3RXjEP7boPAGXPiuNV7QaaE2NpKJ0mZBDWWLfpfihNF0lXxcvZAHIArd8gTw2p5kZAyvTXTBYkTDzzRTj7vKm7HkEuQUHneE8ldzqGcoO7DUWvKVEjERZB'; 
    const pageId = '876718581072198'; 
    const facebookGraphApiUrl = `https://graph.facebook.com/${pageId}/feed`;

    try {
      const response = await axios.post(facebookGraphApiUrl, {
        message: `${title}\n\n${body}`,
        access_token: accessToken,
      });

      if (response.status === 200) {
        alert("Content shared successfully on Facebook!");
      } else {
        alert("Failed to share content on Facebook.");
      }
    } catch (error) {
      console.error("Error sharing content:", error);
      alert("An error occurred while sharing the content.");
    }
  };

  return (
    <div className="content">
      <h1>SHARE CONTENT</h1>
      {error && <p className="error">{error}</p>}
      <div className="Share-content">
        {shareContent.map((content) => (
          <div key={content.id} className="share">
            <h3>{content.title}</h3>
            <p>{content.body}</p>
            <button onClick={() => shareData(content.title, content.body)}>
              Share on Facebook
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
