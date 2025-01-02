import express from 'express';
import { generateSecret, totp } from 'speakeasy';
import { toDataURL } from 'qrcode';
import cors from "cors"
const app = express();
const port = 7000;
app.use(express.json());
app.use(
  cors({
    origin:[
       "http://localhost:5174","http://localhost:5173",
    
    ]
  })
);

// Simulate user database (for example purposes)
let users = {};

// Middleware to parse JSON
app.use(json());

// Route to generate QR code for setting up 2FA
app.get('/generate-2fa', (req, res) => {
  // Assuming the user is already authenticated (e.g., logged in)
  const userId = req.query.userId;  // You'd typically get this from session or JWT
  
  if (!userId || !users[userId]) {
    return res.status(400).json({ error: 'User not found or not logged in.' });
  }

  // Generate a secret for the user
  const secret = generateSecret({ length: 20 });
  
  // Save the user's secret (in real life, store it securely in the database)
  users[userId].secret = secret.base32;

  // Create a URL to display a QR code for Google Authenticator
  const otpauthUrl = secret.otpauth_url;

  // Generate the QR code
  toDataURL(otpauthUrl, (err, imageUrl) => {
    if (err) {
      return res.status(500).json({ error: 'Error generating QR code' });
    }
    res.json({
      qrCode: imageUrl,  // Send the QR code image URL to the client
      secret: secret.base32,  // Secret to store for later use (in real life, save it securely)
    });
  });
});

// Route to verify the token entered by the user
app.post('/verify-2fa', (req, res) => {
  const { userId, token } = req.body;

  // Check if user exists and has 2FA enabled
  if (!userId || !users[userId] || !users[userId].secret) {
    return res.status(400).json({ error: 'User not found or 2FA not enabled.' });
  }

  // Verify the token entered by the user
  const verified = totp.verify({
    secret: users[userId].secret,
    encoding: 'base32',
    token: token,
  });

  if (verified) {
    res.json({ message: '2FA verification successful' });
  } else {
    res.status(400).json({ error: 'Invalid 2FA token' });
  }
});

app.listen(port, () => {
  console.log(`2FA server running on http://localhost:${port}`);
});
