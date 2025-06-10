# <img src="renderer/assets/icon.png" alt="Blu3 Logo" width="35"/> Asistente Shimeji con Integración de IA Local (Ollama)

Una aplicación de asistente virtual con mascota de escritorio que utiliza inteligencia artificial local gracias a **Ollama**.

## ✨ Características

* Mascota animada personalizable
* Reconocimiento de lenguaje natural en español
* Respuestas impulsadas por IA local con Ollama
* Síntesis de voz (text-to-speech)
* Capacidad para abrir archivos y programas

## ⚙️ Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de tener Ollama instalado:

1. Descarga e instala Ollama desde [ollama.ai](https://ollama.ai)
2. Descarga el modelo de IA que desees (por ejemplo, Mistral):

   ```bash
   ollama pull mistral
   ```
3. Verifica que Ollama esté en ejecución antes de iniciar la app

## 🚀 Instalación

1. Clona este repositorio
2. Instala las dependencias:

   ```bash
   npm install
   ```
3. Inicia la aplicación:

   ```bash
   npm start
   ```

## 🧠 Cómo Usarlo

* **Haz clic en la mascota** para activar el recuadro de mensajes
* **Escribe en español** para interactuar con ella
* **Arrástrala** con el mouse para moverla por la pantalla
* **Escribe “abrir \[programa/archivo]”** para ejecutar apps o archivos locales. Lista de [Comandos](https://github.com/smn1else/Blu3/blob/main/COMANDOS.md).

## 🔍 ¿Cómo Funciona?

1. Utiliza un cuadro de texto donde se introduce tu mensaje
2. La entrada se envía a un modelo IA local mediante Ollama
3. El asistente responde con texto y voz

## 🛠 Personalización

Puedes cambiar el modelo de IA modificando el archivo `src/services/aiService.js`:

```javascript
const response = await axios.post('http://localhost:11434/api/generate', {
  model: 'mistral', // Cambia esto por el modelo que hayas descargado
  prompt: `Eres un asistente amigable llamado Blu3. Responde de manera breve y simpática en español a: ${userInput}`,
  stream: false
});
```

## 🧩 Solución de Problemas

* ¿No conecta con Ollama? Asegúrate de que esté en ejecución
* ¿Las respuestas son lentas? Prueba con un modelo más ligero

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia [MIT](https://github.com/smn1else/Blu3/blob/main/LICENSE).
