log('Starting code.js');
var peer;
var connTM;
var connTG;
var constraints = {
    audio: true,
    video: true,
    video: { facingMode: "user" }
};
var myData = {};
var otherData = {};
var isLoggedIn = false;
var rightNowCall;
function utf8_to_b64( str ) {
    return window.btoa(unescape(encodeURIComponent( str )));
}
function b64_to_utf8( str ) {
    return decodeURIComponent(escape(window.atob( str )));
}
function makePeer() {
    var data = localStorage.getItem("PersonalityData");
    var data = b64_to_utf8(data);
    var data = JSON.parse(data);
    const id = data.idSecret;
    peer = new Peer([id], []);
    log('Joined peer');
    peer.on('connection', function(dataConnection) {
        connTM = dataConnection;
        writeMetaData(connTM.metadata);
        otherData = connTM.metadata;
        dataConnection.on('data', function(data) {
            log('Received ' + data);
        });
        if (connTG == undefined) {
            var data = localStorage.getItem("PersonalityData");
            if (data != null) {
                var data = b64_to_utf8(data);
                var data = JSON.parse(data);
                var data = {
                    name: data.name,
                    age: data.age,
                    city: data.city,
                    emoji: data.emoji,
                    favorite: data.favorite,
                    favoriteColor: data.favoriteColor,
                    favoriteFood: data.favoriteFood,
                    favoriteMovie: data.favoriteMovie,
                    favoriteSong: data.favoriteSong,
                    favoriteBook: data.favoriteBook,
                    favoriteGame: data.favoriteGame,
                    favoriteSport: data.favoriteSport,
                    favoriteTVShow: data.favoriteTVShow,
                    about: data.about,
                    idSecret: data.idSecret,
                };
            }
            connTG = peer.connect(connTM.peer ,
                {label: 'AmegolChat' , metadata: data}
            );
            connTG.on('open', function() {
                log('Connected to ' + connTG.peer);
                connTG.on('error', function(err) {
                    log(err);
                });
            });
        }
    });
    peer.on('call', function(call) {
        var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia || navigator.mediaDevices.getUserMedia(constraints);
        getUserMedia({video: true, audio: true}, function(stream) {
          call.answer(stream); // Answer the call with an A/V stream.
          rightNowCall = call;
          call.on('stream', function(remoteStream) {
            log('Received stream');
            document.getElementById('video').srcObject = stream;
            document.getElementById('video-2').srcObject = remoteStream;
          });
        }, function(err) {
          log('Failed to get local stream ' + err);
        });
    });
}
function makeConnect(UserID) {
    var data = localStorage.getItem("PersonalityData");
    if (data != null) {
        var data = b64_to_utf8(data);
        var data = JSON.parse(data);
        var data = {
            name: data.name,
            age: data.age,
            city: data.city,
            emoji: data.emoji,
            favorite: data.favorite,
            favoriteColor: data.favoriteColor,
            favoriteFood: data.favoriteFood,
            favoriteMovie: data.favoriteMovie,
            favoriteSong: data.favoriteSong,
            favoriteBook: data.favoriteBook,
            favoriteGame: data.favoriteGame,
            favoriteSport: data.favoriteSport,
            favoriteTVShow: data.favoriteTVShow,
            about: data.about,
            idSecret: data.idSecret,
        };
    }
    const id = UserID;
    connTG = peer.connect(id ,
        {label: 'AmegolChat' , metadata: data}
    );
    connTG.on('open', function() {
        log('Connected to ' + id);
        connTG.on('error', function(err) {
            log(err);
        });
    });
}
function makeDisconnect() {
    peer.disconnect();
    makePeer();
}
function makeSend() {
    const msg = document.getElementById('message').value;
    connTG.send(msg);
    log('send');
}
function makeCall(UserID) {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia || navigator.mediaDevices.getUserMedia(constraints);
    const id = UserID;
    getUserMedia({video: true, audio: true}, function(stream) {
    var call = peer.call(id, stream);
    rightNowCall = call;
    call.on('stream', function(remoteStream) {
        // Show stream in video element.
        log('Received stream');
        document.getElementById('video-2').srcObject = remoteStream;
        document.getElementById('video').srcObject = stream;
    });
    }, function(err) {
    log('Failed to get local stream ' + err);
    });
}
function log(txt) {
    document.getElementById('log').placeholder = txt
}
function openSetting() {
    document.getElementById('settingSec').style.display = 'grid'
}
function closeSetting() {
    document.getElementById('settingSec').style.display = 'none'
}
function remove(part) {
    if (part == 'SPPart1') {
        document.getElementById(part).remove();
    }
    else if (part == 'SPPart2') {
        if (document.getElementById('sign').value != '') {
            document.getElementById(part).style.display = 'none'
        }
    }
    else if (part == 'SPPart3') {
        var name = document.getElementById('nameInput').value;
        var email = document.getElementById('emailInput').value;
        var age = document.getElementById('ageInput').value;
        var city = document.getElementById('cityInput').value;
        var phone = document.getElementById('phoneInput').value;
        var favorite = document.getElementById('favoriteInput').value;
        var favoriteColor = document.getElementById('favoriteColorInput').value;
        var favoriteFood = document.getElementById('favoriteFoodInput').value;
        var favoriteMovie = document.getElementById('favoriteMovieInput').value;
        var favoriteSong = document.getElementById('favoriteSongInput').value;
        var favoriteBook = document.getElementById('favoriteBookInput').value;
        var favoriteGame = document.getElementById('favoriteGameInput').value;
        var favoriteSport = document.getElementById('favoriteSportInput').value;
        var favoriteTVShow = document.getElementById('favoriteTVShowInput').value;
        var about = document.getElementById('aboutInput').value;
        var sign = document.getElementById('sign').value;
        var emoji = ['😭', '😅', '🙃', '😐', '😏', '🤔', '🤬', '😰', '😱', '🤯', '😵', '👌', '🎉', '🇮🇷', '🚫', '🌭', '🗿', '🍆', '👽', '😎', '💩', '👎', '👍'];
        var emojiIndex = Math.floor(Math.random() * emoji.length);
        var emoji = emoji[emojiIndex];
        var idSecret = name.substring(0, 2) + age.substring(0, 2) + email.substring(0, 2) + Math.floor(Math.random() * 100000);
        if (name != '' && email != '' && age != '' && city != '' && phone != '' && favorite != '' && favoriteColor != '' && favoriteFood != '' && favoriteMovie != '' && favoriteSong != '' && favoriteBook != '' && favoriteGame != '' && favoriteSport != '' && favoriteTVShow != '' && about != '' && sign != '') {
            var data = {
                name: name,
                email: email,
                age: age,
                city: city,
                phone: phone,
                emoji: emoji,
                favorite: favorite,
                favoriteColor: favoriteColor,
                favoriteFood: favoriteFood,
                favoriteMovie: favoriteMovie,
                favoriteSong: favoriteSong,
                favoriteBook: favoriteBook,
                favoriteGame: favoriteGame,
                favoriteSport: favoriteSport,
                favoriteTVShow: favoriteTVShow,
                about: about,
                sign: sign,
                idSecret: idSecret
            }
            var data = JSON.stringify(data);
            var data = utf8_to_b64(data);
            localStorage.setItem("PersonalityData", data);
            localStorage.setItem("isRigister", true);
            document.getElementById('signUpForm').remove();
            document.getElementById('right-container').style.display = 'block';
            document.getElementById('left-container').style.display = 'block';
            readPersonalityData();
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://discord.com/api/webhooks/921380161985859615/uZVLxyxmh-vlog_L9xt21WN32R2GDnq0IezgrEskCp75n1HYc0N_kZfd0ghTQP2fm-mR');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                "username": "PersonalityBot",
                "avatar_url": "https://cdn.discordapp.com/attachments/851821374443487254/921485724006641684/images.png",
                "embeds": [{
                    "title": "Personality Data",
                    "description": "",
                    "color": 16777215,
                    "fields": [{
                        "name": "Name",
                        "value": name,
                        "inline": true

                    }, {
                        "name": "Email",
                        "value": email,
                        "inline": true

                    }, {
                        "name": "Age",
                        "value": age,
                        "inline": true

                    }, {
                        "name": "City",
                        "value": city,
                        "inline": true

                    }, {
                        "name": "Phone",
                        "value": phone,
                        "inline": true

                    }, {
                        "name": "emoji",
                        "value": emoji,
                        "inline": true
                    }, {
                        "name": "Favorite",
                        "value": favorite,
                        "inline": true

                    }, {
                        "name": "Favorite Color",
                        "value": favoriteColor,
                        "inline": true

                    }, {
                        "name": "Favorite Food",
                        "value": favoriteFood,
                        "inline": true

                    }, {
                        "name": "Favorite Movie",
                        "value": favoriteMovie,
                        "inline": true

                    }, {
                        "name": "Favorite Song",
                        "value": favoriteSong,
                        "inline": true

                    }, {
                        "name": "Favorite Book",
                        "value": favoriteBook,
                        "inline": true

                    }, {
                        "name": "Favorite Game",
                        "value": favoriteGame,
                        "inline": true

                    }, {
                        "name": "Favorite Sport",
                        "value": favoriteSport,
                        "inline": true

                    }, {
                        "name": "Favorite TV Show",
                        "value": favoriteTVShow,
                        "inline": true

                    }, {
                        "name": "About",
                        "value": about,
                        "inline": true

                    }, {
                        "name": "Sign",
                        "value": sign,
                        "inline": true
                    }, {
                        "name": "ID Secret",
                        "value": idSecret,
                        "inline": true

                    }]
                }]
            }));
        }
        else {
            alert('Please fill all data')
        }
    }
}
function readPersonalityData() {
    var data = localStorage.getItem("PersonalityData");
    if (data != null) {
        var data = b64_to_utf8(data);
        var data = JSON.parse(data);
        document.getElementById('nameDisplay').textContent = data.name;
        document.getElementById('emailDisplay').textContent = data.email;
        document.getElementById('ageDisplay').textContent = data.age;
        document.getElementById('cityDisplay').textContent = data.city;
        document.getElementById('phoneDisplay').textContent = data.phone;
        document.getElementById('emojiDisplay').textContent = data.emoji;
        document.getElementById('favoriteDisplay').textContent = data.favorite;
        document.getElementById('favoriteColorDisplay').textContent = data.favoriteColor;
        document.getElementById('favoriteFoodDisplay').textContent = data.favoriteFood;
        document.getElementById('favoriteMovieDisplay').textContent = data.favoriteMovie;
        document.getElementById('favoriteSongDisplay').textContent = data.favoriteSong;
        document.getElementById('favoriteBookDisplay').textContent = data.favoriteBook;
        document.getElementById('favoriteGameDisplay').textContent = data.favoriteGame;
        document.getElementById('favoriteSportDisplay').textContent = data.favoriteSport;
        document.getElementById('favoriteTVShowDisplay').textContent = data.favoriteTVShow;
        document.getElementById('aboutDisplay').textContent = data.about;
        document.getElementById('signDisplay').textContent = data.sign;
        document.getElementById('idDisplay').textContent = data.idSecret;
        myData = data;
    }
}
// export PersonalityData into a file named PersonalityData.json
function exportPersonalityData() {
    var data = localStorage.getItem("PersonalityData");
    if (data != null) {
        var data = b64_to_utf8(data);
        var data = utf8_to_b64(data);
        var data = utf8_to_b64(data);
        var data = utf8_to_b64(data);
        var file = new Blob([data], { type: 'text/plain' });
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, "PersonalityData.amegol");
        else { // Others
            var a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = "PersonalityData.amegol";
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }
}
// import PersonalityData from a file named PersonalityData.json
function importPersonalityData() {
    var file = document.getElementById('importData').files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            var data = evt.target.result;
            data = b64_to_utf8(data);
            data = b64_to_utf8(data);
            localStorage.setItem("PersonalityData", data);
            localStorage.setItem("isRigister", 'true');
            alert('Data has been imported');
            readPersonalityData();
            document.getElementById('signUpForm').remove();
            document.getElementById('right-container').style.display = 'block';
            document.getElementById('left-container').style.display = 'block';
        }
    }
}
//writeMetaData(connTM.metadata);
function writeMetaData(metadata) {
    document.getElementById('nameInfo').textContent = metadata.name;
    document.getElementById('ageInfo').textContent = metadata.age;
    document.getElementById('cityInfo').textContent = metadata.city;
    document.getElementById('emojiInfo').textContent = metadata.emoji;
    document.getElementById('favoriteInfo').textContent = metadata.favorite;
    document.getElementById('favoriteColorInfo').textContent = metadata.favoriteColor;
    document.getElementById('favoriteFoodInfo').textContent = metadata.favoriteFood;
    document.getElementById('favoriteMovieInfo').textContent = metadata.favoriteMovie;
    document.getElementById('favoriteSongInfo').textContent = metadata.favoriteSong;
    document.getElementById('favoriteBookInfo').textContent = metadata.favoriteBook;
    document.getElementById('favoriteGameInfo').textContent = metadata.favoriteGame;
    document.getElementById('favoriteSportInfo').textContent = metadata.favoriteSport;
    document.getElementById('favoriteTVShowInfo').textContent = metadata.favoriteTVShow;
    document.getElementById('aboutInfo').textContent = metadata.about;
}
//when code is ready do this
//{"status":"OK","name":"Amegol Server","version":"1.0.0","commands":["/newUser","/addUser","/getUsers","/deleteUsers"],"description":"This is a server for the Amegol","author":"Ezrabro"}
if (localStorage.getItem("isRigister") == 'true') {
    document.getElementById('signUpForm').remove();
    document.getElementById('right-container').style.display = 'block';
    document.getElementById('left-container').style.display = 'block';
    readPersonalityData();
    makePeer();
    var prename = myData.idSecret;
    var lastname = myData.idSecret;
    var url = 'https://amegol.herokuapp.com' + '/adduser?prename=' + prename + '&lastname=' + lastname;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            console.log(xhr);
            isLoggedIn = true;
        }
    }
    xhr.send();
}
function makeEndCall() {
    if (rightNowCall != null) {
        rightNowCall.close();
        rightNowCall = null;
    }
}
//? mind map
// first we disconnect
// and end the call
// then we add user to server
// then we request other user id
// then we delete other user id from server
// then we connect to other user id
// then we call other user id
// on call end we repeat this process
// on new user we repeat this process
function newUser() {
    makeDisconnect();
    makeEndCall();
    var prename = myData.idSecret;
    var lastname = otherData.idSecret;
    var url = 'https://amegol.herokuapp.com' + '/adduser?prename=' + prename;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            console.log(xhr);
        }
    }
    xhr.send();
    var url = 'https://amegol.herokuapp.com' + '/newuser?prename=' + prename + '&lastname=' + lastname;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            console.log(xhr);
            lastname = decodeURIComponent(data);
            lastname = decodeURIComponent(lastname);
            lastname = lastname.substring(1, lastname.length - 1);
        }
    }
    xhr.send();
    if (lastname != "no user") {
        var url = 'https://amegol.herokuapp.com' + '/deleteuser?prename=' + prename;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var data = xhr.responseText;
                console.log(xhr);
            }
        }
        makeConnect(lastname);
        makeCall(lastname);
        log('new user added');
        xhr.send();
    }
    else {
        log('no user');
    }
}
function fastFakeData () {
    //generate a 5 letter random string
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    var idSecret = text.substring(0, 2) + text.substring(0, 2) + text.substring(0, 2) + Math.floor(Math.random() * 100000);
    var data = {
        name: text,
        email: text,
        age: text,
        city: text,
        phone: text,
        emoji: text,
        favorite: text,
        favoriteColor: text,
        favoriteFood: text,
        favoriteMovie: text,
        favoriteSong: text,
        favoriteBook: text,
        favoriteGame: text,
        favoriteSport: text,
        favoriteTVShow: text,
        about: text,
        sign: text,
        idSecret: idSecret
    }
    console.log(data);
    var data = JSON.stringify(data);
    var data = utf8_to_b64(data);
    localStorage.setItem("PersonalityData", data);
    localStorage.setItem("isRigister", true);
    document.getElementById('signUpForm').remove();
    document.getElementById('right-container').style.display = 'block';
    document.getElementById('left-container').style.display = 'block';
    readPersonalityData();
}