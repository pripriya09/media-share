import React, { useEffect, useState } from "react";
import axios from "axios";

function LogMedia() {
  const [userData, setUserData] = useState(null);

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

            // Fetch Pages and Linked Instagram Account
            getPagesAndInstagramAccount(userAccessToken);
          } else {
            console.log("User cancelled login or did not fully authorize.");
          }
        },
        {
          scope:
            "pages_show_list,pages_read_engagement,instagram_basic,instagram_manage_comments,instagram_manage_insights",
        }
      );
    } else {
      console.log("Facebook SDK is not loaded.");
    }
  };

  // Function to get pages and Instagram account
  const getPagesAndInstagramAccount = async (userAccessToken) => {
    try {
      // const appSecretProof = generateAppSecretProof(userAccessToken, APP_SECRET);

      // Fetch Pages the user manages (with appsecret_proof)
      const response = await axios.get(
        "https://graph.facebook.com/v21.0/me/accounts",
        {
          params: {
            access_token: userAccessToken,
            appsecret_proof: appSecretProof,
          },
        }
      );

      // Log the response to inspect its structure
      console.log("Pages Response: ", response.data);

      const pages = response.data.data;

      if (pages && pages.length > 0) {
        const targetPage = pages.find((page) => page.instagram_business_account);

        if (targetPage) {
          const instagramBusinessAccountId = targetPage.instagram_business_account.id;
          const instagramUsername = targetPage.instagram_business_account.username;
          console.log("Instagram Business Account ID:", instagramBusinessAccountId);
          console.log("Instagram Username:", instagramUsername);

          // Store Instagram Business Account ID for further use
          localStorage.setItem("instagramBusinessAccountId", instagramBusinessAccountId);

          // Update the user data state
          setUserData({
            facebookAccessToken: userAccessToken,
            instagramBusinessAccountId,
            instagramUsername,
          });
        } else {
          console.log("No Instagram business account linked to this page.");
        }
      } else {
        console.log("No pages found for this user.");
      }
    } catch (error) {
      console.error("Error fetching Instagram account details:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <div>
        <h2>Login</h2>
        <button onClick={handleFBLogin}>Login with Facebook</button>
      </div>
      {userData && (
        <div>
          <h3>User Data</h3>
          <p>Facebook Token: {userData.facebookAccessToken}</p>
          <p>Instagram Username: {userData.instagramUsername}</p>
          <p>Instagram Account ID: {userData.instagramBusinessAccountId}</p>
        </div>
      )}
    </>
  );
}

export default LogMedia;
