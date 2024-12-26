// const redisClient = require("../config/redis");
// const Property = require("../models/propertySchema");
// const Joi = require("joi");
// const fetch = require("node-fetch");

// // Primary geocode function using Nominatim
// const geocodeAddress = async (address) => {
//   const response = await fetch(
//     `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//       address
//     )}`
//   );
//   const data = await response.json();
//   if (data.length === 0) throw new Error("Invalid address");
//   return {
//     lat: parseFloat(data[0].lat),
//     lng: parseFloat(data[0].lon),
//   };
// };

// // Fallback geocode function using geocode.xyz
// const geocodeAddressWithFallback = async (address) => {
//   try {
//     return await geocodeAddress(address); // Attempt with Nominatim
//   } catch (error) {
//     console.log("Nominatim failed, trying fallback service...");
//     const response = await fetch(
//       `https://geocode.xyz/${encodeURIComponent(address)}?json=1`
//     );
//     const data = await response.json();
//     if (!data.latt || !data.longt) {
//       throw new Error(`Address could not be geocoded: ${address}`);
//     }
//     return {
//       lat: parseFloat(data.latt),
//       lng: parseFloat(data.longt),
//     };
//   }
// };

// // Joi validation schema
// const propertyValidationSchema = Joi.object({
//   title: Joi.string().required(),
//   description: Joi.string().optional(),
//   price: Joi.number().required(),
//   address: Joi.string().required(),
//   city: Joi.string().required(),
//   state: Joi.string().required(),
//   zipCode: Joi.string().required(),
//   property_type: Joi.string()
//     .valid("apartment", "house", "plot", "commercial")
//     .required(),
//   area: Joi.number().required(),
//   listedBy: Joi.string().required(), // Should be a valid user ID
// });

// class propertyController {
//   static addProperty = async (req, res) => {
//     try {
//       // Validate request body
//       const { error, value } = propertyValidationSchema.validate(req.body);
//       if (error) {
//         return res.status(400).json({ error: error.details[0].message });
//       }

//       // Destructure validated data
//       const {
//         title,
//         description,
//         price,
//         address,
//         city,
//         state,
//         zipCode,
//         property_type,
//         area,
//         listedBy,
//       } = value;

//       // Geocode the address
//       const { lat, lng } = await geocodeAddressWithFallback(address);

//       // Create a new property
//       const property = new Property({
//         title,
//         description,
//         price,
//         address,
//         city,
//         state,
//         zipCode,
//         property_type,
//         area,
//         listedBy,
//         location: {
//           type: "Point",
//           coordinates: [lng, lat],
//         },
//       });

//       // Save to database
//       await property.save();

//       // Respond with success
//       res.status(201).json({ message: "Property added successfully", property });
//     } catch (err) {
//       console.error(err);
//       if (err.message.includes("Invalid address") || err.message.includes("geocoded")) {
//         res.status(400).json({ error: "The provided address could not be geocoded." });
//       } else {
//         res.status(500).json({ error: "Internal server error" });
//       }
//     }
//   };

const redisClient = require("../config/redis");
const Property = require("../models/propertySchema");
const Joi = require("joi");
const fetch = require("node-fetch");

// Primary geocode function using Nominatim
const geocodeAddress = async (address) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`
  );
  const data = await response.json();

  if (data.length === 0 || !data[0].lat || !data[0].lon) {
    throw new Error(`Invalid address or unable to geocode: ${address}`);
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
};

// Fallback geocode function using geocode.xyz
const geocodeAddressWithFallback = async (address) => {
  try {
    return await geocodeAddress(address); // Attempt with Nominatim
  } catch (error) {
    console.log("Nominatim failed, trying fallback service...");
    const response = await fetch(
      `https://geocode.xyz/${encodeURIComponent(address)}?json=1`
    );
    const data = await response.json();

    if (
      !data.latt ||
      !data.longt ||
      isNaN(parseFloat(data.latt)) ||
      isNaN(parseFloat(data.longt))
    ) {
      throw new Error(`Fallback geocoding failed for address: ${address}`);
    }

    return {
      lat: parseFloat(data.latt),
      lng: parseFloat(data.longt),
    };
  }
};

// Geocode with Redis caching
const geocodeWithCache = async (address) => {
  const cacheKey = `geocode:${address}`;

  // Check Redis cache
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    console.log("Cache hit for address:", address);
    const parsedData = JSON.parse(cachedData);

    // Validate cached data
    if (parsedData.lat && parsedData.lng) {
      console.log("Valid cached geocode data:", parsedData);
      return parsedData;
    } else {
      console.warn("Invalid cached data detected, clearing cache...");
      await redisClient.del(cacheKey); // Remove invalid cache entry
    }
  }

  // If not cached or invalid, geocode the address
  const location = await geocodeAddressWithFallback(address);

  // Validate geocode data
  if (!location.lat || !location.lng || isNaN(location.lat) || isNaN(location.lng)) {
    throw new Error(`Invalid geocode data received: ${JSON.stringify(location)}`);
  }

  // Save valid geocode data to Redis with a TTL (e.g., 24 hours)
  await redisClient.set(cacheKey, JSON.stringify(location), { EX: 86400 }); // TTL = 24 hours
  console.log("Cache miss. Geocoded and saved to cache:", location);

  return location;
};


// Joi validation schema
const propertyValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  price: Joi.number().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zipCode: Joi.string().required(),
  property_type: Joi.string()
    .valid("apartment", "house", "plot", "commercial")
    .required(),
  area: Joi.number().required(),
  listedBy: Joi.string().required(), // Should be a valid user ID
});

class propertyController {
  static addProperty = async (req, res) => {
    try {
      // Validate request body
      const { error, value } = propertyValidationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Destructure validated data
      const {
        title,
        description,
        price,
        address,
        city,
        state,
        zipCode,
        property_type,
        area,
        listedBy,
      } = value;

      // Geocode the address with cache
      const { lat, lng } = await geocodeWithCache(address);

      // Validate lat/lng values
      if (typeof lat !== "number" || typeof lng !== "number") {
        throw new Error(`Invalid geocode results: lat=${lat}, lng=${lng}`);
      }

      // Create a new property
      const property = new Property({
        title,
        description,
        price,
        address,
        city,
        state,
        zipCode,
        property_type,
        area,
        listedBy,
        location: {
          type: "Point",
          coordinates: [lng, lat], // GeoJSON format: [longitude, latitude]
        },
      });

      // Save to database
      await property.save();

      // Respond with success
      res.status(201).json({ message: "Property added successfully", property });
    } catch (err) {
      console.error(err);
      if (err.message.includes("Invalid address") || err.message.includes("geocoded")) {
        res.status(400).json({ error: "The provided address could not be geocoded." });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
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
          console.log("Returning cached results");
          return res.json(JSON.parse(data));
        }

        const properties = await Property.find({
          location: {
            $near: {
              $geometry: { type: "Point", coordinates: [lng, lat] },
              $maxDistance: radiusInMeters,
            },
          },
        });

        redisClient.setEx(cacheKey, 600, JSON.stringify(properties));

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
        return res.status(404).json({ error: "Property not found" });
      }
      res.json({ message: "Property deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}
module.exports = propertyController;
