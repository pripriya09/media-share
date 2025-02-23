import React, { useEffect } from "react";
import axios from "axios"

function LogMedia() {
  useEffect(() => {
    // Load Facebook SDK
    (function (d, s, id) {
      let js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    // Initialize FB SDK
    window.fbAsyncInit = function () {
      FB.init({
        appId: "8093079670819639", // Replace with your Facebook App ID
        cookie: true,
        xfbml: true,
        version: "v21.0",
      });
    };
  }, []);

  // Facebook Login Handler
  const handleLogin = (type) => {
    if (window.FB) {
      const scopes = {
        facebook:
          "pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_comments,instagram_manage_insights",
        instagram:
          "instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement",
      };
      FB.login(
        async (response) => {
          if (response.authResponse) {
      
            console.log(`${type} login successful!`, response);

            const userAccessToken = response.authResponse.accessToken;
            localStorage.setItem(`${type}_userAccessToken`, userAccessToken);
  // Fetch Pages and handle logic
  await getPages(userAccessToken, type);
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },
        {
          scope: "instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,instagram_shopping_tag_products,pages_show_list,pages_read_engagement"
          ,
        }
      );
    } else {
      console.log("Facebook SDK is not loaded.");
    }
  };

  // Instagram Login Handler (Same as Facebook Login with Independent Storage)
  const handleInstagramLogin = () => {
    if (window.FB) {
      FB.login(
        (response) => {
          if (response.authResponse) {
            console.log("Instagram login successful!", response);
  
            const userAccessToken = response.authResponse.accessToken;
            localStorage.setItem("instagram_userAccessToken", userAccessToken);
  
            // Fetch Pages and linked Instagram accounts
            getPages(userAccessToken);
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },
        {
          scope:
            "instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,instagram_shopping_tag_products,pages_show_list,pages_read_engagement",
        }
      );
    } else {
      console.log("Facebook SDK is not loaded.");
    }
  };
  
  const getPages = async (userAccessToken) => {
    try {
      const response = await axios.get("https://graph.facebook.com/v21.0/me/accounts", {
        params: { access_token: userAccessToken },
      });
  
      const pages = response.data.data;
      if (pages && pages.length > 0) {
        const targetPage = pages.find((page) => page.instagram_business_account);
        if (targetPage) {
          const pageAccessToken = targetPage.access_token;
          localStorage.setItem("pageAccessToken", pageAccessToken); // Store page access token
          console.log("pageAccessToken",pageAccessToken)
  
          // Optional: Check if Instagram account is correctly linked to the page
          const instagramBusinessAccountId = targetPage.instagram_business_account.id;
          console.log("Instagram Business Account ID:", instagramBusinessAccountId);
        } else {
          alert("No Instagram business account linked to this page. Please link your Instagram account to a Facebook Page.");
        }
      } else {
        alert("No pages found for this account.");
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
      alert("There was an issue fetching your Facebook pages. Please try again.");
    }
  };
   return (<>
    <div>
      <h2>Social Media Login</h2>
 <h2> Facebook Login Button </h2>
     
      <button onClick={handleFBLogin}>Login with Facebook</button>
      </div>
<br/>
<div>
     <h2>Instagram Login Button</h2>
      <button onClick={handleInstagramLogin}>Login with Instagram</button>
    </div>
    </>);
}

export default LogMedia;
