// uploadShare.js is frontent(share-content) ,share.jsx file
import express from "express";
import cors from "cors"
import multer from "multer";
import mongoose from "mongoose";
import path from "path";
import axios from "axios";
import fs from "fs";
import cloudinary from "cloudinary";
// import { TwitterApi } from 'twitter-api-v2';
import dotenv from "dotenv";
import authocontroll from "./controllers/authocontroll.js";
// import { TwitterApi,EUploadMimeType } from 'twitter-api-v2';
import crypto from "crypto";


const app = express();
const port = 8006;


dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(express.json());
app.use(
  cors({
    origin:[
       "http://localhost:5174","http://localhost:5173",
       "http://192.168.0.38:8006",
    "https://6ce3-110-235-229-26.ngrok-free.app",
    ]
  })
);
app.use("/uploads", express.static("uploads"));
app.use('/auth', authocontroll);

mongoose
  .connect("mongodb://localhost:27017/excelData")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueFile = Date.now() + path.extname(file.originalname);
    cb(null, uniqueFile);
  },
});
const upload = multer({ storage });

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const dataContent = mongoose.model("dataContent", ContentSchema);

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const cloudinaryResult = await cloudinary.v2.uploader.upload(req.file.path);
    const content = new dataContent({
      title: req.body.title,
      image: cloudinaryResult.secure_url,
    });
    await content.save();
    fs.unlinkSync(req.file.path); // remove the file after save
    res.status(200).json(content);
  } catch (err) {
    res.status(400).json({ error: "Error saving content", details: err });
  }
});

app.get("/upload", async (req, res) => {
  try {
    const fullData = await dataContent.find();
    res.status(200).json(fullData);
  } catch (err) {
    res.status(400).json({ error: "Error fetching data", details: err });
  }
});


app.get("/myPosts", async (req, res) => {
  try {
    const posts = await dataContent.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ error: "Error fetching posts", details: err });
  }
});


// Post on Facebook (Text and Image)
// app.post("/postOnFB", async (req, res) => {
  
// const APP_SECRET = process.env.APP_SECRET;  // Facebook App Secret
// const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;  // Page Access Token
// const PAGE_ID = process.env.PAGE_ID;  // Your Facebook Page ID

//   const { title, image, userAccessToken } = req.body;

//   if (!APP_SECRET) {
//     return res.status(400).json({ error: "App Secret is missing" });
//   }

//   if (!userAccessToken) {
//     return res.status(400).json({ error: "User access token is missing" });
//   }
  
// const appSecretProof = generateAppSecretProof(accessToken, APP_SECRET);
// console.log("Generated App Secret Proof:", appSecretProof);
// // console.log("get appSecretProof", appSecretProof);

//   try {
//     // Post the title to Facebook feed
//     const titlePostResponse = await axios.post(
//       `https://graph.facebook.com/${PAGE_ID}/feed`,
//       {
//         message: title,
//         access_token: PAGE_ACCESS_TOKEN,
//         appsecret_proof: appSecretProof,
//       }
//     );

//     console.log("Text Post Response:", titlePostResponse.data);

//     // If there's an image, upload it to the Facebook page
//     if (image) {
//       const imagePostResponse = await axios.post(
//         `https://graph.facebook.com/${PAGE_ID}/photos`,
//         {
//           url: image,
//           access_token: PAGE_ACCESS_TOKEN,
//           caption: title,
//           appsecret_proof: appSecretProof,
//         }
//       );
//       console.log("Image Post Response:", imagePostResponse.data);
//     }

//     // Send success response
//     res.json({
//       message: "Post on Facebook is successfully uploaded",
//       titlePost: titlePostResponse.data,
//     });
//   } catch (err) {
//     console.error("Error in postOnFB:", err.response ? err.response.data : err.message);

//     res.status(400).json({
//       error: err.response ? err.response.data : "Error posting to Facebook",
//     });
//   }
// });
// ------------------------------------------------------------------------------------------ facebook post --==>
const generateAppSecretProof = (accessToken, appSecret) => {
  return crypto
    .createHmac("sha256", appSecret)
    .update(accessToken)
    .digest("hex");
};

