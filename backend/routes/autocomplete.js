import express from 'express';

const router = express.Router();


router.get('/autocomplete', async (req, res) => {
    const { search } = req.query;
    try {
        setTimeout(async () => {  // Add async here
            const baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
            
            try {
                const response = await fetch(`${baseUrl}?input=${encodeURIComponent(search)}&key=${process.env.API_KEY_GOOGLE_PLACES}&includedPrimaryTypes=locality`, {
                    method: 'POST',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();

                res.status(200).json({ message: 'Place suggestions fetched successfully', payload: { suggestions: data.predictions } });
            } catch (error) {
                console.error('Error:', error);
            }
        }, 500);  // 1 second delay

    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({error});
    }
}
);

export default router;
