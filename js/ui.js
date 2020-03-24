// make side nav and add button work
document.addEventListener('DOMContentLoaded', function () {
    // nav menu
    const menus = document.querySelectorAll('.side-menu');
    M.Sidenav.init(menus, { edge: 'right' });

    // start studying form
    const forms = document.querySelectorAll('.side-form');
    M.Sidenav.init(forms, { edge: 'left' });

});

// html references
const btnContainer = document.getElementById('startOrStopButtonContainer');


// initialize current location marker
var currentLocationMarker;
var currentLocationIcon = {
    url: "/img/mylocation.svg",
    anchor: new google.maps.Point(25, 50),
    scaledSize: new google.maps.Size(50, 50),
}
async function initCurrentLocationMarker() {
    const pos = await getLocation();
    const latlang = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

    currentLocationMarker = new google.maps.Marker({
        position: latlang,
        map: studymap,
        draggable: true,
        icon: currentLocationIcon
    });
    console.log('got current location', latlang);
}


// gets current position of user
function getLocation() {
    if (navigator.geolocation) {
        const options = { enableHighAccuracy: true }
        return new Promise((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej, options);
        });
    } else {
        console.log("Geo Location not supported by browser");
    }
}

// drop marker when new session added
function dropMarker(data) {
    var latlang = new google.maps.LatLng(data.latitude, data.longitude);
    var marker = new google.maps.Marker({
        position: latlang,
        label: data.name,
        map: studymap,
    });
    if (auth.currentUser.uid == data.uid) {
        marker.setLabel(null);
        marker.setIcon(currentLocationIcon);
    }
    var infowindow = new google.maps.InfoWindow({
        content: `${data.subject} - ${data.instructions}`
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(studymap, marker);
    });
    markers.uid = marker;
    console.log('dropped marker at', data.latitude, data.longitude, data.name);
}

function removeMarker(data) {
    const uid = data.uid;
    const marker = markers.uid;
    marker.setMap(null);
}


var startButtonHTML = `
    <a class="btn-floating btn-small btn-large startOrStop-btn sidenav-trigger" data-target="side-form">
        <i class="material-icons">add</i>
    </a>
`;

var stopButtonHTML = `
    <a class="btn-floating btn-small btn-large startOrStop-btn" onClick="stopStudying();">
        <i class="material-icons">clear</i>
    </a>
`;


// check if in session and set button and form dependent on that
auth.onAuthStateChanged(user => {
    if (user) {
        const uid = auth.currentUser.uid;

        db.collection('users').doc(uid).get().then(doc => {
            const studying = doc.data().inSession;
            btnContainer.innerHTML = studying ? stopButtonHTML : startButtonHTML;
            if (!studying) {
                initCurrentLocationMarker();
            }
            console.log(auth.currentUser.displayName, 'studying=', studying)
        });
    }
});
