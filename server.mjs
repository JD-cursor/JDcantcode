import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// Set up the server route to proxy the OpenSky API request
app.get('/api/flight/:icao24', async (req, res) => {
    const icao24 = req.params.icao24;
    const apiUrl = `https://opensky-network.org/api/states/own?icao24=${icao24}`;

    try {
        // Make a request to OpenSky API
        const response = await fetch(apiUrl);

        if (!response.ok) {
            return res.status(response.status).json({ message: 'Error fetching flight data' });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching flight data:', error);
        console.error('Response status:', response.status);
        const errorBody = await response.text(); // Get the response body
        console.error('Response body:', errorBody);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Proxy server running at http://localhost:${port}`);
});
