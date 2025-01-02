// import axios from 'axios';
// import oauth from 'oauth-1.0a';
// import crypto from 'crypto';

// // Twitter API credentials
// const twitterConfig = {
//   consumerKey: process.env.TWITTER_CONSUMER_KEY,
//   consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//   accessToken: process.env.TWITTER_ACCESS_TOKEN,
//   accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
// };

// // Set up OAuth 1.0a
// const oauthClient = oauth({
//   consumer: {
//     key: twitterConfig.consumerKey,
//     secret: twitterConfig.consumerSecret,
//   },
//   token: {
//     key: twitterConfig.accessToken,
//     secret: twitterConfig.accessTokenSecret,
//   },
//   signature_method: 'HMAC-SHA1',
//   hash_function(base_string, key) {
//     return crypto.createHmac('sha1', key).update(base_string).digest('base64');
//   },
// });

// // Upload image function
// async function uploadImageToTwitter(imageUrl) {
//     const imageData = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//     const imageBuffer = Buffer.from(imageData.data);
  
//     const mediaUploadEndpoint = 'https://upload.twitter.com/1.1/media/upload.json';
    
//     // Prepare the OAuth signature for the media upload request
//     const data = {
//       media_data: imageBuffer.toString('base64'),
//     };
  
//     const requestData = {
//       url: mediaUploadEndpoint,
//       method: 'POST',
//       data,
//     };
  
//     const headers = oauthClient.toHeader(oauthClient.authorize(requestData));
    
//     // Make the request to upload media
//     const response = await axios.post(mediaUploadEndpoint, data, {
//       headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
//     });
  
//     return response.data.media_id_string;
//   }
// // Post tweet with image
// async function postTweetWithImage(title, imageId) {
//     const tweetEndpoint = 'https://api.twitter.com/1.1/statuses/update.json';
    
//     const data = {
//       status: title, // The tweet text
//       media_ids: imageId, // Attach the uploaded image by media_id
//     };
  
//     const requestData = {
//       url: tweetEndpoint,
//       method: 'POST',
//       data,
//     };
  
//     const headers = oauthClient.toHeader(oauthClient.authorize(requestData));
    
//     // Make the request to post the tweet
//     const response = await axios.post(tweetEndpoint, data, {
//       headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
//     });
  
//     return response.data;
//   }
    


// --------------------------------------------------------------------------------- GET FROM UPLOADSHARE.JS  >>>>>> 
56785678

// Your Twitter API credentials (store these in .env for security)

// const client = new TwitterApi({
//   appKey: process.env.YOUR_TWITTER_APP_KEY,
//   appSecret: process.env.YOUR_TWITTER_APP_SECRET,
//   accessToken: process.env.YOUR_ACCESS_TOKEN,
//   accessSecret: process.env.YOUR_ACCESS_TOKEN_SECRET,
// });

// app.post('/postOnTwitter', async (req, res) => {
//   const { title, image } = req.body; // `image` should be a URL to the image

//   try {
//     // Fetch image data from the URL
//     const response = await axios.get(image, { responseType: 'arraybuffer' });
//     const imageBuffer = Buffer.from(response.data);

//     // Upload the image buffer to Twitter (v1.1)
//     const mediaId = await client.v1.uploadMedia(imageBuffer, {
//       mimeType: EUploadMimeType.Jpeg, // Use the correct mime type (e.g., Webp, Jpeg)
//     });

//     // Post tweet with the uploaded image (v1.1)
//     const tweet = await client.v1.tweet({ status: title, media_ids: [mediaId] });

//     res.json(tweet);
//   } catch (error) {
//     console.error('Error posting on Twitter:', error);
//     res.status(500).json({ error: 'Failed to share post on Twitter', details: error.message });
//   }
// });
//--------------------------------------------------------------------------------<<<<<<< 