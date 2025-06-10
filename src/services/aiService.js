const axios = require('axios');

async function processWithOllama(userInput) {
  try {
    console.log('Enviando solicitud a Ollama API...');
    
    const response = await axios.post('http://127.0.0.1:11434/api/generate', {
      model: 'mistral',
      prompt: `Tu eres Blu3, un asistente virtual que se comunica como una persona real: cálido, natural y relajado. No hablas como un robot ni usas frases forzadas o mal traducidas. Hablas español como si estuvieras conversando con un amigo, usando expresiones comunes y cotidianas. Puedes hacer pequeñas pausas, mostrar empatía, hacer preguntas suaves si es necesario y mantener un tono amable y tranquilo. Responde con claridad, sin sonar mecánico, corto menos de 100 palabras a lo siguiente: ${userInput}`,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Respuesta recibida de Ollama API');
    
    if (response.data && response.data.response) {
      return formatResponse(response.data.response);
    } else {
      console.error('Estructura de respuesta inesperada:', response.data);
      return processLocally(userInput);
    }
  } catch (error) {
    console.error('Error en Ollama API:', error.message);
    console.log('Recurriendo a procesamiento local debido a error de Ollama');
    return processLocally(userInput);
  }
}

function processLocally(userInput) {
  console.log('Uso del procesamiento de respaldo local');
  console.log(`Entrada de procesamiento local: "${userInput}"`);
  const lowerInput = userInput.toLowerCase();
  console.log(`Entrada en minúsculas: "${lowerInput}"`);
  
  if (lowerInput.includes('hola') || lowerInput.includes('saludos')) {
    console.log('Patrón de saludo coincidente');
    return formatResponse('¡Hola! ¿Cómo estás hoy?');
  } else if (lowerInput.includes('como estas') || lowerInput.includes('cómo estás')) {
    return formatResponse('¡Estoy muy bien! Gracias por preguntar.');
  } else if (lowerInput.includes('gracias')) {
    return formatResponse('¡De nada! Estoy aquí para ayudarte.');
  } else if (lowerInput.includes('chiste') || lowerInput.includes('broma')) {
    const jokes = [
      '¿Por qué los programadores prefieren el frío? Porque odian los bugs.',
      '¿Qué hace un programador zombi? Codificar software muerto.',
      '¿Cómo se llama un montón de programadores en un avión? ¡Un stack overflow!'
    ];
    return formatResponse(jokes[Math.floor(Math.random() * jokes.length)]);
  } else if (lowerInput.includes('quien eres') || lowerInput.includes('quién eres')) {
    return formatResponse('Soy Blu3, tu asistente virtual. Estoy aquí para ayudarte y hacerte compañía.');
  }
  
  return formatResponse(`Entiendo que dijiste: "${userInput}". ¿En qué más puedo ayudarte?`);
}

async function processUserInput(userInput) {
  console.log(`Procesando entrada de usuario: "${userInput}"`);
  try {
    console.log('Intentando procesar con Ollama...');
    const response = await processWithOllama(userInput);
    console.log(`Respuesta de Ollama: "${response}"`);
    return response;
  } catch (error) {
    console.error('Error al procesar entrada de usuario:', error);
    console.log('Recurriendo a procesamiento local debido a error en processUserInput');
    const localResponse = processLocally(userInput);
    console.log(`Respuesta local: "${localResponse}"`);
    return localResponse;
  }
}

function formatResponse(text) {
  if (text === text.toUpperCase() && text.length > 1) {
    text = text.toLowerCase();
    
    text = text.replace(/(^\s*\w|[.!?]\s*\w)/g, function(c) {
      return c.toUpperCase();
    });
  }
  return text;
}

module.exports = {
  processUserInput
};