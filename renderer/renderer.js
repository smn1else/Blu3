const mascotImage = document.getElementById('mascot-img');
const chatBubble = document.getElementById('chat-bubble');
const chatText = document.getElementById('chat-text');
const inputContainer = document.getElementById('input-container');
const textInput = document.getElementById('text-input');
const sendButton = document.getElementById('send-button');

let movementInterval;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isThinking = false;
let inputMode = false;

function showMessage(message, duration = 5000) {
    if (showMessage.timer) clearTimeout(showMessage.timer);
    
    isThinking = message === 'Pensando...';
    
    chatText.textContent = isThinking ? 'Pensando' : message;
    
    chatBubble.style.display = 'block';
    inputContainer.style.display = 'none';
    
    if (isThinking) {
        if (showMessage.thinkingInterval) {
            clearInterval(showMessage.thinkingInterval);
        }
        
        let dots = 0;
        const thinkingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            chatText.textContent = 'Pensando' + '.'.repeat(dots);
        }, 500);
        
        showMessage.thinkingInterval = thinkingInterval;
    } else {
        if (showMessage.thinkingInterval) {
            clearInterval(showMessage.thinkingInterval);
            showMessage.thinkingInterval = null;
        }
        
        showMessage.timer = setTimeout(() => {
            chatBubble.style.display = 'none';
        }, duration);
    }
}

function speakText(text) {
    if (!('speechSynthesis' in window)) {
        console.error("Síntesis de voz no soportada.");
        showMessage("No puedo hablar ahora mismo.", 3000);
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1.5;
    utterance.lang = 'es-ES';

    window.speechSynthesis.speak(utterance);
}

function toggleInputMode() {
    inputMode = !inputMode;
    
    if (inputMode) {
        chatBubble.style.display = 'none';
        inputContainer.style.display = 'flex';
        textInput.focus();
    } else {
        inputContainer.style.display = 'none';
    }
}

function sendMessage() {
    const message = textInput.value.trim();
    
    if (message) {    
        if (window.electronAPI && window.electronAPI.sendMessage) {
            console.log("Enviando entrada de usuario al proceso principal:", message);
            window.electronAPI.sendMessage('user-input', message);
        } else {
            console.error("electronAPI o sendMessage no disponible");
        }
        
        textInput.value = '';
        
        inputMode = false;
        inputContainer.style.display = 'none';
    }
}

mascotImage.addEventListener('click', toggleInputMode);

sendButton.addEventListener('click', sendMessage);

textInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

const handleMouseMove = (event) => {
    if (!isDragging) return;
    if (window.electronAPI && window.electronAPI.setWindowPosition) {
        const newWindowX = event.screenX - dragOffsetX;
        const newWindowY = event.screenY - dragOffsetY;
        window.electronAPI.setWindowPosition(newWindowX, newWindowY);
    }
};

const handleMouseUp = () => {
    if (!isDragging) return;
    isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    if (window.electronAPI && window.electronAPI.sendMessage) {
        window.electronAPI.sendMessage('toMain', 'drag-end');
    }
    console.log("Arrastre personalizado finalizado.");
};

mascotImage.addEventListener('mousedown', async (event) => {
    if (inputMode) return;
    
    event.preventDefault();
    event.stopPropagation();

    if (window.electronAPI && window.electronAPI.sendMessage) {
        window.electronAPI.sendMessage('toMain', 'drag-start');
    }

    if (window.electronAPI && window.electronAPI.getWindowPosition) {
        try {
            const position = await window.electronAPI.getWindowPosition();
            if (position) {
                dragOffsetX = event.screenX - position.x;
                dragOffsetY = event.screenY - position.y;
                isDragging = true;
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            } else {
                console.error("No se pudo obtener la posición de la ventana para iniciar arrastre.");
            }
        } catch (error) {
            console.error("Error al obtener posición de ventana:", error);
        }
    }
});

function stopAutonomousMovement() {
    clearInterval(movementInterval);
}

function requestRandomMove() {
    if (inputMode) return;
    if (window.electronAPI && window.electronAPI.sendMessage) {
        window.electronAPI.sendMessage('toMain', 'request-random-move');
    }
}

if (window.electronAPI && window.electronAPI.onMessage) {
    window.electronAPI.onMessage('assistant-response', (message) => {
        if (message !== 'Pensando...') {
            if (showMessage.thinkingInterval) {
                clearInterval(showMessage.thinkingInterval);
                showMessage.thinkingInterval = null;
            }
            
            showMessage(`Entendido 😸`, 5000);
            speakText(message);
        } else {
            showMessage(message, 0);
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
        console.log("Atajo de teclado detectado: Enviando mensaje de prueba a la IA");
        if (window.electronAPI && window.electronAPI.sendMessage) {
            window.electronAPI.sendMessage('user-input', "Hola");
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    showMessage('Hola, soy Blu3 😸', 7000);
    if (!inputMode) {
       movementInterval = setInterval(requestRandomMove, 3000);
    }
});