// controllers/precomputeController.js
const Property = require('../models/propertySchema');
const PrecomputedResults = require('../models/precomputedResults');

const precomputeResults = async (req, res) => {
  try {
    const { lng, lat, radius } = req.body;
    const radiusInMeters = radius * 1000;

    const properties = await Property.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusInMeters,
        },
      },
    });

    const precomputed = new PrecomputedResults({
      location: [lng, lat],
      radius,
      properties,
    });

    await precomputed.save();
    res.json({ message: 'Precomputed results saved successfully', precomputed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { precomputeResults };
