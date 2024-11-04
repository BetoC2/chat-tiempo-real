const socket = io('/');
const roomId = window.location.href.split('/').pop();
let username = sessionStorage.getItem('username');
const numerSala = document.getElementById('numero-sala');

numerSala.innerHTML = `Sala de chat chida: ${roomId}`;

// Pregunta por el nombre de usuario si no se ha guardado en sessionStorage
if (!username) {
  username = prompt('Por favor ingrese su nombre de usuario:');
  if (!username) {
    alert('Debes ingresar un nombre de usuario para unirte al chat.');
    window.location.href = '/home';
  } else {
    sessionStorage.setItem('username', username);
  }
}

// Unirse a la sala
socket.emit('joinRoom', { room: roomId, username });

// Manejo de eventos de Socket.IO
socket.on('getMessage', (data) => {
  displayMessage(
    data,
    data.username === username ? 'own-message' : 'other-message'
  );
});

socket.on('userNotification', (data) => {
  displayNotification(data.message, data.timestamp);
});

// Enviar mensaje
const sendButton = document.getElementById('send-button');
const messageInput = document.getElementById('message-input');

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') sendMessage();
});

function sendMessage() {
  const messageContent = messageInput.value.trim();
  if (messageContent) {
    const messageData = {
      room: roomId,
      username,
      content: messageContent,
    };
    socket.emit('sendMessage', messageData);
    displayMessage(
      { ...messageData, timestamp: new Date().toLocaleString() },
      'own-message'
    );
    messageInput.value = '';
  }
}

// Mostrar mensaje en la pantalla
function displayMessage(data, messageType) {
  const messageElement = document.createElement('li');
  messageElement.classList.add('message', messageType);

  messageElement.innerHTML = `
    <span class="message-meta">
      <strong>${data.username}</strong> - ${data.timestamp}
    </span>
    <p class="message-content">${data.content}</p>
  `;

  document.getElementById('messages').appendChild(messageElement);
  messageElement.scrollIntoView();
}

// Mostrar notificación en la pantalla
function displayNotification(message, timestamp) {
  const notificationElement = document.createElement('li');
  notificationElement.classList.add('notification');
  notificationElement.innerHTML = `<span class="notification-meta">${timestamp}</span> - ${message}`;
  document.getElementById('messages').appendChild(notificationElement);
  notificationElement.scrollIntoView();
}

// Notificar cuando el usuario se desconecta
window.addEventListener('beforeunload', () => {
  socket.emit('userLeft', { room: roomId, username });
});
