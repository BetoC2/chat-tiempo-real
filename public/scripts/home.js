sessionStorage.removeItem('username');
const userInput = document.getElementById('user-input');
const usernameInput = document.getElementById('username-input');
const selectionField = document.getElementById('selection');

function getUsername() {
  const username = userInput.value;
  if (!username) return;

  sessionStorage.setItem('username', username);
  usernameInput.innerHTML = `<p class="p-welcome">Bienvenido, ${username}</p>
  <p class="p-welcome">Selecciona una sala para comenzar a chatear</p>`;
  selectionField.style.display = 'block';
}
