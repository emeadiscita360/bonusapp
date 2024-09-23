const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const tenantId = 'YOUR_TENANT_ID';
const resource = 'https://management.azure.com/.default';
const targetApiEndpoint = 'YOUR_API_ENDPOINT'; // The endpoint you want to send data to

// Endpoint to generate the Bearer token and send a POST request
app.post('/api/get-token', async (req, res) => {
    const { email, var1, var2 } = req.body; // Extract data from the request

    try {
        // Fetch the Bearer token
        const tokenResponse = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
            scope: resource
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        // Send a POST request to the target API with the token and other data
        const apiResponse = await axios.post(targetApiEndpoint, { email, var1, var2 }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ message: 'Data submitted successfully', apiResponse: apiResponse.data });
    } catch (error) {
        console.error('Error in submit:', error.message);
        res.status(500).json({ error: 'Failed to process the request' });
    }
});

module.exports = app;

