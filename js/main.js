var webSocketAdd; // Endereço IP padrão do servidor WebSocket
var webSocketPort = 80; // Porta padrão do servidor WebSocket


var ws; // Variável para armazenar a conexão WebSocket


// Obtenha a string da URL atual
var urlString = window.location.href;

// Use uma expressão regular para extrair o valor do dispositivo
var deviceMatch = urlString.match(/Solare\w{6}/);

// Verifique se há correspondência
if (deviceMatch) {
    // O primeiro item no array corresponde à expressão regular
    // Então, pegamos o valor correspondente ao grupo de captura (Solarexxxxxx)
    var deviceValue = deviceMatch[0].toString();

    console.log('Valor do dispositivo:', deviceValue);
    webSocketAdd = deviceValue;
} else {
    console.log('Dispositivo não encontrado na URL.');
}

    



function setupWebSocket() {
    // Fecha a conexão WebSocket existente, se houver
    if (ws) {
        ws.close();
    }
    // Configura a nova conexão WebSocket com o endereço atualizado
    ws = new WebSocket('ws://' + webSocketAdd + ':' + webSocketPort + '/ws');
    ws.onopen = function(event) {
        console.log('Conexão WebSocket estabelecida');
        // Adicione aqui qualquer lógica adicional necessária ao abrir a conexão
    };
    ws.onclose = function(event) {
        console.log('Conexão WebSocket fechada');
        // Adicione aqui qualquer lógica adicional necessária ao fechar a conexão
    };
    ws.onmessage = function(event) {
        handleMessage(event);
        // Adicione aqui qualquer lógica adicional para lidar com as mensagens recebidas
    };
}

// Chame a função setupWebSocket() para configurar a conexão WebSocket inicial
setupWebSocket();

// Função para desabilitar os comandos na tela
function disableCommands() {
    // Desabilita os botões
    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(function(button) {
        button.disabled = true;
    });
    // Desabilita os switches
    document.getElementById('onOffSwitch').disabled = true;
    document.getElementById('modoAutomaticoSwitch').disabled = true;
    // Desabilita outros elementos interativos, se houver
}

// Função para habilitar os comandos na tela
function enableCommands() {
    // Habilita os botões
    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(function(button) {
        button.disabled = false;
    });
    // Habilita os switches
    document.getElementById('onOffSwitch').disabled = false;
    document.getElementById('modoAutomaticoSwitch').disabled = false;
    // Habilita outros elementos interativos, se houver
}

ws.onopen = function(event) {
    console.log('Conexão WebSocket estabelecida');
    disconnectedMessage.style.display = 'none';
    reconnectButton.style.display = 'none';
    connected = true;
    enableCommands();
};
// Função para lidar com as mensagens recebidas do WebSocket
function handleMessage(event) {
    var data = JSON.parse(event.data);
    // Processar os dados recebidos
    onOffState = data.onOffState;
    modoAutomaticoState = data.modoAutomaticoState;
    selectedHour=data.selectedHour;

    
    // Atualizar o estado dos switches conforme necessário
   // console.log('Valor de onOffState:', onOffState);
   // console.log('Valor de modoAutomaticoState:', modoAutomaticoState);
    //console.log('Valor de selectedHour',selectedHour);
    updateSwitches();
    updateButtonClasses();
}

// Adiciona um ouvinte para o evento 'close' do WebSocket
ws.onclose = function(event) {
    console.log('Conexão WebSocket fechada');
    connected = false;
    // Exibe a mensagem de dispositivo desconectado
    disconnectedMessage.style.display = 'block';
    reconnectButton.style.display = 'block';
    // Desabilita os comandos na tela
    disableCommands();
};

reconnectButton.addEventListener('click', function() {
    location.reload();
});
function setLight(hour) {
    console.log('Botão pressionado para o horário:', hour);
    var message = { selectedHour: hour };
    ws.send(JSON.stringify(message));
}

function toggleOnOff(checkbox) {
    var onOffValue = checkbox.checked ? 1 : 0;
    var message = { onOffState: onOffValue };
    ws.send(JSON.stringify(message));
    console.log('ON/OFF: ',onOffValue);
}

function toggleModoAutomatico(checkbox) {
    var modoAutomaticoValue = checkbox.checked ? 1 : 0;
    var message = { modoAutomaticoState: modoAutomaticoValue };
    ws.send(JSON.stringify(message));
    console.log('Auto: ',modoAutomaticoValue);
}

// Função para atualizar os switches com base nas variáveis globais
function updateSwitches() {
    var onOffSwitch = document.getElementById('onOffSwitch');
    var modoAutomaticoSwitch = document.getElementById('modoAutomaticoSwitch');
    if (typeof onOffState !== 'undefined') {
        onOffSwitch.checked = onOffState ? true : false;
    }
    if (typeof modoAutomaticoState !== 'undefined') {
        modoAutomaticoSwitch.checked = modoAutomaticoState ? true : false;
    }
}
function carregarDados() {
    // Esta função está vazia, já que os dados são atualizados automaticamente pelo servidor WebSocket
}
function updateButtonClasses() {
    // Remove todas as classes existentes dos botões de hora
    var buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(function(button) {
        button.classList.remove('button-selected', 'button-not-selected');

        // Desativa todos os botões se o modo automático estiver ativado
        if (modoAutomaticoState) {
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    });

    // Se o modo automático estiver ativado, não faz mais nada
    if (modoAutomaticoState) {
        return;
    }

    // Adiciona a classe correspondente ao botão selecionado
    var selectedButton = document.querySelector('.button-container button[data-hour="' + selectedHour + '"]');
    if (selectedButton) {
        selectedButton.classList.add('button-selected');
    }

    // Adiciona a classe correspondente aos botões não selecionados
    var notSelectedButtons = document.querySelectorAll('.button-container button:not([data-hour="' + selectedHour + '"])');
    notSelectedButtons.forEach(function(button) {
        button.classList.add('button-not-selected');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Atualiza as classes dos botões ao carregar a página
    updateButtonClasses();
    // Carrega os dados do WebSocket ao carregar a página
    carregarDados();

    // Atualiza os switches com base nas variáveis globais
    updateSwitches();

    
});



// Adiciona um ouvinte para o evento 'message' do WebSocket
ws.addEventListener('message', handleMessage);
