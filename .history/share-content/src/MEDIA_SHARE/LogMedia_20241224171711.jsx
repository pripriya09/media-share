import React, { useEffect } from "react";
import axios from "axios";

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
      if (!window.FB) return;
      FB.init({
        appId: "8093079670819639", // Replace with your Facebook App ID
        cookie: true,
        xfbml: true,
        version: "v21.0",
      });
    };
  }, []);

  // Unified Login Handler
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
            console.log(`${type} login cancelled or not authorized.`);
          }
        },
        { scope: scopes[type] }
      );
    } else {
      console.error("Facebook SDK is not loaded.");
    }
  };

  // Fetch Facebook Pages and Check Instagram Link
  const getPages = async (userAccessToken, type) => {
    try {
      const response = await axios.get("https://graph.facebook.com/v21.0/me/accounts", {
        params: { access_token: userAccessToken },
      });

      const pages = response.data.data;
      if (pages && pages.length > 0) {
        const targetPage = pages.find((page) => page.instagram_business_account);
        if (targetPage) {
          const pageAccessToken = targetPage.access_token;
          localStorage.setItem("pageAccessToken", pageAccessToken);

          console.log("Page Access Token:", pageAccessToken);

          if (type === "instagram") {
            const instagramBusinessAccountId = targetPage.instagram_business_account.id;
            console.log("Instagram Business Account ID:", instagramBusinessAccountId);
          }
        } else {
          alert(
            "No Instagram business account linked to this page. Please link your Instagram account to a Facebook Page."
          );
        }
      } else {
        alert("No pages found for this account.");
      }
    } catch (error) {
      console.error("Error fetching pages:", error.message);
      alert("There was an issue fetching your Facebook pages. Please try again.");
    }
  };

  return (
    <div>
      <h2>Social Media Login</h2>
      <div>
        <h3>Facebook Login</h3>
        <button onClick={() => handleLogin("facebook")}>Login with Facebook</button>
      </div>
      <br />
      <div>
        <h3>Instagram Login</h3>
        <button onClick={() => handleLogin("instagram")}>Login with Instagram</button>
      </div>
    </div>
  );
}

export default LogMedia;
