import express from "express";
import axios from "axios";
import crypto from "crypto";

const exportrouter = express.Router();

// Replace this with your Facebook App Secret
const APP_SECRET = process.env.APP_SECRET;

// Function to generate appsecret_proof
const generateAppSecretProof = (accessToken, appSecret) => {
  return crypto
    .createHmac("sha256", appSecret)
    .update(accessToken)
    .digest("hex");
};

// Handle the login and fetch pages / Instagram account
exportrouter.post("/home/loginmedia", async (req, res) => {
  const { facebookAccessToken } = req.body;

  if (!facebookAccessToken) {
    return res.status(400).json({ error: "Facebook access token is required." });
  }

  try {
    // Generate appsecret_proof for security
    const appSecretProof = generateAppSecretProof(facebookAccessToken, APP_SECRET);

    // Fetch pages the user manages (with appsecret_proof)
    const pageResponse = await axios.get(
      "https://graph.facebook.com/v21.0/me/accounts",
      {
        params: {
          access_token: facebookAccessToken,
          appsecret_proof: appSecretProof,
        },
      }
    );

    const pages = pageResponse.data.data;

    if (!pages || pages.length === 0) {
      return res.status(404).json({ error: "No pages found for this user." });
    }

    // Find the Instagram business account linked to the page
    const instagramPage = pages.find((page) => page.instagram_business_account);

    if (!instagramPage) {
      return res.status(400).json({
        error: "No Instagram business account linked to the Facebook page.",
      });
    }

    const instagramBusinessAccountId = instagramPage.instagram_business_account.id;
    const instagramUsername = instagramPage.instagram_business_account.username;

    res.json({
      message: "Instagram account linked successfully.",
      instagramBusinessAccountId,
      instagramUsername,
    });
  } catch (error) {
    console.error("Error fetching Instagram account:", error.message);
    res.status(500).json({ error: "Error fetching Instagram account." });
  }
});

export default exportrouter;
