const { app, BrowserWindow, screen, ipcMain, shell, systemPreferences } = require('electron');
const path = require('path');
const { processUserInput } = require('./services/aiService');

let mainWindow;
let isUserDragging = false;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 200,
    height: 200,
    x: width - 250,
    y: height - 250,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  if (mainWindow) {
    mainWindow.setAlwaysOnTop(true, 'screen-saver');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('set-window-position', (event, { x, y }) => {
  if (mainWindow) {
    const currentPosition = mainWindow.getPosition();
    const currentSize = mainWindow.getSize();
    const display = screen.getPrimaryDisplay().workAreaSize;

    let newX = Math.max(0, Math.min(x, display.width - currentSize[0]));
    let newY = Math.max(0, Math.min(y, display.height - currentSize[1]));

    mainWindow.setPosition(Math.round(newX), Math.round(newY), false);
  }
});

ipcMain.handle('get-window-position', async (event) => {
  if (mainWindow) {
    const [x, y] = mainWindow.getPosition();
    return { x, y };
  }
  return { x: 0, y: 0 };
});

ipcMain.on('execute-command', async (event, command) => {
  console.log(`Comando recivido para ejecutar: ${command}`);
  try {
    await shell.openPath(command);
  } catch (error) {
    console.error(`Falla al ejecutar el comando "${command}":`, error);
  }
});

ipcMain.on('user-input', async (event, message) => {
  console.log(`Entrada de usuario recibida en main.js: "${message}"`);
  
  if (!message) {
    console.error("Mensaje de usuario vacío o nulo");
    return;
  }
  
  if (message.toLowerCase().startsWith("abrir ")) {
    const itemToOpen = message.substring(6).trim();
    shell.openPath(itemToOpen).then(() => {
        mainWindow.webContents.send('assistant-response', `Intentando abrir ${itemToOpen}...`);
    }).catch(err => {
        console.error("Error al abrir ruta:", err);
        mainWindow.webContents.send('assistant-response', `Lo siento, no puedo abrir ${itemToOpen}.`);
    });
    return;
  } else if (message.toLowerCase().startsWith("ayuda ")){
    mainWindow.webContents.send('assistant-response', `Puedo conversar contigo o abrir aplicaciones. Prueba diciendo "abrir notepad".`);
    return;
  } else if (message.toLowerCase().startsWith("hora ") || message.toLowerCase().startsWith("fecha ")) {
    const now = new Date();
    mainWindow.webContents.send('assistant-response', `Son las ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} del ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}.`);
    return;
  }
  
  mainWindow.webContents.send('assistant-response', 'Pensando...');
  
  try {
    const response = await processUserInput(message);
    mainWindow.webContents.send('assistant-response', response);
  } catch (error) {
    console.error('Error al obtener respuesta de IA:', error);
    mainWindow.webContents.send('assistant-response', 'Lo siento, tuve un problema procesando tu mensaje. Por favor, intenta de nuevo.');
  }
});

ipcMain.on('toMain', (event, data) => {
  if (data === 'request-random-move' && mainWindow && !isUserDragging) {
    animateRandomMove();
  } else if (data === 'drag-start') {
    isUserDragging = true;
    if (animationTimeoutId) {
      clearTimeout(animationTimeoutId);
      animationTimeoutId = null;
    }
  } else if (data === 'drag-end') {
    isUserDragging = false;
  }
});

let animationTimeoutId = null;

function animateWindowPosition(targetX, targetY, duration = 500) {
  if (!mainWindow) return;
  if (animationTimeoutId) {
    clearTimeout(animationTimeoutId);
  }

  const startPosition = mainWindow.getPosition();
  const startX = startPosition[0];
  const startY = startPosition[1];
  const distanceX = targetX - startX;
  const distanceY = targetY - startY;
  let startTime = null;

  function step(timestamp) {
    if (isUserDragging) {
      if (animationTimeoutId) clearTimeout(animationTimeoutId);
      animationTimeoutId = null;
      return;
    }
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);

    const currentX = Math.round(startX + distanceX * progress);
    const currentY = Math.round(startY + distanceY * progress);

    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setPosition(currentX, currentY);
    }

    if (progress < 1 && !isUserDragging) {
      animationTimeoutId = setTimeout(() => step(Date.now()), Math.round(1000 / 140));
    } else {
      animationTimeoutId = null;
      if (isUserDragging) {
          console.log("Animación interrumpida al arrastrar la ventana.");
      }
    }
  }

  if (isUserDragging) return;

  animationTimeoutId = setTimeout(() => step(Date.now()), 0);
}

function animateRandomMove() {
  if (!mainWindow || isUserDragging) return;
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  const [windowWidth, windowHeight] = mainWindow.getSize();

  const newX = Math.floor(Math.random() * (screenWidth - windowWidth));
  const newY = Math.floor(Math.random() * (screenHeight - windowHeight));

  //animateWindowPosition(newX, newY, 1500); Esto para otra versión mientras hago animation frames
}

app.on('ready', () => {
  if (process.platform === 'darwin') {
    const microphoneStatus = systemPreferences.getMediaAccessStatus('microphone');
    console.log('Estado inicial de permiso de micrófono:', microphoneStatus);
    
    if (microphoneStatus !== 'granted') {
      systemPreferences.askForMediaAccess('microphone')
        .then(granted => {
          console.log('Permiso de micrófono concedido:', granted);
        })
        .catch(err => {
          console.error('Error al solicitar permiso de micrófono:', err);
        });
    }
  }
  
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});