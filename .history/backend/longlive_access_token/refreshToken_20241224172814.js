// import axios from "axios";
// import dotenv from "dotenv";
// // import fs from "fs";
// import crypto from "crypto"; // Required for generating appsecret_proof

// dotenv.config();



// // Your App Secret and User Access Token
// const appSecret =process.env.APP_SECRET;
// const userAccessToken = process.env.PAGE_ACCESS_TOKEN;

// // Function to generate App Secret Proof
// function generateAppSecretProof(userAccessToken, appSecret) {
//     const hash = crypto.createHmac('sha256', appSecret)
//                         .update(userAccessToken)
//                         .digest('hex');
//     return hash;
// }

// const appSecretProof = generateAppSecretProof(userAccessToken, appSecret);
// console.log('App Secret Proof for facebook:', appSecretProof);


// -----------------------------------------------------------------------------------------------------------------> 
// Helper function to generate appsecret_proof
// const generateAppSecretProof = (accessToken, appSecret) => {
//   return crypto
//     .createHmac("sha256", appSecret)
//     .update(accessToken)
//     .digest("hex");
// };

// // Function to check the token's status
// const checkToken = async () => {
//   try {
//     const debugUrl = "https://graph.facebook.com/v21.0/debug_token";
//     const appSecretProof = generateAppSecretProof(
//       process.env.PAGE_ACCESS_TOKEN,
//       process.env.APP_SECRET
//     );

//     const params = {
//       input_token: process.env.PAGE_ACCESS_TOKEN, // Your current long-lived token
//       access_token: `${process.env.APP_ID}|${process.env.APP_SECRET}`, // Use the app-level token for debug
//       appsecret_proof: appSecretProof, // Provide the appsecret_proof
//     };

//     const response = await axios.get(debugUrl, { params });
//     const { expires_at } = response.data.data; // Expiration timestamp
//     console.log("Token Expires At:", new Date(expires_at * 1000)); // Display expiration date

    // Check if the token is about to expire within 7 days
//     if (expires_at * 1000 - Date.now() < 7 * 24 * 60 * 60 * 1000) {
//       console.log("Token is about to expire. Refreshing...");
//       await refreshToken(); // Refresh the token
//     } else {
//       console.log("Token is still valid.");
//     }
//   } catch (error) {
//     console.error("Error checking token:", error.response?.data || error.message);
//   }
// };

// Function to refresh the token
// const refreshToken = async () => {
//   try {
//     const refreshUrl = "https://graph.facebook.com/v21.0/oauth/access_token";
//     const params = {
//       grant_type: "fb_exchange_token",
//       client_id: process.env.APP_ID,
//       client_secret: process.env.APP_SECRET,
//       fb_exchange_token: process.env.PAGE_ACCESS_TOKEN, // Current token
//     };

//     const response = await axios.get(refreshUrl, { params });
//     const newToken = response.data.access_token;
//     console.log("New Long-Lived Token:", newToken);

//     // Save the new token securely in the `.env` file
//     let envContent = fs.readFileSync(".env", "utf-8");
//     if (envContent.includes("PAGE_ACCESS_TOKEN")) {
//       envContent = envContent.replace(
//         /PAGE_ACCESS_TOKEN=.*/,
//         `PAGE_ACCESS_TOKEN=${newToken}`
//       );
//     } else {
//       envContent += `\nPAGE_ACCESS_TOKEN=${newToken}`;
//     }
//     fs.writeFileSync(".env", envContent);
//     console.log("New token saved successfully to .env file!");
//   } catch (error) {
//     console.error("Error refreshing token:", error.response?.data || error.message);
//   }
// };

// Run the token check
// checkToken();
// ------------------------------------------------------------------------------------------------->refreshToken===> 

// async function verifyFacebookToken(accessToken) {
//   const url = `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`;
//   try {
//       const response = await axios.get(url);
//       return response.data; // Contains user's Facebook data like id, name, and email
//   } catch (error) {
//       console.error('Error verifying Facebook token:', error);
//       throw error;
//   }
// }

// app.get('/facebook-auth', (req, res) => {
//   const { access_token } = req.query;
//   // Call the function to verify the token and retrieve user data
//   verifyFacebookToken(access_token)
//       .then((userData) => {
//           // You can now log the user in, create a session, or generate a JWT token for your app
//           res.json({ message: 'Logged in successfully', userData });
//       })
//       .catch((error) => {
//           res.status(400).json({ error: 'Invalid token or other error' });
//       });
// });
  
// ----------------------------------------------------------------------------------------------------- END ,<<<<==========||



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

      