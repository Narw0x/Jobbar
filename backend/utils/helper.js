import axios from 'axios';
import JobOffer from '../models/jobOffer.model.js';


export async function getCoordinates(address) {
  try {
    
    // Make request to Google Geocoding API
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: process.env.REACT_APP_GOOGLE_API_KEY,
      },
    });

    

    // Check if we got any results
    if (!response.data.results || response.data.results.length === 0) {
      throw new Error('No results found for the provided address');
    }

    // Extract coordinates from the first result
    const location = response.data.results[0].geometry.location;
    
    return {
      latitude: location.lat,
      longitude: location.lng
    };
  } catch (error) {
    // Handle specific API errors
    if (error.response) {
      throw new Error(`Geocoding API error: ${error.response.data.error_message || error.response.status}`);
    }
    // Re-throw other errors
    throw error;
  }
}

export async function createSphere() {
  try {
    await JobOffer.collection.createIndex({ location: '2dsphere' });
  } catch (error) {
    throw new Error(`Sphere API error: ${error.response?.data || error.message}`);
  }
}