let sending = false;
export default async function send(source, highBytes) {
    const output = document.getElementById('output');
    if (sending) {
        output.innerHTML = 'ERROR: Already writing bytes';
        output.classList.add('error');
        return;
    }
    sending = true;
    const toSend = [];
    for (const line of source) {
        if (line.type == 'code') {
            if (highBytes) {
                toSend[line.bytePos] = (line.opcode >> 8);
            }
            else {
                toSend[line.bytePos] = (line.opcode & 255);
            }
        }
    }
    output.innerHTML = 'Sending bytes...';
    output.classList.remove('error');
    const url = 'http://raspberrypi.local:17980/';
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(toSend)
    }).catch(_e => {
        output.innerHTML = 'ERROR: Cannot connect to ' + url;
        output.classList.add('error');
    });
    if (!res)
        return;
    const text = await res.text();
    output.innerHTML = text;
    if (res.status == 200) {
        output.classList.remove('error');
    }
    else {
        output.classList.add('error');
    }
    sending = false;
}
