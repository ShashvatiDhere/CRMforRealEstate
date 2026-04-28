require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory store for OTPs (In a real production app, use Redis or a Database)
const otpStore = new Map();

// Configure Nodemailer transporter using provided environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail', // Default to gmail, can be changed via config later
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Expected to be an App Password
  },
});

// Helper to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

app.post('/api/auth/request-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const otp = generateOTP();
  
  // Store the OTP with an expiration (e.g., 5 minutes)
  const expiresAt = Date.now() + 5 * 60 * 1000;
  otpStore.set(email, { otp, expiresAt });

  try {
    // If SMTP_USER is set, we attempt to send a real email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const mailOptions = {
        from: `"Aura Estate CRM" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '[Aura Estate] Your Secure Login Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e4e4e7; border-radius: 8px;">
            <h2 style="color: #18181b;">Welcome back to Aura Estate</h2>
            <p style="color: #52525b; font-size: 16px;">We received a request to access your CRM dashboard. Use the securely generated code below to sign in:</p>
            <div style="margin: 20px 0; background: #fafafa; padding: 15px; text-align: center; font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #cfa361; border: 1px solid #e4e4e7; border-radius: 4px;">
              ${otp}
            </div>
            <p style="color: #a1a1aa; font-size: 12px; margin-top: 30px;">This code will expire in 5 minutes. If you did not request this email, you can safely ignore it.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[SMTP] Real OTP Email sent to ${email}`);
    } else {
      console.log(`[SIMULATION MODE] Check console for OTP. Real credentials not found in server/.env`);
      console.log(`---> Generated OTP for ${email}: ${otp} <---`);
    }

    res.json({ success: true, message: 'OTP processed successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP email' });
  }
});

app.post('/api/auth/verify', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP required' });
  }

  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({ success: false, message: 'No OTP requested for this email' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email); // Clean up expired
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }

  if (record.otp === otp) {
    // Valid OTP!
    otpStore.delete(email); // Single-use 
    // Usually you'd issue a JWT here. For our frontend demo, we return success.
    return res.json({ success: true, message: 'Verified securely' });
  }

  return res.status(400).json({ success: false, message: 'Invalid OTP code' });
});

app.listen(PORT, () => {
  console.log(`Auth Backend running on http://localhost:${PORT}`);
});
