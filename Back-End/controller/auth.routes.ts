import express from 'express';
import { Issuer, generators, TokenSet } from 'openid-client';


const router = express.Router();

const tenantId = process.env.AZURE_TENANT_ID!;
const clientId = process.env.AZURE_CLIENT_ID!;
const clientSecret = process.env.AZURE_CLIENT_SECRET!;
const redirectUri = 'http://localhost:3000/auth/redirect'; 

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

    res.redirect(url);
});

router.get('/redirect', async (req, res) => {
    const params = client.callbackParams(req);

    try {
        const tokenSet: TokenSet = await client.callback(redirectUri, params, {
            nonce,
            state,
        });

        const userinfo = await client.userinfo(tokenSet.access_token!);
        // TODO: Set session or issue a JWT here
        res.redirect(`http://localhost:8080/dashboard`); // send to frontend
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Authentication failed');
    }
});

export default router;
