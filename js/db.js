var markers = {}


// real-time listener of session
db.collection('sessions').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
            dropMarker(change.doc.data());
        }
        if (change.type === 'removed') {
            removeMarker(change.doc.data());
        }
    });
});


// start studying form
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
    evt.preventDefault();
    // stop refresh
    // get current user marker position and form details
    const pos = currentLocationMarker.getPosition();
    currentLocationMarker.setMap(null);
    const seshDetails = {
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
        subject: form.subject.value,
        instructions: form.instructions.value,
        latitude: pos.lat(),
        longitude: pos.lng()
    };
    // update user inSession field
    db.collection('users').doc(auth.currentUser.uid).update({ inSession: true });

    // update button
    btnContainer.innerHTML = stopButtonHTML;

    db.collection('sessions').add(seshDetails)
        .catch(err => console.log(err));

    console.log('started studying, updated UI/db, removed currentLocation marker');
});

// pressed stop studying
function stopStudying() {
    // update inSession field in users collection
    db.collection('users').doc(auth.currentUser.uid).update({ inSession: false });
    // update study button
    const btnContainer = document.getElementById('startOrStopButtonContainer');
    btnContainer.innerHTML = startButtonHTML;
    // remove session from database
    db.collection('sessions').where('uid', '==', auth.currentUser.uid).get()
        .then(snap => snap.forEach(
            doc => doc.ref.delete()
        ));
    // drop current location marker
    // maybe save current location somewhere so no need to redo request
    initCurrentLocationMarker();
    console.log('stopped studying, updated UI/db');
}

/*
    if not studying:
        add sesh form
        add button
        marker on user location draggable

    if studying:
        marker not draggable (change color)
        stop button
        stop studying button

    TODO:
        login.html <-> index.html
        create new user in auth and database when new person logs in

    Database structure
        users (key = uid)
            - email
            - name
            - inSession

        sessions
            - subject
            - instructions
            - latitude
            - longitude
            - uid
            - name
*/