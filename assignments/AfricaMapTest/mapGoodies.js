   // undp final
   // barbara compagnoni
   // oh boy!

   // make a map and set it to these coordinates and that zoom
   var map = L.map('map').setView([3, 17], 3);

   // api key for leaflet
   var mapboxAccessToken = 'pk.eyJ1IjoiY29tcGFnbmIiLCJhIjoiY2lnYjM5cjh1MW5wZnY5bTNrZ2d2ejVtZyJ9.XdZ79YPqoFtpksmMM-5FkQ';

   // var for geojson data to make my life easier
   var geojson;
   // var for info -- make it a leaflet control
   var info = L.control();
   // make a var for legend and utilize leaflet css because I am too lazy to make my own
   var legend = L.control({
     position: 'bottomleft'
   });

   // get map and put in "map" div
   L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
     id: 'compagnb.AfricaHDR'
   }).addTo(map);

   // function to filter d (hdrRank) into the color key
   function getColor(d) {
     return d > 175 ? '#800026' :
       d > 150 ? '#BD0026' :
       d > 125 ? '#E31A1C' :
       d > 100 ? '#FC4E2A' :
       d > 75 ? '#FD8D3C' :
       d > 50 ? '#FEB24C' :
       d > 25 ? '#FED976' :
       '#FED976';
       // 25 is lower then any of the HDR supplied, so it is going to be the unavail. color!
   }

   // function to assign style
   function style(feature) {
     return {
       fillColor: getColor(feature.properties.hdrRank), // assign color from HDR
       weight: 1,
       opacity: 1,
       color: 'white',
       dashArray: '0',
       fillOpacity: 0.7
     };
   }

   // event listener for countries -- when mouse enters
   function highlightFeature(e) {
     var layer = e.target;

     // change style and add an outline
     layer.setStyle({
       weight: 3,
       color: '#FFF',
       dashArray: '',
       fillOpacity: 0.7
     });

     // if (!L.Browser.ie && !L.Browser.opera) {
     //   layer.bringToFront();
     // }

     // update info section
     info.update(layer.feature.properties);
   }

   // reset on mouse out
   function resetHighlight(e) {
     geojson.resetStyle(e.target);
     info.update();
   }

   // click to zoom on country
   function zoomToFeature(e) {
     map.fitBounds(e.target.getBounds());
   }

   // add listener on country layers
   function onEachFeature(feature, layer) {
     layer.on({
       mouseover: highlightFeature,
       mouseout: resetHighlight,
       click: zoomToFeature
     });
   }

   info.onAdd = function(map) {
     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
     this.update();
     return this._div;
   };

   // function used to update the hdr rankings :)
   info.update = function(props) {
     this._div.innerHTML = '<h4>Human Development Index Ratings</h4>' + (props ?
       '<b>' + props.name + '</b><br /> HDI Rank of ' + props.hdrRank + '' : 'Hover over a country');
   };

   // function for making legend with color codes :)
   legend.onAdd = function(map) {

     var div = L.DomUtil.create('div', 'info legend'),
       grades = ["Unavailable", 50, 75, 100, 125, 150, 175],
       labels = [];
    div.innerHTML += '<h4> HDR Ranks </h4>';
     // iterate through the array and make a label with a colored square
     for (var i = 0; i < grades.length; i++) {
       // for all numbers do the following to mark hdr ranges
       if (grades[i] != "Unavailable") {
         div.innerHTML +=
           '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
           grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
       }
       // but I don't want a range for the first "unavailable" so do this instead
       if (grades[i] == "Unavailable") {
         div.innerHTML +=
           '<i style="background:' + getColor(grades[i]) + '"></i> ' +
           grades[i] + '<br>';
       }
     }
     // return the div when completed
     return div;
   };

   // add my shiznit to the map
   info.addTo(map);
   legend.addTo(map);

   geojson = L.geoJson(africaData, {
     style: style,
     onEachFeature: onEachFeature
   }).addTo(map);
