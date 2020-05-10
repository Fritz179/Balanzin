(async () => {
  // create localStream
  const localStream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});
  // const localVideo = document.getElementById('local-video');
  // localVideo.srcObject = localStream;
  const container = document.getElementById('container')

  // connect after streams are created
  const socket = connect('/r6')
  const connections = new Map()
  const rtcConfig = {iceServers: [{urls: ["stun:stun.l.google.com:19302"]}]}

  function addTrack(track, from) {
    // create stream
    const video = document.createElement('video');
    const stream = new MediaStream();
    container.appendChild(video)
    video.srcObject = stream;
    video.play()
    video.id = from

    stream.addTrack(event.track, stream)
    console.log('connected: ' + from);
  }

  socket.on('request-offer', (users, me) => {
    console.log(me);
    container.innerHTML = ''
    users.forEach(async user => {
      // create conn
      const conn = new RTCPeerConnection(rtcConfig)
      connections.set(user, conn)

      // recive and send tracks
      conn.ontrack = event => addTrack(event.track, user)
      localStream.getTracks().forEach(track => {
        conn.addTrack(track, localStream);
      });

      // send ice candidate
      conn.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('candidate', user, event.candidate);
        }
      };

      // send offer
      const offer = await conn.createOffer({offerToReceiveVideo: 1})
      await conn.setLocalDescription(new RTCSessionDescription(offer))
      socket.emit('offer', user, conn.localDescription)
    })
  })

  socket.on('offer', async (from, offer) => {
    // create response
    const conn = new RTCPeerConnection(rtcConfig)
    connections.set(from, conn)

    // recive and send tracks
    conn.ontrack = event => addTrack(event.track, from)
    localStream.getTracks().forEach(track => {
      conn.addTrack(track, localStream);
    });

    // send ice candidate
    conn.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('candidate', from, event.candidate);
      }
    };

    // send response
    await conn.setRemoteDescription(offer)
    const response = await conn.createAnswer()
    await conn.setLocalDescription(new RTCSessionDescription(response))
    socket.emit('response', from, conn.localDescription)
  })

  socket.on('response', (from, response) => {
    // close response
    const conn = connections.get(from)

    if (conn) {
      conn.setRemoteDescription(response)
      console.log(`established with: ${from}`);
    }
  })

  socket.on('candidate', (from, candidate) => {
    // add candidate
    const conn = connections.get(from)

    if (conn) {
      conn.addIceCandidate(new RTCIceCandidate(candidate))
      .catch(e => console.error(e));
    }
  })

  socket.on('disconnectPeer', id => {
    console.log('disconnected', id);
    const el = document.getElementById(id)
    if (el) el.remove()
    connections.delete(id)
  });

  window.onunload = window.onbeforeunload = () => {
    socket.close();
  };
})();
