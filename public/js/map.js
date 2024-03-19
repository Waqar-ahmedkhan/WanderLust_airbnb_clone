// map.js
// map.js

let map = L.map("map").setView([33.738045, 73.084488], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Function to add markers for listings on the map
function addListingsToMap(listings) {
  if (
    listings.length > 0 &&
    listings[0].geometry &&
    listings[0].geometry.coordinates
  ) {
    const { lat, lng } = listings[0].geometry.coordinates;
    map.setView([lat, lng], 13); // Set the map view to the coordinates of the first listing
  }

  listings.forEach((listing) => {
    if (listing.geometry && listing.geometry.coordinates) {
      const { lat, lng } = listing.geometry.coordinates;
      const popupContent = `<strong>${listing.title}</strong><br>${listing.description}<br>Price: ${listing.price}`;

      // Add a marker at the listing's coordinates
      L.marker([lat, lng]).addTo(map).bindPopup(popupContent);
    }
  });
}

// Fetch listings from your server
fetch("/api/listings") // Change the URL to the endpoint that provides your listings
  .then((response) => response.json())
  .then((data) => {
    // Call the function to add markers for listings on the map
    addListingsToMap(data);
  })
  .catch((error) => {
    console.error("Error fetching listings:", error);
  });
