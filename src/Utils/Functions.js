export const getCurrentAdminState = async () => {
  try {
    // Attempt to get the user's current geolocation
    const position = await getCurrentPosition();

    // Extract latitude and longitude from the geolocation position
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Make an API call to reverse geocode the user's coordinates to obtain address components
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyB249oWvDs5DTvKrtvDstCQ-IJC4uDpWkg`
    );
    const data = await response.json();

    // Extract the state from the address components
    const state = data.results[0].address_components.find((component) =>
      component.types.includes("administrative_area_level_1")
    ).long_name;

    // Return the state
    return state;
  } catch (error) {
    console.error("Error fetching current admin's state:", error);
    // Return a default value or handle the error as appropriate for your application
    return "DefaultState"; // Replace "DefaultState" with an appropriate default value
  }
};

// Function to get the user's current geolocation
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
