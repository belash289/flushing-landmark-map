// Instantiate the map
mapboxgl.accessToken = 'pk.eyJ1IjoiY3dob25nIiwiYSI6IjAyYzIwYTJjYTVhMzUxZTVkMzdmYTQ2YzBmMTM0ZDAyIn0.owNd_Qa7Sw2neNJbK6zc1A';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-73.82851, 40.76226], // Flushing center coordinates
    zoom: 15.86
});

// Colors for each landmark
const colors = {
    "Flushing Town Hall": "#e96b76",  // Darker red
    "Kingsland Homestead": "#e14453",  // Deeper red
    "St. George's Church": "#d91d30",  // Nearly darkest red
    "John Bowne House": "#d50a1f",  // Darker red
    "Quaker Meeting House": "#d00000",  // Darkest red
};

map.on('load', () => {
    // Add a GeoJSON source containing the data
    map.addSource('historicalData', {
        'type': 'geojson',
        'data': '/flushing-landmark-map/data/flushing_historical_data.geojson'
    });

    // Define the layer for the historical landmarks polygons
    map.addLayer({
        'id': 'historicalLandmarks',
        'type': 'fill',
        'source': 'historicalData',
        'paint': {
            'fill-color': [
                'match',
                ['get', 'name'],
                'Flushing Town Hall', colors['Flushing Town Hall'],
                'Kingsland Homestead', colors['Kingsland Homestead'],
                'St. George\'s Church', colors['St. George\'s Church'],
                'John Bowne House', colors['John Bowne House'],
                'Quaker Meeting House', colors['Quaker Meeting House'],
                '#ccc' // Default color
            ],
            'fill-opacity': 0.6,
            'fill-outline-color': '#000'
        }
    });

    // Add a layer for the landmark names
    map.addLayer({
        'id': 'landmarkLabels',
        'type': 'symbol',
        'source': 'historicalData',
        'layout': {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-offset': [0, 1.5],
            'text-anchor': 'top'
        },
        'paint': {
            'text-color': '#000000' // Black text color
        }
    });

    // Event listener for clicks on the map within the historical landmarks layer to show popups with landmark details
    map.on('click', 'historicalLandmarks', function (e) {
        if (e.features.length > 0) {
            const feature = e.features[0];
            const landmarkName = feature.properties.name;
            const establishmentDate = feature.properties.establishmentDate;
            const description = feature.properties.description;
            const imageUrl = feature.properties.imageUrl; // Assuming imageUrl is part of the GeoJSON properties

            // Update the sidebar content with detailed landmark information
            const sidebar = document.getElementById('sidebar');
            sidebar.innerHTML = `
            <h2>${landmarkName}</h2>
            <img src="${imageUrl}" alt="${landmarkName}" style="width:100%;height:auto;">
            <p><strong>Established:</strong> ${establishmentDate}</p>
            <p>${description}</p>
            <button id="backButton">Back to Overview</button>
        `;

            // Add event listener to the back button to return to the overview
            document.getElementById('backButton').addEventListener('click', () => {
                loadInitialSidebarContent();
            });

            // Fly to the clicked landmark
            map.flyTo({
                center: feature.geometry.coordinates[0][0],
                zoom: 17
            });
        }
    });

    // Change cursor to pointer on hover over the landmarks
    map.on('mouseenter', 'historicalLandmarks', function () {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Reset cursor on mouse leave
    map.on('mouseleave', 'historicalLandmarks', function () {
        map.getCanvas().style.cursor = '';
    });

    // Load the initial sidebar content
    loadInitialSidebarContent();
});

// Function to load the initial sidebar content
function loadInitialSidebarContent() {
    const sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = `
    <h2>Explore Flushing's Historical Landmarks</h2>
    <p class="call-to-action">Click on various landmarks on the map to learn more about their historical significance and evolution over time.</p>
    <h3>Landmark Legend</h3>
    <ul id="legend">
        <li><span style="background-color: ${colors['Flushing Town Hall']}"></span><a href="#" data-coordinates="[-73.8320, 40.7630]">Flushing Town Hall</a></li>
        <li><span style="background-color: ${colors['Kingsland Homestead']}"></span><a href="#" data-coordinates="[-73.8271, 40.7637]">Kingsland Homestead</a></li>
        <li><span style="background-color: ${colors['St. George\'s Church']}"></span><a href="#" data-coordinates="[-73.8317, 40.7622]">St. George's Church</a></li>
        <li><span style="background-color: ${colors['John Bowne House']}"></span><a href="#" data-coordinates="[-73.8274, 40.7606]">John Bowne House</a></li>
        <li><span style="background-color: ${colors['Quaker Meeting House']}"></span><a href="#" data-coordinates="[-73.8300, 40.7620]">Quaker Meeting House</a></li>
    </ul>
    <h3>Introduction to the Historical Development of Flushing</h3>
    <p>Welcome to our interactive exploration of the historical development of Flushing, Queens. This webpage provides an in-depth look at the significant landmarks and events that have shaped this vibrant neighborhood over time.</p>
    <h3>Why Focus on Flushing?</h3>
    <p>Flushing, with its rich history and diverse cultural landscape, serves as a unique example of urban development. Understanding its historical evolution offers insights into the broader patterns of urban growth and change.</p>
    <h3>Importance for Urban Studies</h3>
    <p>The historical landmarks and events in Flushing are more than just points on a map; they reflect the socio-economic and cultural transformations of the area. For urban planners and historians, these elements are crucial for:</p>
    <ul>
        <li><strong>Analyzing Historical Growth:</strong> Understanding the historical context of Flushing helps in analyzing its development patterns and planning future urban projects.</li>
        <li><strong>Preservation Efforts:</strong> Data on historical landmarks assist in making informed decisions regarding preservation and adaptive reuse of historical sites.</li>
        <li><strong>Cultural Heritage:</strong> Recognizing and highlighting significant historical sites helps in promoting cultural heritage and community identity.</li>
    </ul>
`;

    // Add event listeners to the legend items
    document.querySelectorAll('#legend a').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const coordinates = JSON.parse(this.getAttribute('data-coordinates'));
            map.flyTo({
                center: coordinates,
                zoom: 15
            });
        });
    });
}

// Load the initial sidebar content on page load
document.addEventListener('DOMContentLoaded', loadInitialSidebarContent);