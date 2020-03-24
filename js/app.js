if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('service worker registered'))
        .catch(err => console.log('service worker not registered', err));
}

// initialize studymap
var studymap;
async function initMap() {
    console.log('initializing map');
    studymap = new google.maps.Map(document.getElementById('studymap'), {
        center: { lat: 30.577541, lng: -97.652797 },
        zoom: 16
    });
}

