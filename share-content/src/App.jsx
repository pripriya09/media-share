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

  // const shareData = async (title, body) => {
  //   const facebookPageAccessToken = 'EAAPECxX3sZBoBO2cdJnMQWVtpGTZChxnThg4hjQ46Y0zGmBbuH1ho2XXoTZApfGtgMfzZCvy9lQgrgwUvMZAygJZAqcUZBZAeWQq89P5fnCgAvs4d8ECUDdNnZBOfxsLg8HKtXLfXX8OpbXlsrBkZBcKrRs9rl1p0HpofaFwSZBosjejwNqBcrP1jqd6EY0xRZAIfehyRvsUJxVPsWEYM3byPqoSvhmoIhXPzOx5JlOYNNNEGpS5aBZAGTpW0i7ZBCZBNjsIzuLEotw3wZDZD' ;

  //   const pageId = 122096193218549805

  //   ;
  //   const facebookGraphApiUrl = `https://graph.facebook.com/${pageId}/feed?access_token=${facebookPageAccessToken}`;

  //   try {
  //     const response = await axios.post(facebookGraphApiUrl, {
  //       message: `${title}\n\n${body}`,
  //     });

  //     if (response.status === 200) {
  //       alert("Content shared successfully on Facebook!");
  //     } else {
  //       alert("Failed to share content on Facebook.");
  //     }
  //   } catch (error) {
  //     console.error("Error sharing content:", error);
  //     alert("An error occurred while sharing the content.");
  //   }
  // };

  return (
    <>
      <div className="content">
        <h1>SHARE CONTENT</h1>
        <div className="Share-content">
          {ShareContent.map((content, index) => (
            <div key={index} className="share">
              <h3>{content.title}</h3>
              <p>{content.body}</p>
              <button onClick={() => shareData(content.title, content.body)}>
                Share on Facebook
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;




