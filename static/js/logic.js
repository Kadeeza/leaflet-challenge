// Storing API endpoint, for all eathquakes in the last 7 days, as a variable
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL/
d3.json(queryURL).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
   console.log(data.features)
 });


// Create a function that will create circle markers where magnitude will be reprsented by size and depth by the color of the markers
function createMarker(feature, ltln) {
    return L.circleMarker(ltln, {
        radius: markerSizes(feature.properties.mag),
        fillColor: markerColors(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 0.75
    });
}

// Function to create marker sizes based on magnitude
function markerSizes(magnitude) {
    return magnitude* 4;
  };

// Function to create marker colors based on depth
function markerColors (depth) {
    if (depth <= 10) return "#99FF00";
    else if (depth > 10 & depth <= 30) return "#CCFF33";
    else if (depth > 30 & depth <= 50) return "#FFFF66";
    else if (depth > 50 & depth <= 70) return "#FF9966";
    else if (depth > 70 & depth <= 90) return "#FF6666";
    else return "#FF0000";
};

// Function to create features
function createFeatures(earthquakeData) {

// Define a function that we want to run once for each feature in the features array. We are giving each feature a popup that describes the magnitude and depth of the earthquake.

function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3> ${feature.properties.place}</h3><hr><p> Magnitude: ${feature.properties.mag}</p><p> Depth: ${feature.geometry.coordinates[2]}</p>`);
}

// Create a GeoJSON layer that contains the features array on the earthquakeData object.
// Run the onEachFeature function once for each piece of data in the array.
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createMarker
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

    // Adding a legend to the map
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (myMap) {
      let div = L.DomUtil.create('div', 'info legend'),
          ranges = ['<10', '10–30', '30–50', '50–70', '70–90', '> 90'],
          colors = ['#99FF00', '#CCFF33', '#FFFF66', '#FF9966', '#FF6666', '#FF0000'];
    
      // Loop through ranges and colors to generate the legend
      for (let i = 0; i < ranges.length; i++) {
        div.innerHTML +=
          '<i style="background:' + colors[i] + '; width: 18px; height: 18px; display: inline-block; margin-right: 8px;"></i> ' +
          ranges[i] + '<br>';
      }
    
      return div;
    };
    
    legend.addTo(myMap);

}



