// Storing API endpoint, for all eathquakes in the last 7 days, as a variable
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL/
d3.json(queryURL).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
    console.log(data.features)
  });


function createFeatures(earthquakeData) {

// Define a function that we want to run once for each feature in the features array.
// The features we care about are magnitude and depth of the earthquake
// We are giving each feature a popup that describes the magnitude and depth of the earthquake.
function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.mag}</h3><hr><p>${feature.geometry.coordinates[2]}</p>`);
}

// Create a GeoJSON layer that contains the features array on the earthquakeData object.
// Run the onEachFeature function once for each piece of data in the array.
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
});

// Send our earthquakes layer to the createMap function/
createMap(earthquakes);
}

// Define function to create Maps
function createMap(earthquakes){
    // Creating base layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Creating base map object
    let baseMaps = {
        "Street Map": street,
    };
    
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    }; 

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

}

/* // Creating a map object.
let myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 3
  }); */