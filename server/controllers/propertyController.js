// controllers/propertyController.js
const Property = require('../models/Property');
const redisClient = require('../config/redis');
const fetch = require('node-fetch');

const geocodeAddress = async (address) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  if (data.results.length === 0) throw new Error('Invalid address');
  return data.results[0].geometry.location; // { lat, lng }
};
class propertyController{

    static addProperty = async (req, res) => {
        try {
          const { title, description, price, address } = req.body;
          const { lat, lng } = await geocodeAddress(address);
      
          const property = new Property({
            title,
            description,
            price,
            location: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          });
      
          await property.save();
          res.status(201).json({ message: 'Property added successfully', property });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
        }
      };
      
       static searchProperties = async (req, res) => {
        try {
          const { lat, lng, radius } = req.query;
          const radiusInMeters = radius * 1000;
          const cacheKey = `${lng}:${lat}:${radius}`;
      
          redisClient.get(cacheKey, async (err, data) => {
            if (err) throw err;
      
            if (data) {
              console.log('Returning cached results');
              return res.json(JSON.parse(data));
            }
      
            const properties = await Property.find({
              location: {
                $near: {
                  $geometry: { type: 'Point', coordinates: [lng, lat] },
                  $maxDistance: radiusInMeters,
                },
              },
            });
      
            redisClient.setex(cacheKey, 600, JSON.stringify(properties));
      
            res.json(properties);
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
        }
      };

      static deleteProperty = async (req, res) => {
        try {
          const { id } = req.params;
          const property = await Property.findByIdAndDelete(id);
          if (!property) {
            return res.status(404).json({ error: 'Property not found' });
          }
          res.json({ message: 'Property deleted successfully' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
        }
      }
}
module.exports = propertyController;
