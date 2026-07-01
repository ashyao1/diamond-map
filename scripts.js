function alerthello() {
    let num1 = 17
    let num2 = 5
    let totalnum = num1+num2
    text1 = "I have " + totalnum
    alert(text1)
}

var map = L.map('map').setView([51.574349, -1.310892], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([51.574349, -1.310892]).addTo(map);
marker.bindPopup("Diamond Light Source").openPopup();

var imageUrl = 'BaseUnder.png'
var latLngBounds = L.latLngBounds([[51.57168183170403, -1.304454803466797], [51.57701619673675, -1.3173294067382815]]);

var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
    opacity: 1.0,
    interactive: true
}).addTo(map);

var imageUrl = 'BaseOver.png'
var latLngBounds = L.latLngBounds([[51.57168183170403, -1.304454803466797], [51.57701619673675, -1.3173294067382815]]);

var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
    opacity: 1.0,
    interactive: true
}).addTo(map);

function fordata(inputdata) {
    
    var overlayMaps = {}

    console.log(inputdata)
    for(let group of inputdata) {
        var bllayers = []
        console.log(group["name"])
        for(let beamline of group["beamlines"]) {
            console.log(beamline["position"])
            var marker = L.marker(beamline["position"]).addTo(map);
            marker.bindPopup(`<h2>${beamline["name"]}</h2> <p>${beamline["description"]}</p>`).openPopup();
            bllayers.push(marker)
        }

        var blgroup = L.layerGroup(bllayers)
        blgroup.addTo(map)
        overlayMaps[group["name"]] = blgroup
    }
    var layercontrol = L.control.layers(null, overlayMaps).addTo(map);
}

fetch("beamlines_data.json")
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Network response was not ok");
        }
    })
    .then(data => fordata(data))
    .catch(error => console.error("There was a problem with the fetch operation:", error))

map.locate({setView: false, watch: true});

var stickmanIcon = L.icon({
    iconUrl: "Stickman.png",
    iconSize:     [15, 24], // size of the icon
    iconAnchor:   [28, 41], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -86] // point from which the popup should open relative to the iconAnchor
})

let usercircle = L.circle([0, 0], 0).addTo(map);
let usericon = L.marker([0,0], {icon:stickmanIcon}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy;
    var location = e.latlng

    usericon.setLatLng(location)
    usericon.bindPopup("You are within " + radius + " meters of here").openPopup();
    usercircle.setLatLng(location)
    usercircle.setRadius(radius)
}

map.on('locationfound', onLocationFound);

let markertoggle = L.control()
markertoggle.position(topright)