app.post("/postOnFB", async (req, res) => {
  const APP_SECRET = process.env.APP_SECRET; // Your App Secret
  const { userAccessToken, title, image } = req.body;

  if (!userAccessToken) {
    return res.status(400).json({ error: "User access token is required." });
  }
console.log("userAccessToken",userAccessToken)
  try {
    // Generate appsecret_proof using the User Access Token
    const appSecretProof = generateAppSecretProof(userAccessToken, APP_SECRET);
    console.log("Generated App Secret Proof:", appSecretProof);
console.log("appSecretProof",appSecretProof)


    // Step 1: Get Pages Managed by the User
    const pagesResponse = await axios.get(
      `https://graph.facebook.com/v21.0/me/accounts`,
      {
        params: {
          access_token: userAccessToken,
          appsecret_proof: appSecretProof,
        },
      }
    );

    const pages = pagesResponse.data.data;
  

    if (!pages || pages.length === 0) {
      return res.status(404).json({
        error: "No pages found for this user.",
      });
    }
    console.log("pages response-->",pages)
    // Select the target page (e.g., the first one or use a specific page ID)
    const targetPage = pages[0]; // Use `pages.find()` if searching for a specific page
    const PAGE_ID = targetPage.id;
    const PAGE_ACCESS_TOKEN = targetPage.access_token;

    console.log("Target Page ID:", PAGE_ID);
    console.log("Page Access Token:", PAGE_ACCESS_TOKEN);

    // Step 2: Generate App Secret Proof for the Page Access Token
    const pageAppSecretProof = generateAppSecretProof(PAGE_ACCESS_TOKEN, APP_SECRET);

    // Step 3: Post the Title to the Page Feed
    const titlePostResponse = await axios.post(
      `https://graph.facebook.com/v21.0/${PAGE_ID}/feed`,
      {
        message: title,
        access_token: PAGE_ACCESS_TOKEN,
        appsecret_proof: pageAppSecretProof,
      }
    );

    console.log("Text Post Response:", titlePostResponse.data);

    // Step 4: Post an Image (if provided)
    if (image) {
      const imagePostResponse = await axios.post(
        `https://graph.facebook.com/v21.0/${PAGE_ID}/photos`,
        {
          url: image,
          caption: title,
          access_token: PAGE_ACCESS_TOKEN,
          appsecret_proof: pageAppSecretProof,
        }
      );

      console.log("Image Post Response:", imagePostResponse.data);
    }

    res.json({
      message: "Post successfully uploaded to Facebook.",
      postId: titlePostResponse.data.id,
    });
  } catch (err) {
    console.error("Error in postOnFB:", err.response ? err.response.data : err.message);
    res.status(400).json({
      error: err.response ? err.response.data : "Error posting to Facebook.",
    });
  }
});



app.post("/home/loginmedia", async (req, res) => {
  const { facebookAccessToken } = req.body;

  if (!facebookAccessToken) {
    return res.status(400).json({ error: "Facebook access token is required." });
  }

  try {
    // Fetch pages the user manages
    const appSecretProof = generateAppSecretProof(facebookAccessToken, APP_SECRET);
    console.log("instagramUserGenerated App Secret Proof:", appSecretProof);

    const pageResponse = await axios.get(
      `https://graph.facebook.com/v21.0/me/accounts`,
      {
        params: { access_token: facebookAccessToken },
      }
    );

    const Inpages = pageResponse.data.data;

    if (!Inpages || Inpages.length === 0) {
      return res.status(404).json({ error: "No pages found for this user." });
    }
console.log("inpages-->",Inpages)
    // Find the Instagram account linked to the page
    const instagramPage = Inpages.find((page) => page.instagram_business_account);

    if (!instagramPage) {
      return res.status(400).json({
        error: "No Instagram business account linked to the Facebook page.",
      });
    }

    // Retrieve Instagram Access Token
    const instagramAccessToken = instagramPage.instagram_business_account.access_token;
    console.log("instagramAccessToken-->",instagramAccessToken)
    res.json({ instagramAccessToken });
  } catch (error) {
    console.error("Error fetching Instagram access token:", error.message);
    res.status(500).json({ error: "Error fetching Instagram token." });
  }
});




