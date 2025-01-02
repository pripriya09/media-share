import { createHmac } from 'crypto';


const accessToken ="EABzAnPLrCzcBO8ziZBzcHXTMGlQdASEd8fu9ZAaWp3hnKlk1TZAVvf0eGYB2lGERFuZC1z5sXLJC13KFsdpbZAliGZCYfjHwVBlCzhpyJOs33k5Jw24K81DtzMwSSW4OFiMXKxCDU26aFCSumdePe5KPyz1kl1aIEVM0MF0RVitc2cVWPaygTTuhf2br2YKhJ2k0vFXXRJVwZDZD"
// "EABzAnPLrCzcBO8qZBKiCffyX5hurwIFpFhVlV31WcdLUoXzV1E3mPGZBp7z5nrKwg6ZCj2VhYXyXwEKNxucUs0zs9seJM15eh0dBUsfYIUZA9m0ZBAgTUT4N26aUXRm0tgSPrQIZAZCkYHB6h9wR1wf5hA6w5hRcf0hXeATR4Lf6Pub9QPBGFaTLw9HCZAQYWj9FNZBfDZCGuh"
const appSecret = 'ba2cde3eb21e99827d5f82211f8e2c33';

const appsecret_proof = createHmac('sha256', appSecret)
    .update(accessToken)
    .digest('hex');

console.log('appsecret_proof:', appsecret_proof);

// use this method to generate appsecret_proof ------- >

// function generateAppSecretProof(accessToken, appSecret) {
//   return crypto.createHmac('sha256', appSecret)
//                .update(accessToken)
//                .digest('hex');
// }

// const accessToken = 'your_current_access_token'; // or your long-live token or user token etc..
// const appSecret = 'your_app_secret';
// const appSecretProof = generateAppSecretProof(accessToken, appSecret);

// console.log(appSecretProof);

// <------------------------------------------- 

// user accessToken when user login =
// "EABzAnPLrCzcBO9CZAF3KnHZBL8BsHQO4ZBaSS9ZAEj4vJTbJpMNYT5GorpJCvQrwgZBaZA2kZBUa4UZCbyPpDiFk8d02nlu4Kz6xwmZCChom50AiZBa2yr6yrCCZBVCyzY0imRSJZAChbPOuoU7MeZCZCFbT1eQIvMlqzT7q0vyUtjBqcZBkJUec7zP3lneDl4YUYvuRfCJqwZDZD"
// and appsecret_proof that came   =265e29878440ab98f057f95a6f371557c6526ad025e19ab8cd600128b3a51962

// after using this and me/account i gotta user new page accessToken ="EABzAnPLrCzcBO5nWVXA7MARyWxKBtO7qVZC8kTbE3HmvChclaAbuiSS7ZAbvRryFUgzuqK5kPcV18ezBQ4TB2RVYFIwH3hqTSkYZBcvoZA6EwGCSY6vy09pZBCsxGrYcvehObTL6yr3w4FACMo6wlkQshqZB3FkoSE3lFIAdvwSh2RuhgWLD6S0Ik3JsZClVim3hvZBJi191"
// const appSecret = 'ba2cde3eb21e99827d5f82211f8e2c33';
// and page id  and using new user page accessToken now again create a new appsecret_proof that is =bdde60d09136785d29be5683d143ac353f5b87c0ad7ad51d876220ef6a110f10;  


// full process : first user log their facebook account and get user accessToken .then use this token to create a appsecret_proof after that user this appsecret_proof and user accessToken to get user pageid and name , a new  page accessToken for user using(Get ,me/accounts), after user user new page accessToken to create new appsecret_proof and then finally we can use new appsecret_proof and user page accessToken and and id to post on facebook page of the user using (POST,http://graph.facebook.com/{page_id}/feed) and body row json me message and page access token of the user and parameter me new user appsecret_proof to                   

// import axios from 'axios';
// import dotenv from "dotenv";


// dotenv.config();

// // Your Facebook app's credentials
// const appId =  process.env.APP_ID;
// const appSecret =process.env.APP_SECRET
// const longLivedToken =process.env.PAGE_ACCESS_TOKEN

// // Function to check token status
// const checkTokenExpiration = async () => {
//   try {
//     const response = await axios.get(`https://graph.facebook.com/v21.0/debug_token`, {
//       params: {
//         input_token: longLivedToken,
//         access_token: `${appId}|${appSecret}`, // Your app's access token, should be used on backend
//       },
//     });

//     const data = response.data.data;

//     if (data.is_valid) {
//       console.log('Token is valid');
//       console.log('Token expires at:', new Date(data.expires_at * 1000)); // Convert to human-readable date
//     } else {
//       console.log('Token is invalid or expired');
      // Optionally, refresh the token here
    //   await refreshFacebookToken();
//     }
//   } catch (error) {
//     console.error('Error checking token:', error.response ? error.response.data : error.message);
//   }
// };

// Function to refresh Facebook token
// const refreshFacebookToken = async () => {
//   try {
//     const response = await axios.get(`https://graph.facebook.com/v21.0/oauth/access_token`, {
//       params: {
//         grant_type: 'fb_exchange_token',
//         client_id: appId,
//         client_secret: appSecret,
//         fb_exchange_token: longLivedToken,
//       },
//     });

//     const newToken = response.data.access_token;
//     console.log('Successfully refreshed Facebook token:', newToken);

//     // Save the new token securely (e.g., in a database or .env file)
//   } catch (error) {
//     console.error('Error refreshing Facebook token:', error.response ? error.response.data : error.message);
//   }
// };

// Call the function to check token status
// checkTokenExpiration();
// --------------------------------------------------------------- 



 // const postToTwitter = async (cont) => {
  //   const imageUrl = cont.image; // Assuming image URL is provided

  //   axios
  //     .post('http://192.168.0.38:8006/postOnTwitter', {
  //       title: cont.title,
  //       image: imageUrl
  //     })
  //     .then((postRES) => {
  //       console.log('Post shared on Twitter successfully:', postRES.data);
  //       alert('Post shared on Twitter successfully!');
  //     })
  //     .catch((err) => {
  //       console.error('Error sharing post on Twitter:', err);
  //       if (err.response) {
  //         console.error('Response data:', err.response.data);
  //         alert('Error: ' + err.response.data.error.message);
  //       } else {
  //         alert('Failed to share post on Twitter. Please try again.');
  //       }
  //     });
  // };