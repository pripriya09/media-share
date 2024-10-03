import express from "express";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import path from "path";
import axios from "axios";
import fs from "fs";
import cloudinary from "cloudinary";


const app = express();
const port = 8006;

cloudinary.v2.config({
  cloud_name: "duxyg4pvf", // Replace with your Cloudinary cloud name
  api_key: "654743973592187", // Replace with your Cloudinary API key
  api_secret: "04oq9vf2ihRmZmxU_ZA3StdYyco", // Replace with your Cloudinary API secret
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
// app.use("/uploads", express.static("uploads"));

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

// app.post("/postOnFB", async (req, res) => {
//   const { title, image } = req.body;
//   const PAGE_ACCESS_TOKEN =
//     "EAAHGb1E3XmIBO5xN8inq2PtfRzcjTgPC65YQ4gioMy9aQMlwEbK6OJU5KdC2wZA6zFwvDaN1rVHDbJqmyZCJJPlJ6a9V8l0oYK4TwiTbLPkb8x1xZCaMytgmAZCXBvUHaA1lc0zLF2uH1DUeKLm2ksUfQcrD8oX5Wmq9U5PhXP7ZAJTSgZBmHkaG9ZCgzZBCCvnGZA6UovW29iCa2VzGXYZC4RGlL43ZACoZCZCB0";
//   const PAGE_ID = "428233347043737";

//   try {
//     const titlePostResponse = await axios.post(
//       `https://graph.facebook.com/${PAGE_ID}/feed`,
//       {
//         message: title,
//         access_token: PAGE_ACCESS_TOKEN,
//       }
//     );
//     console.log("Text Post Response:", titlePostResponse.data);
//     if (image) {
//       // const imagePath = `http://localhost:8006/uploads/${image}`;

//       const imagePostResponse = await axios.post(
//         `https://graph.facebook.com/${PAGE_ID}/photos`,
//         {
//           url: image,
//           access_token: PAGE_ACCESS_TOKEN,
//           caption: title,
//         }
//       );

//       console.log("Image Post Response:", imagePostResponse.data);
//     }

//     console.log("Posting text:", title);
//     console.log("Posting image URL:", image);

//     res.status(200).json({
//       message: "Post successfully uploaded",
//       titlePost: titlePostResponse.data,
//     });
//   } catch (err) {
//     // Check for rate limit error
//     if (err.response && err.response.data && err.response.data.error) {
//       if (err.response.data.error.code === 368) {
//         return res.status(429).json({
//           error: "Rate limit exceeded. Please wait before trying again.",
//         });
//       }
//     }

//     console.error(
//       "Error in postOnFB:",
//       err.response ? err.response.data : err.message
//     );
//     res.status(400).json({
//       error: err.response ? err.response.data : "Error posting to Facebook",
//     });
//   }
// });


app.post("/postOnFB", async (req, res) => {
  const { title, image } = req.body;
  const PAGE_ACCESS_TOKEN = "EABzAnPLrCzcBOZBgWXYgBbTrfmDV9veU8LBnsJE4sUwoZC9dJWYe3UyhZBPMj8xnaPjvisLoGjRBEt564VVlAgcqjwQPZAKsnMatUdZAhnxITjwDCoN777ACSZCbNiUDvZCKq81twZBnEZBRt7FCLRggYcyzhsythRHxP7Bkfq2t8CvuZCtDIWQp9ZBEhJqZCcTfm7WCLMalp0Gp";
  const PAGE_ID = "428233347043737";

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

    res.status(200).json({
      message: "Post successfully uploaded",
      titlePost: titlePostResponse.data,
    });
  } catch (err) {
    // Log the detailed error response
    console.error(
      "Error in postOnFB:",
      err.response ? err.response.data : err.message
    );
    
    res.status(400).json({
      error: err.response ? err.response.data : "Error posting to Facebook",
    });
  }
});

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


app.listen(port, () => {
  console.log("Server started" );
});
