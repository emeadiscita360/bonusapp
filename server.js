<<<<<<< HEAD
const express = require('express');  // Import the express library
const axios = require('axios');  // Import axios to make HTTP requests
const app = express();

app.use(express.json());  // Middleware to parse JSON request bodies
app.use(express.static('public'));  // Serve static files from the public directory

// Replace with your Azure AD credentials
const clientId = 'b8c22525-9f28-49dd-a7ae-6e62e83ddac3';  // Your Azure AD client ID
const clientSecret = '9Px8Q~ukGIuLajO-n1E.A44o5nyDl6IDaP_P6bha';  // Your Azure AD client secret (store securely)
const tenantId = 'eb06985d-06ca-4a17-81da-629ab99f6505';  // Your Azure AD tenant ID
const resource = 'https://management.azure.com/.default';  // The scope for your Logic App

// Endpoint to generate the Bearer token
app.post('/api/get-token', async (req, res) => {
    try {
        const tokenResponse = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,  // Use the new client secret
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

// Endpoint to handle the data submission
app.post('/api/submit-data', async (req, res) => {
    const { email, var1, var2 } = req.body;

    try {
        // Generate a token
        const tokenResponse = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'client_credentials',
            scope: resource
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const accessToken = tokenResponse.data.access_token;

        // Send data to Azure Logic App
        const logicAppUrl = 'YOUR_LOGIC_APP_URL';  // Replace with your actual Logic App URL
        const response = await axios.post(logicAppUrl, {
            email,
            var1,
            var2
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({ message: 'Data submitted successfully!', data: response.data });
    } catch (error) {
        console.error('Error submitting data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to submit data' });
    }
});

// Serve the index.html when accessing the root
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
=======
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const clientId = 'b8c22525-9f28-49dd-a7ae-6e62e83ddac3';  // Your Azure AD client ID
const clientSecret = '9Px8Q~ukGIuLajO-n1E.A44o5nyDl6IDaP_P6bha';  // Your Azure AD client secret
const tenantId = 'eb06985d-06ca-4a17-81da-629ab99f6505';  // Your Azure AD tenant ID
const resource = 'https://management.azure.com/.default';  // The scope for your Logic App

const express = require('express');  // Import the express library
const axios = require('axios');  // Import axios to make HTTP requests
const app = express();

app.use(express.json());  // Middleware to parse JSON request bodies

// Replace with your Azure AD credentials
const clientId = 'b8c22525-9f28-49dd-a7ae-6e62e83ddac3';  // Your Azure AD client ID
const clientSecret = '9Px8Q~ukGIuLajO-n1E.A44o5nyDl6IDaP_P6bha';  // Your Azure AD client secret (store securely)
const tenantId = 'eb06985d-06ca-4a17-81da-629ab99f6505';  // Your Azure AD tenant ID
const resource = 'https://management.azure.com/.default';  // The scope for your Logic App

// Endpoint to generate the Bearer token
app.post('/api/get-token', async (req, res) => {
    try {
        const tokenResponse = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,  // Use the new client secret
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


>>>>>>> 7eaede9b7fab182affa9cd067c994a6e2681b87a
