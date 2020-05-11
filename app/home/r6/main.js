(async () => {
  // create localStream
  const localStream = new MediaStream()
  const defaultAudio = await navigator.mediaDevices.getUserMedia({video: false, audio: true});
  defaultAudio.getTracks().forEach(track => {
    localStream.addTrack(track, localStream);
  });
  // const localVideo = document.getElementById('local-video');
  // localVideo.srcObject = localStream;
  const container = document.getElementById('container')
  const master = document.getElementById('master-volume')
  master.oninput = () => {
    const children = container.children
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      const input = child.children[1]
      const video = child.children[2]
      video.volume = input.value * master.value
    }
  }

  // select io
  const audioInputSelect = document.getElementById('audioInput');
  const audioOutputSelect = document.getElementById('audioOutput');
  const selectors = [audioInputSelect, audioOutputSelect]
  const devices = await navigator.mediaDevices.enumerateDevices()

  const values = selectors.map(select => select.value);
  selectors.forEach(select => select.innerHTML = '');

  for (let i = 0; i !== devices.length; ++i) {
    const deviceInfo = devices[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
      audioInputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'audiooutput') {
      option.text = deviceInfo.label || `speaker ${audioOutputSelect.length + 1}`;
      audioOutputSelect.appendChild(option);
    }
  }

  audioInputSelect.onchange = async () => {
    localStream.getTracks().forEach(track => localStream.removeTrack(track))
    const audioStream = await navigator.mediaDevices.getUserMedia({video: false, audio: {deviceId: audioInputSelect.value}});

    audioStream.getTracks().forEach(track => {
      localStream.addTrack(track, audioStream)
    });
  }

  audioOutputSelect.onchange = async () => {
    const outputID = audioOutputSelect.value

    const children = container.children
    for (let i = 0; i < children.length; i++) {
      const video = children[i].children[2]
      await video.setSinkId(outputID)
    }
  }

  // connect after streams are created
  const socket = connect('/r6')
  const connections = new Map()
  const names = {}
  const rtcConfig = {iceServers: [{urls: ["stun:stun.l.google.com:19302"]}]}

  function addTrack(track, from) {
    // create stream
    const child = document.createElement('div')
    const label = document.createElement('label');
    const input = document.createElement('input');
    const video = document.createElement('video');
    child.id = from

    label.for = `"${from}-volume`
    label.innerHTML = `${names[from] || from}:`

    input.min = 0
    input.max = 1
    input.max = 1
    input.defaultValue = 1
    input.step = 0.01
    input.type = 'range'
    input.id = label.for
    input.oninput = () => video.volume = input.value * master.value

    const stream = new MediaStream();
    video.srcObject = stream;
    video.play()

    child.appendChild(label)
    child.appendChild(input)
    child.appendChild(video)
    container.appendChild(child)

    stream.addTrack(track, stream)
    console.log('connected: ' + from);
  }


  socket.on('request-offer', (users, me) => {
    const name = document.getElementById('name')
    name.oninput = () => {
      const val = name.value
      socket.emit('setName', val)
    }

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

  socket.on('setName', (of, to) => {
    names[of] = to
    const child = document.getElementById(of)
    if (child) {
      const label = child.children[0]
      if (label) {
        label.innerHTML = `${to}:`
      }
    }
  })

  window.onunload = window.onbeforeunload = () => {
    socket.close();
  };
})();
