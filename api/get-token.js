const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());

const clientId = 'b8c22525-9f28-49dd-a7ae-6e62e83ddac3';
const clientSecret = '9Px8Q~ukGIuLajO-n1E.A44o5nyDl6IDaP_P6bha';
const tenantId = 'eb06985d-06ca-4a17-81da-629ab99f6505';
const resource = 'https://service.flow.microsoft.com//.default';
const targetApiEndpoint = 'https://prod-179.westus.logic.azure.com:443/workflows/9f02f6f333ff486db463f91c81bfa163/triggers/manual/paths/invoke?api-version=2016-06-01'; // The endpoint you want to send data to


// Serve static HTML file from the "public" folder
app.use(express.static('public'));

// Endpoint to generate the Bearer token and send a POST request
app.get('/api/get-token', async (req, res) => {
    const { email, var1, var2 } = req.query;

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

        // Use the access token to call the target API
        const apiResponse = await axios.post(targetApiEndpoint, { email, var1, var2 }, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // If the API call is successful, redirect with success=true
        res.redirect('/index.html?success=true');


    } catch (error) {
        console.error('Error in submit:', error.message);
        console.error('Full error:', error.response ? error.response.data : error.message);

        // On failure, redirect with success=false
        res.redirect('/index.html?success=false');
    }
});

// Vercel requires a default export
module.exports = app;