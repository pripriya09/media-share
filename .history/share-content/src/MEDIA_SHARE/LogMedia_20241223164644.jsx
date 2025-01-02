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
  const handleFBLogin = () => {
    if (window.FB) {
      FB.login(
        (response) => {
          if (response.authResponse) {
            console.log("Facebook login successful!", response);

            const userAccessToken = response.authResponse.accessToken;
            localStorage.setItem("facebook_userAccessToken", userAccessToken);

            // Fetch Pages
            getPages(userAccessToken);
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },
        {
          scope: "pages_show_list,pages_read_engagement,business_management,pages_manage_posts,pages_read_user_content",
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

            // Fetch Pages
            getPages(userAccessToken);
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },
        {
          scope:"instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insightsinstagram_shopping_tag_products,pages_show_list,pages_read_engagement,Instagram Public Content Access," 
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
        // Find page with Instagram business account
        const targetPage = pages.find((page) => page.instagram_business_account);
  
        if (targetPage) {
          const pageAccessToken = targetPage.access_token;
          localStorage.setItem("pageAccessToken", pageAccessToken); // Store page access token
        } else {
          alert("No Instagram business account linked to this page.");
        }
      } else {
        alert("No pages found for this account.");
      }
    } catch (error) {
      console.error("Error fetching pages:", error);
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
