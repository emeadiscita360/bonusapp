const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());

const tenantId = process.env.TENANT_ID;
const resource = 'https://service.flow.microsoft.com//.default';
const targetApiEndpoint = 'https://prod-163.westus.logic.azure.com:443/workflows/8a6133daf6f84b5886380e6c62923730/triggers/manual/paths/invoke?api-version=2016-06-01';

app.use(express.static('public'));

// Endpoint to generate the Bearer token and send a POST request
app.get('/api/get-token', async (req, res) => {
    const { email, var1, var2 } = req.query;

    try {
        const tokenResponse = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
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

        if (apiResponse.status === 200) {
            console.log("Power Automate flow triggered successfully");
            res.redirect(`/index.html?email=${encodeURIComponent(email)}&var1=${encodeURIComponent(var1)}&var2=${encodeURIComponent(var2)}&success=true`);

        }
        else {
            console.error("Failed to trigger Power Automate flow", apiResponse.data);
            res.redirect('/index.html?success=false');
        }


    } catch (error) {
        console.error('Error in submit:', error.message);
        console.error('Full error:', error.response ? error.response.data : error.message);

        // On failure, redirect with success=false
        res.redirect('/index.html?success=false');
    }
});

// Vercel requires a default export
module.exports = app;