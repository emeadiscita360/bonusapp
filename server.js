const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const clientId = 'b8c22525-9f28-49dd-a7ae-6e62e83ddac3';  // Your Azure AD client ID
const clientSecret = '9Px8Q~ukGIuLajO-n1E.A44o5nyDl6IDaP_P6bha';  // Your Azure AD client secret
const tenantId = 'eb06985d-06ca-4a17-81da-629ab99f6505';  // Your Azure AD tenant ID
const resource = 'https://management.azure.com/.default';  // The scope for your Logic App

app.post('/api/get-token', async (req, res) => {
    try {
        const tokenResponse = await axios.post(
            `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
            new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials',
                scope: resource
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        const accessToken = tokenResponse.data.access_token;
        res.json({ token: accessToken });
    } catch (error) {
        console.error('Error fetching token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
