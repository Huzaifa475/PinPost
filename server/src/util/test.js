import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:5000/oauth2callback';

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate the OAuth URL for user to grant permission
const authorizationUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline', // Request offline access to get refresh token
  scope: ['https://www.googleapis.com/auth/gmail.send'], // Gmail send permission
});
console.log('Please visit this URL and authorize the application:', authorizationUrl);
const { tokens } = await oAuth2Client.getToken(authorizationCode);

console.log(tokens);

// const getTokens = async (authorizationCode) => {
    // Exchange the authorization code for access and refresh tokens


    
    // const refreshToken = tokens.refresh_token;
    // console.log('Received Refresh Token:', refreshToken);
  
    // Store this refresh token in the user's record in the database
    // const user = await User.findById(userId); // Fetch user from DB
    // user.refreshToken = refreshToken;          // Save the refresh token to DB
    // await user.save();                         // Persist the token
// };
  