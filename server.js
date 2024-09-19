const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Middleware to serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Replace with your Azure AD credentials
const clientId = 'b8c22525-9f28-49dd-a7ae-6e62e83ddac3';
const clientSecret = '9Px8Q~ukGIuLajO-n1E.A44o5nyDl6IDaP_P6bha';
const tenantId = 'eb06985d-06ca-4a17-81da-629ab99f6505';
const resource = 'https://management.azure.com/.default';

// Endpoint to generate the Bearer token
app.post('/api/get-token', async (req, res) => {
    try {
        const tokenResponse = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
            scope: resource
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;
        res.json({ token: accessToken });
    } catch (error) {
        console.error('Error fetching token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

app.get('/', (req, res) => {
    res.send('Node.js server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
