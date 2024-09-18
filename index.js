import express from 'express';
import OAuthClient from 'intuit-oauth';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

const oauthClient = new OAuthClient({
    clientId: process.env.CLIENT_ID, 
    clientSecret: process.env.CLIENT_SECRET, 
    environment: process.env.ENVIRONMENT, 
    redirectUri: process.env.REDIRECT_URI 
});

app.get('/auth', (req, res) => {
    try {
        const authUri = oauthClient.authorizeUri({
            scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
            state: 'Init' // State to protect against CSRF attacks
        });
        res.redirect(authUri);
    } catch (error) {
        console.error("auth error: " , error);     
    }
});

app.get('/callback', async (req, res) => {
    const parseRedirect = req.url;
    try {
        const authResponse = await oauthClient.createToken(parseRedirect);
        console.log(authResponse);
        res.send('<script>window.close();</script>');
    } catch (error) {
        console.error("callback error :" , error);
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
});