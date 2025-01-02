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




const box =[1,2,3,4,,5,6]
const remove2ele = box