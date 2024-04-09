const lampe = document.querySelectorAll('.lampe input');

const hostName ='ws://luminaria-elements:80/ws'
const socket = new WebSocket(hostName)

socket.onopen = function (e) {
    console.log(e);
    e.currentTarget.onmessage = function (event) {
        console.log(`[message] Data received from server: ${event.data}`);
        localStorage.setItem('lunimario', event.data)
    };
};

function response(){
    socket.onmessage = function (event) {
        console.log(`[message] Data received from server: ${event.data}`);
        localStorage.setItem('lunimario',event.data)
    }; 
}

function getdata(){
    if (socket.readyState === WebSocket.OPEN) {
        console.log('open')
        var message = { selectedHour: 12 }
        socket.send(message);
        response()
    } else {
        console.error('WebSocket connection is not open');
    }
  
}
getdata()

socket.onmessage = function (event) {
    console.log(`[message] Data received from server: ${event.data}`);
    localStorage.setItem('lunimario', event.data)
};

socket.onclose = function (event) {
    if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        console.log('[close] Connection died');
    }
};

function options(value,type){
    var power = { onOffState: value }
    var automotic = { modoAutomaticoState: value }
    var hour = { selectedHour: value }
    var message = type == 'power' ? power : type == 'automotic' ? automotic: hour
    return JSON.stringify(message)
}

lampe.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        var type = e.target.dataset.type
        const value = e.target.checked ? e.target.dataset.on : e.target.dataset.off;
        if (socket.readyState === WebSocket.OPEN) {
            var message = options(value, type)
            socket.send(message);
           response()
        } else {
            console.error('WebSocket connection is not open');
        }
    });
});