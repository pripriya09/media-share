
// ---------------------------------------------------------------------- for facebook page ==> >>>
// for longlive access token for facebook page 

// const appId = process.env.APP_ID;
// const appSecret =process.env.APP_SECRET;
// const pageshortLivedToken =process.env.SHORT_PAGE_ACCESS_TOKEN ;

// const url = `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${pageshortLivedToken}`;

// axios
//   .get(url)
//   .then(response => {
//     console.log("Long-lived Token:", response.data.access_token);
//   })
//   .catch(error => {
//     console.error("Error converting token:", error.response.data);
//   });
 
// ---------------------------------------------------------------------------------------->>>>>
// JUST TO CHECK IF API IS WORKING OR NOT (MOCK Facebook API)

// app.post("/postOnFB", async (req, res) => {
//   const { title, image } = req.body;
//   console.log("Received title:", title);
//   console.log("Received image URL:", image);
//   res.status(200).json({
//     message: "Test successful",
//     titleReceived: title,
//     imageReceived: image,
//   });
// });


// -----------------------------------------------------------------------long -live-access-token(60day) for instagram ==>>>>>.

// async function getLongLivedAccessToken(shortLivedToken) {
//   const appId = process.env.APP_ID;
//   const appSecret = process.env.APP_SECRET;

//   try {
//     const response = await axios.get(`https://graph.facebook.com/v21.0/oauth/access_token`, {
//       params: {
//         grant_type: 'fb_exchange_token',
//         client_id: appId, 
//         client_secret: appSecret,
//         fb_exchange_token: shortLivedToken,
//       },
//     });

//     const longLivedAccessToken = response.data.access_token;
//     console.log('Long-Lived Access Token:', longLivedAccessToken);
//     return longLivedAccessToken;
//   } catch (error) {
//     console.error('Error getting long-lived access token:', error.response ? error.response.data : error.message);
//   }
// }

// const shortLivedToken = process.env.SHORT_ACCESS_TOKEN;
// getLongLivedAccessToken(shortLivedToken);