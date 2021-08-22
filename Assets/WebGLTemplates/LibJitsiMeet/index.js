const options = {
  hosts: {
    domain: 'YOURSTACKNAME.onavstack.net',
    muc: 'conference.YOURSTACKNAME.onavstack.net',
    focus: 'focus@auth.YOURSTACKNAME.onavstack.net/focus',
  },
  serviceUrl: 'wss://YOURSTACKNAME.onavstack.net/YOURSTACKNAME/xmpp-websocket',
  openBridgeChannel: 'websocket',
  resolution: 180,
};

const conferenceName = 'unity-demo';

let connection = null;
let isJoined = false;
let room = null;

var videoElements = {};
let localTracks = [];
let remoteTracks = {};

function onLocalTracks(tracks) {
  localTracks = tracks;
  if (isJoined) {
    for (let i = 0; i < localTracks.length; i++) {
      room.addTrack(localTracks[i]);
    }
  }
}

function onRemoteTrack(track) {
  if (track.isLocal()) {
    return;
  }

  const participantId = track.getParticipantId();

  if (!remoteTracks[participantId]) {
    remoteTracks[participantId] = [];
  }
  remoteTracks[participantId].push(track);

  if (track.getType() == 'video') {
    // Video elements just get stored, they're accessed from Unity.
    const key = "participant-" + participantId;
    window.videoElements[key] = document.createElement('video');
    window.videoElements[key].autoplay = true;
    track.attach(window.videoElements[key]);
  }
  else {
    // Audio elements get added to the DOM (can be made invisible with CSS) so that the audio plays back.
    const audioElement = document.createElement('audio');
    audioElement.autoplay = true;
    audioElement.id = "audio-" + participantId;
    document.body.appendChild(audioElement);
    track.attach(audioElement);
  }
}

function onConferenceJoined() {
  isJoined = true;
  for (let i = 0; i < localTracks.length; i++) {
    room.addTrack(localTracks[i]);
  }
}

function onUserLeft(id) {
  if (!remoteTracks[id]) {
    return;
  }
  const tracks = remoteTracks[id];
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].getType() == 'video') {
      const key = "participant-" + id;
      const videoElement = window.videoElements[key];
      if (videoElement) {
        tracks[i].detach(videoElement);
        delete window.videoElements[key];
      }
    }
    else {
      const audioElement = document.getElementById('audio-' + id);
      if (audioElement) {
        tracks[i].detach(audioElement);
        audioElement.parentNode.removeChild(audioElement);
      }
    }
  }
}

function onConnectionSuccess() {
  room = connection.initJitsiConference(conferenceName, options);
  room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
  room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
  room.on(JitsiMeetJS.events.conference.USER_JOINED, id => { remoteTracks[id] = []; });
  room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
  room.join();
}

function unload() {
  for (let i = 0; i < localTracks.length; i++) {
    localTracks[i].dispose();
  }
  room.leave();
  connection.disconnect();
}

function connect() {
  JitsiMeetJS.init(options);
  connection = new JitsiMeetJS.JitsiConnection(null, null, options);
  connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
  connection.connect();
  JitsiMeetJS.createLocalTracks({devices: ["audio", "video"]})
    .then(onLocalTracks);
}

window.addEventListener('load', connect);
window.addEventListener('beforeunload', unload);
window.addEventListener('unload', unload);