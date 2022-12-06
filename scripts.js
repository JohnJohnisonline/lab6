
mapboxgl.accessToken = 'pk.eyJ1Ijoiam9obmthbWF1IiwiYSI6ImNsYTkxNDBpODAxYmszb250aTM1enNhbXUifQ.yIea6qeBtneyMQlUO8D3zw'
const map = new mapboxgl.Map({
container: 'map', // container ID
style: 'mapbox://styles/mapbox/satellite-v9', // style URL
center: [-103.2502, 29.2498], // starting position [lng, lat]
zoom: 1.5, // starting zoom
pitch: 85,
// bearing: 80,
projection: 'globe', //globe projection rather than the default web mercator
});
map.on('load', () => {

  map.addSource('trails', {
      type: 'geojson',
      data: 'Big_Bend_Trails.geojson' // note, you'll have to change this if your data file is not in an enclosing folder named 'data'
  });

  map.addLayer({
    'id': 'trails-layer',
    'type': 'line',
    'source': 'trails',
    'paint': {
        'line-width': 3,
        'line-color': ['match', ['get', 'TRLCLASS'],
          'Class 1: Minimally Developed', 'red',
          'Class 2: Moderately Developed', 'orange',
          'Class 3: Developed', 'yellow',
            /*else,*/ 'blue'
]
    }
  });
  map.addSource('bounds', {
      type: 'geojson',
      data: 'BigBendBounds.geojson'// note again, you may need to change this.
  });

  map.addLayer({
    'id': 'boundary-layer',
    'type': 'line',
    'source': 'bounds',
    'paint': {
        'line-width': 4,
        'line-color': 'black',
        'line-opacity': .6
    }
  });
  // When a click event occurs on a feature in the places layer, open a popup at the
// location of the feature, with description HTML from its properties.
  map.on('click', 'trails-layer', (e) => {
      const coordinates = e.lngLat;
          let feature = e.features[0].properties
      const description ="<b> Trail name: </b> " + feature.TRLNAME + "<br><b>Trail class:</b>" + feature.TRLCLASS + "<br><b>Trail length: </b>" + feature.Miles + " Miles";

      new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);
  });

  map.on('mouseenter', 'trails-layer', () =>{
    map.getCanvas().style.cursor = 'pointer';
    });

  map.on('mouseleave', 'trails-layer',() => {
      map.getCanvas().style.cursor = '';
  });
});
map.on('load', function () {
   map.addSource('mapbox-dem', {
       "type": "raster-dem",
       "url": "mapbox://mapbox.mapbox-terrain-dem-v1",
       'tileSize': 512,
       'maxzoom': 14
   });
    map.setTerrain({"source": "mapbox-dem", "exaggeration": 3.0});
    map.setFog({
        'range': [-1, 2],
        'horizon-blend': 0.3,
        'color': 'white',
        'high-color': '#add8e6',
        'space-color': '#d8f2ff',
        'star-intensity': 0.0
    });
});

const navControl = new mapboxgl.NavigationControl({
    visualizePitch: true
});
map.addControl(navControl, 'top-right');
const scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'imperial'
});
map.addControl(scale);

scale.setUnit('imperial');
// map.addControl(new mapboxgl.AttributionControl({
//         customAttribution: 'Map design by John Kamau'
//     }));
