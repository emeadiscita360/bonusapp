const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Replace with your Azure AD credentials
const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const tenantId = 'YOUR_TENANT_ID';
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

// Endpoint to handle incoming requests
app.post('/api/submit', async (req, res) => {
    const { email, var1, var2 } = req.body;

    // Use your logic app endpoint and token generation logic here
    const bearerToken = 'PLACEHOLDER_FOR_GENERATED_TOKEN'; // Fetch this dynamically

    try {
        const response = await axios.post('YOUR_LOGIC_APP_URL', {
            email,
            var1,
            var2
        }, {
            headers: { Authorization: `Bearer ${bearerToken}` }
        });

        res.json({ message: 'Successfully sent data!', data: response.data });
    } catch (error) {
        console.error('Error sending data:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to send data' });
    }
});

// Default route
app.get('/', (req, res) => {
    res.send('Node.js server is running!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
