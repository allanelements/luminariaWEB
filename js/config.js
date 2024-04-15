const deviceList = document.getElementById('deviceList');
const ws = new WebSocket('ws://localhost:8124');

ws.addEventListener('message', (event) => {
    const message = event.data;
    updateDeviceList(message);
});

function updateDeviceList(device) {
    // Verifica se o dispositivo já está na lista
    let deviceExists = false;
    const deviceItems = deviceList.querySelectorAll('li');
    deviceItems.forEach(item => {
        if (item.textContent.includes(device)) {
            deviceExists = true;
        }
    });

    if (!deviceExists) {
        // Adiciona o dispositivo à lista como uma opção clicável
        const listItem = document.createElement('li');
        const deviceLink = document.createElement('a');
        deviceLink.textContent = device;
        deviceLink.href = `../html/index.html?device=${encodeURIComponent(device)}`;
        listItem.appendChild(deviceLink);
        deviceList.appendChild(listItem);
    }
}

