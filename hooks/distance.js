import {
  ROUTING_API_KEY
} from '@env';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed if you're using this in a Node.js environment

const geocodeAddress = async (address) => {
  const url = `https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(address)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: ROUTING_API_KEY,
    },
  });

  const data = await response.json();

  if (data.features && data.features.length > 0) {
    const [lon, lat] = data.features[0].geometry.coordinates;
    return { lat, lon };
  } else {
    throw new Error("No geocoding result found");
  }
};

const calculateDistance = async (startAddress, endAddress) => {
  try {
    const startCoords = await geocodeAddress(startAddress);
    const endCoords = await geocodeAddress(endAddress);
    console.log("Start Coords:", startCoords);
    console.log("End Coords:", endCoords);

    // Converts degrees to radians
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 3958.8; // Radius of Earth in miles

    const lat1 = startCoords.lat;
    const lon1 = startCoords.lon;
    const lat2 = endCoords.lat;
    const lon2 = endCoords.lon;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance; // in miles
  } catch (error) {
    console.error("Error calculating distance:", error);
    throw error;
  }
};


export { calculateDistance };