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
import authocontroll from "./controllers/authocontroll.js"


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
    origin: "http://localhost:5173",
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

app.post("/postOnFB", async (req, res) => {
  const { title, image } = req.body;
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  const PAGE_ID = process.env.PAGE_ID;

  try {
    const titlePostResponse = await axios.post(
      `https://graph.facebook.com/${PAGE_ID}/feed`,
      {
        message: title,
        access_token: PAGE_ACCESS_TOKEN,
      }
    );
    console.log("Text Post Response:", titlePostResponse.data);

    if (image) {
      const imagePostResponse = await axios.post(
        `https://graph.facebook.com/${PAGE_ID}/photos`,
        {
          url: image,
          access_token: PAGE_ACCESS_TOKEN,
          caption: title,
        }
      );
      console.log("Image Post Response:", imagePostResponse.data);
    }

    // res.status(200).json({
    //   message: "Post successfully uploaded",
    //   titlePost: titlePostResponse.data,
    // }
    res.json(200,{
        message: "Post successfully uploaded",
        titlePost: titlePostResponse.data,
      }
    ,
    console.log({title:"title"}));
  } catch (err) {
  
    console.error(
      "Error in postOnFB:",
      err.response ? err.response.data : err.message
    );


    res.status(400).json({
      error: err.response ? err.response.data : "Error posting to Facebook",
    });
  }
});

// Endpoint to post on Instagram
app.post('/postOnIG', async (req, res) => {
  const { title, image } = req.body;
  const INSTAGRAM_ACCESS_TOKEN = process.env.ACCESS_TOKEN;
  const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_ACCOUNT_ID;

  try {
    // Step 1: Create a Media Object
    const mediaResponse = await axios.post(
      `https://graph.facebook.com/v21.0/${INSTAGRAM_ACCOUNT_ID}/media`,
      {
        image_url: image,
        caption: title,
        access_token: INSTAGRAM_ACCESS_TOKEN,
      }
    );
    console.log("title post successfully",mediaResponse.data);
    console.log("image post on instagram",mediaResponse.data)

    const creationId = mediaResponse.data.id;

    // Step 2: Publish the Media Object
    await axios.post(
      `https://graph.facebook.com/v12.0/${INSTAGRAM_ACCOUNT_ID}/media_publish`,
      {
        creation_id: creationId,
        access_token: INSTAGRAM_ACCESS_TOKEN,
      }
    );

    res.status(200).send({ message: 'Post shared on Instagram!' });
  } catch (error) {
    console.error('Error posting on Instagram:', error.response.data);
    res.status(500).send({ error: error.response.data.error.message });
  }
});
 
// ----------------------------------------------------------------------
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
 
// ----------------------------------------------------------------------------------------
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


// -----------------------------------------------------------------------------
// long -live-access-token(60day) for instagram

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

app.listen(port, () => {
  console.log("Server started");
});


