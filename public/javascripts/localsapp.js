var map, lat, lng, address;
//Variable de posiciones en Array
var positions = [];

var position = position ? position : undefined;

// Center points
lat = 18.4953778;
lng = -69.8668407;

function saveDrink(){
    if(map.markers.length < 1) {
        alert("Nada para guardar");
        return;
    }
    var pos = JSON.stringify({ 
      lat: +map.markers[0].position.lat().toFixed(6), 
      lng: +map.markers[0].position.lng().toFixed(6)
    });
}

$(function(){

    function geolocalizar(){
        map = new GMaps(
            {
              el: "#map",
              lat: lat,
              lng: lng,
              click: function(e){
                putMarker(e.latLng.lat(), e.latLng.lng());
              },
              tap: function(e){
                putMarker(e.latLng.lat(), e.latLng.lng());
              },
              zoom: 12
            });
        map.cleanRoute();
    };
    
    function setPosition(lat, lng){
        $("#latitude").val(lat);
        $("#longitude").val(lng);
        $.getJSON("http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lng+"&sensor=true",
            function(data){
                if(data.results.length > 0){
                    address = data.results[0].formatted_address;
                    $("#address").val(address);
                }
            }
        );
    };

    function putMarker(nlat, nlng){
        map.removeMarkers();
        var marker = {
            lat: nlat,
            lng: nlng,
            draggable: true,
            drag: function(e){
                setPosition(e.latLng.lat(), e.latLng.lng());
            }
        };

        map.addMarker(marker);
        setPosition(nlat, nlng);
        map.setZoom(17);
        map.setCenter(nlat, nlng);
    };

    $("#preset_position").click(function(){
        if(navigator.geolocation) {
            browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position.coords);
                putMarker(position.coords.latitude, position.coords.longitude);
                // initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                map.setZoom(17);
                map.setCenter(position.coords.latitude, position.coords.longitude);
              }, function() {
              handleNoGeolocation(browserSupportFlag);
            });
          }else {
            browserSupportFlag = false;
            handleNoGeolocation(browserSupportFlag);
          }
    });

    function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
      initialLocation = siberia;
    }
  }
    
    geolocalizar();
    if(position){
      putMarker(position.lat, position.lng);
    }
});