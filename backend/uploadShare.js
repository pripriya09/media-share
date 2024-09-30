import express from "express";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import path from "path";
import axios from "axios";



const app = express();
const port = 8006;


app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use("/uploads", express.static("uploads"));


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
    const content = new dataContent({
      title: req.body.title,
      image: req.file.filename,
    });
    await content.save();
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


  const PAGE_ACCESS_TOKEN = "EAAHGb1E3XmIBO5xN8inq2PtfRzcjTgPC65YQ4gioMy9aQMlwEbK6OJU5KdC2wZA6zFwvDaN1rVHDbJqmyZCJJPlJ6a9V8l0oYK4TwiTbLPkb8x1xZCaMytgmAZCXBvUHaA1lc0zLF2uH1DUeKLm2ksUfQcrD8oX5Wmq9U5PhXP7ZAJTSgZBmHkaG9ZCgzZBCCvnGZA6UovW29iCa2VzGXYZC4RGlL43ZACoZCZCB0"
  const PAGE_ID ="428233347043737"; 

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
      const imagePath = `http://localhost:8006/uploads/${image}`;

      const imagePostResponse = await axios.post(
        `https://graph.facebook.com/${PAGE_ID}/photos`,
        {
          url: imagePath,
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
    console.error("Error in postOnFB:", err.response ? err.response.data : err.message);
    res.status(400).json({
      error: err.response ? err.response.data : "Error posting to Facebook",
    });
  }
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
