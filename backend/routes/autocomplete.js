import express from 'express';

const router = express.Router();


router.get('/autocomplete', async (req, res) => {
    const { search } = req.query;
    
    try {
        const apiKey = process.env.API_KEY_GOOGLE_PLACES; 
        const baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

        // Make the Axios request
        const response = await fetch(`${baseUrl}?input=${encodeURIComponent(search)}&key=${apiKey}&includedPrimaryTypes=locality`, {
            method: 'POST',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json'
            }
          });
        const data = await response.json();
        res.status(200).json({ message: 'Place suggestions fetched successfully', payload: { suggestions: data.predictions } });
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({error});
    }
}
);

export default router;
