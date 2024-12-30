const exifr = require("exifr");

const getExifData = async (filePath) => {
  try {
    const data = await exifr.parse(filePath, { gps: true });
    return {
      latitude: data?.latitude || null,
      longitude: data?.longitude || null,
    };
  } catch (error) {
    console.error("Error reading EXIF data:", error);
    return null;
  }
};

module.exports = { getExifData };
