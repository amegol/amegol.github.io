log('Starting code.js');
var peer;
var connTM;
var connTG;
var constraints = {
    audio: true,
    video: true,
    video: { facingMode: "user" }
};
function makePeer() {
    // get a element with id name
    const id = document.getElementById('name').value;
    peer = new Peer([id], []);
    log('Joined peer');
    peer.on('connection', function(dataConnection) {
        connTM = dataConnection;
        dataConnection.on('data', function(data) {
            log('Received ' + data);
        });
        if (connTG == undefined) {
            connTG = peer.connect(connTM.peer);
            connTG.on('open', function() {
                document.getElementById('connect').disabled = true;
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
function makeConnect() {
    // get a element with id name
    const id = document.getElementById('id').value;
    connTG = peer.connect(id);
    document.getElementById('connect').disabled = true;
    connTG.on('open', function() {
        log('Connected to ' + id);
        connTG.on('error', function(err) {
            log(err);
        });
    });
}
function makeDisconnect() {
    peer.disconnect();
    log('disconnect');
}
function makeSend() {
    const msg = document.getElementById('message').value;
    connTG.send(msg);
    log('send');
}
function makeCall() {
    var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia || navigator.mediaDevices.getUserMedia(constraints);
    const id = document.getElementById('id').value;
    getUserMedia({video: true, audio: true}, function(stream) {
    var call = peer.call(id, stream);
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