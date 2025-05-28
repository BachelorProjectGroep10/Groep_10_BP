import express from 'express';
import { Issuer, generators, TokenSet } from 'openid-client';
import jwt, { SignOptions } from 'jsonwebtoken';


const router = express.Router();

const tenantId = process.env.AZURE_TENANT_ID!;
const clientId = process.env.AZURE_CLIENT_ID!;
const clientSecret = process.env.AZURE_CLIENT_SECRET!;
const redirectUri = 'http://localhost:3000/'; 

let client: any;

(async () => {
    const issuer = await Issuer.discover(`https://login.microsoftonline.com/${tenantId}/v2.0`);
    client = new issuer.Client({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: [redirectUri],
        response_types: ['code'],
    });
})();

const state = generators.state();
const nonce = generators.nonce();

router.get('/login', (req, res) => {
    const url = client.authorizationUrl({
        scope: 'openid profile email',
        response_mode: 'query',
        nonce,
        state,
    });

    console.log('Redirecting to:', url);

    res.redirect(url);
});

router.get('/callback', async (req, res) => {
    const params = client.callbackParams(req);
    console.log('Callback params:', params);
    try {
        const tokenSet = await client.callback(redirectUri, params, { nonce });

        const userinfo = await client.userinfo(tokenSet.access_token!);
        const token = jwt.sign(userinfo, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.redirect(`http://localhost:8080/dashboard/?token=${token}`);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Authentication failed');
    }
});

export default router;