// --------------------------------------------------------- 

// // for instagrma login --------------------------------------------------------------
// app.get('/home/loginmedia', async (req, res) => {
//   const code = req.query.code;
//   const clientId = process.env.INSTAGRAM_APP_ID; // Instagram App ID
//   const clientSecret = process.env.INSTAGRAM_APP_SECRET; // Instagram App Secret
//   const redirectUri = process.env.REDIRECT_URI; // Redirect URI
// console.log("code",code)
//   if (!code) {
//     return res.status(400).send("Authorization code not found.");
//   }
//   try {
//     // Exchange the authorization code for an access token
//     const response = await axios.post("https://api.instagram.com/oauth/access_token", {
//       client_id: clientId,
//       client_secret: clientSecret,
//       grant_type: "authorization_code",
//       redirect_uri: redirectUri,
//       code: code,
//     });

//     const accessToken = response.data.access_token;
//     const userId = response.data.user_id;
//   console.log("accessToken",accessToken);
//   console.log("userId",userId);

//     res.json({ accessToken, userId });
//   } catch (error) {
//     console.error("Error fetching Instagram access token:", error.response?.data || error.message);
//     res.status(400).json({ error: "Failed to get Instagram access token." });
//   }
// });
// Endpoint to post on Instagram     

app.post("/postOnIG", async (req, res) => {
  const { pageAccessToken, title, image } = req.body;

  if (!pageAccessToken) {
    return res.status(400).json({ error: "Page access token is required." });
  }
  if (!title || !image) {
    return res.status(400).json({ error: "Title and image URL are required." });
  }

  try {
    const APP_SECRET = process.env.APP_SECRET;

    // Generate appsecret_proof for additional security
    const appSecretProof = generateAppSecretProof(pageAccessToken, APP_SECRET);

    // Step 1: Fetch Pages Managed by the User
    const pagesResponse = await axios.get(`https://graph.facebook.com/v21.0/me/accounts`, {
      params: {
        access_token: pageAccessToken,
        appsecret_proof: appSecretProof,
      },
    });

    const pages = pagesResponse.data.data;
    if (!pages || pages.length === 0) {
      return res.status(404).json({ error: "No Facebook pages found for this user." });
    }

    // Step 2: Find the Page Linked to the Instagram Business Account
    const targetPage = pages.find((page) => page.instagram_business_account);
    if (!targetPage) {
      return res.status(400).json({
        error: "No Instagram business account linked to any Facebook page.",
      });
    }

    const PAGE_ACCESS_TOKEN = targetPage.access_token;
    const INSTAGRAM_ACCOUNT_ID = targetPage.instagram_business_account.id;

    // Step 3: Generate appsecret_proof for the Page Access Token
    const pageAppSecretProof = generateAppSecretProof(PAGE_ACCESS_TOKEN, APP_SECRET);

    // Step 4: Create a Media Object for Instagram
    const mediaResponse = await axios.post(
      `https://graph.facebook.com/v21.0/${INSTAGRAM_ACCOUNT_ID}/media`,
      {
        image_url: image,
        caption: title,
        access_token: PAGE_ACCESS_TOKEN,
        appsecret_proof: pageAppSecretProof,
      }
    );

    // Step 5: Publish the Media Object
    const creationId = mediaResponse.data.id;

    const publishResponse = await axios.post(
      `https://graph.facebook.com/v21.0/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        creation_id: creationId,
        access_token: PAGE_ACCESS_TOKEN,
        appsecret_proof: pageAppSecretProof,
      }
    );

    res.status(200).json({
      message: "Post successfully shared on Instagram!",
      postId: publishResponse.data.id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.response?.data?.error?.message || "Error occurred while posting on Instagram.",
    });
  }
});

app.listen(port, () => {
  console.log("Server started",port);
});
