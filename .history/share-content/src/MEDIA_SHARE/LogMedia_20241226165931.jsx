import React, { useEffect, useState } from "react";
import axios from "axios";

function LogMedia() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

            // Fetch Pages and Linked Instagram Account via API
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

  // Instagram Login Handler (via Facebook Login)
  const handleInstagramLogin = () => {
    const userAccessToken = localStorage.getItem("facebook_userAccessToken");
    if (!userAccessToken) {
      alert("Please log in with Facebook first.");
      return;
    }

    // Fetch Pages and Linked Instagram Account via API
    getPagesAndInstagramAccount(userAccessToken);
  };

  // Fetch Pages and Linked Instagram Account from Backend
  const getPagesAndInstagramAccount = async (userAccessToken) => {
    try {
      setLoading(true);
      setError(null);

      // Send Facebook access token to the backend to get pages and linked Instagram account
      const response = await axios.post(
        "http://localhost:8006/auth/home/loginmedia", // Your backend URL
        {
          facebookAccessToken: userAccessToken,
        }
      );

      const data = response.data;

      if (data.instagramBusinessAccountId && data.instagramUsername) {
        // Store Instagram details and Facebook token
        localStorage.setItem("instagramBusinessAccountId", data.instagramBusinessAccountId);

        // Update the user data state
        setUserData({
          facebookAccessToken: userAccessToken,
          instagramBusinessAccountId: data.instagramBusinessAccountId,
          instagramUsername: data.instagramUsername,
        });
      } else {
        setError("No Instagram business account linked to the Facebook page.");
      }
    } catch (error) {
      console.error("Error fetching pages or Instagram account:", error);
      setError("Failed to fetch Instagram account details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2>Login</h2>
        <button onClick={handleFBLogin}>Login with Facebook</button>
        <button onClick={handleInstagramLogin}>Login with Instagram</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
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
