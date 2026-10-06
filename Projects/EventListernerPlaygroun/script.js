const listenerCards = [...document.querySelectorAll('.listener-card')];
const eventLog = document.querySelector('#eventLog');
const emptyState = document.querySelector('#emptyState');
const eventCount = document.querySelector('#eventCount');
const listenerCount = document.querySelector('#listenerCount');
const lastEvent = document.querySelector('#lastEvent');
const pauseButton = document.querySelector('#pauseButton');
const clearButton = document.querySelector('#clearButton');
const pointerZone = document.querySelector('#pointerZone');
const coordinateBox = document.querySelector('#coordinateBox');
const coordinateX = document.querySelector('#coordinateX');
const coordinateY = document.querySelector('#coordinateY');
const colorSwatch = document.querySelector('#colorSwatch');
const colorDot = document.querySelector('#colorDot');
const hexValue = document.querySelector('#hexValue');
const rgbValue = document.querySelector('#rgbValue');
const filterStatus = document.querySelector('#filterStatus');
const form = document.querySelector('#eventForm');
const dropZone = document.querySelector('#dropZone');
const fileInput = document.querySelector('#fileInput');

const activeListeners = new Set(listenerCards.map((card) => card.dataset.listener));
let eventTotal = 0;
let isPaused = false;
let maxLogEntries = 120;
const logEntries = [];

const eventDetails = {
  click: (event) => `Target: ${event.target.id || event.target.className || event.target.tagName} · ${event.clientX}, ${event.clientY}`,
  mousemove: (event) => `Pointer: ${event.clientX}, ${event.clientY} · ${event.movementX} px movement`,
  keydown: (event) => `Key: ${event.key} · Code: ${event.code} · ${event.altKey ? 'Alt+' : ''}${event.ctrlKey ? 'Ctrl+' : ''}${event.shiftKey ? 'Shift+' : ''}`,
  keyup: (event) => `Key released: ${event.key} · Code: ${event.code}`,
  input: (event) => `Value: ${event.target.value || '(empty)'} · Type: ${event.inputType}`,
  change: (event) => `Value: ${event.target.value} · Type: ${event.target.tagName}`,
  focus: (event) => `Focused: ${event.target.id || event.target.name || event.target.tagName}`,
  blur: (event) => `Lost focus: ${event.target.id || event.target.name || event.target.tagName}`,
  submit: (event) => `Form: ${event.target.id || 'unnamed form'} · Method: ${event.submitter?.method || 'GET'}`,
  scroll: (event) => `Scroll: ${event.target.id || event.target.tagName} · ${Math.round(event.target.scrollTop)} px`,
  touchstart: (event) => `Touches: ${event.touches.length} · Target: ${event.target.id || event.target.tagName}`,
  contextmenu: (event) => `Target: ${event.target.id || event.target.tagName} · Client: ${event.clientX}, ${event.clientY}`
};

function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat('en', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 2
  }).format(date);
}

function addEvent(type, detail) {
  if (isPaused || (!activeListeners.has(type) && type !== 'drop')) return;

  const entry = { type, detail, time: new Date() };
  logEntries.push(entry);
  if (logEntries.length > maxLogEntries) logEntries.shift();

  emptyState.hidden = true;
  const row = document.createElement('div');
  const time = document.createElement('time');
  const eventType = document.createElement('span');
  const eventDetail = document.createElement('span');

  row.className = 'event-row';
  time.textContent = formatTime(entry.time);
  eventType.className = 'event-type';
  eventType.textContent = type;
  eventDetail.className = 'event-detail';
  eventDetail.textContent = detail;
  row.append(time, eventType, eventDetail);
  eventLog.appendChild(row);

  while (eventLog.children.length > maxLogEntries) {
    eventLog.firstElementChild.remove();
  }

  eventLog.scrollTop = eventLog.scrollHeight;
  eventTotal += 1;
  eventCount.textContent = eventTotal.toLocaleString();
  lastEvent.textContent = type;
}

function updateListenerCount() {
  listenerCount.textContent = activeListeners.size;
}

function toggleListener(card) {
  const type = card.dataset.listener;
  card.classList.toggle('active');
  if (card.classList.contains('active')) {
    activeListeners.add(type);
    addEvent(type, 'Listener <b>activated</b>');
  } else {
    activeListeners.delete(type);
    addEvent(type, 'Listener <b>paused</b>');
  }
  updateListenerCount();
}

function clearLog() {
  logEntries.length = 0;
  eventLog.querySelectorAll('.event-row').forEach((row) => row.remove());
  emptyState.hidden = false;
  eventTotal = 0;
  eventCount.textContent = '0';
  lastEvent.textContent = '—';
}

listenerCards.forEach((card) => {
  card.addEventListener('click', () => toggleListener(card));
});

window.addEventListener('click', (event) => addEvent('click', eventDetails.click(event)), true);
window.addEventListener('mousemove', (event) => addEvent('mousemove', eventDetails.mousemove(event)), true);
window.addEventListener('keydown', (event) => addEvent('keydown', eventDetails.keydown(event)), true);
window.addEventListener('keyup', (event) => addEvent('keyup', eventDetails.keyup(event)), true);
window.addEventListener('scroll', (event) => addEvent('scroll', eventDetails.scroll(event)), true);
window.addEventListener('touchstart', (event) => addEvent('touchstart', eventDetails.touchstart(event)), true);
window.addEventListener('contextmenu', (event) => addEvent('contextmenu', eventDetails.contextmenu(event)), true);

document.addEventListener('input', (event) => addEvent('input', eventDetails.input(event)), true);
document.addEventListener('change', (event) => addEvent('change', eventDetails.change(event)), true);
document.addEventListener('focusin', (event) => addEvent('focus', eventDetails.focus(event)), true);
document.addEventListener('focusout', (event) => addEvent('blur', eventDetails.blur(event)), true);
document.addEventListener('submit', (event) => addEvent('submit', eventDetails.submit(event)), true);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(form).get('name') || 'Explorer';
  const status = document.createElement('div');
  status.className = 'form-success';
  status.textContent = `Thanks, ${name}! Your event was submitted.`;
  status.setAttribute('role', 'status');
  form.querySelector('.primary-button').after(status);
  window.setTimeout(() => status.remove(), 3000);
});

function getPointerColor(event) {
  const rect = pointerZone.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  const hue = (x / rect.width) * 360;
  const saturation = 100;
  const lightness = 50 + Math.sin((y / rect.height) * Math.PI) * 18;
  const hsl = `hsl(${hue} ${saturation}% ${lightness}%)`;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext('2d');
  context.fillStyle = hsl;
  context.fillRect(0, 0, 1, 1);
  return context.getImageData(0, 0, 1, 1).data;
}

function updateColor(event) {
  const rect = pointerZone.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  const [red, green, blue] = getPointerColor(event);
  const hex = `#${[red, green, blue].map((value) => value.toString(16).padStart(2, '0')).join('')}`;

  pointerZone.style.setProperty('--pointer-x', `${(x / rect.width) * 100}%`);
  pointerZone.style.setProperty('--pointer-y', `${(y / rect.height) * 100}%`);
  pointerZone.style.setProperty('--selected-color', hex);
  colorSwatch.style.background = hex;
  colorDot.style.background = hex;
  hexValue.textContent = hex.toUpperCase();
  rgbValue.textContent = `RGB(${red}, ${green}, ${blue})`;
}

pointerZone.addEventListener('pointermove', updateColor);
pointerZone.addEventListener('pointerdown', (event) => {
  updateColor(event);
  pointerZone.classList.add('active');
});
pointerZone.addEventListener('pointerup', () => pointerZone.classList.remove('active'));
pointerZone.addEventListener('pointerleave', () => pointerZone.classList.remove('active'));
pointerZone.addEventListener('focus', () => {
  pointerZone.style.setProperty('--pointer-x', '50%');
  pointerZone.style.setProperty('--pointer-y', '50%');
  pointerZone.style.setProperty('--selected-color', '#c8ff45');
  colorSwatch.style.background = '#c8ff45';
  colorDot.style.background = '#c8ff45';
  hexValue.textContent = '#C8FF45';
  rgbValue.textContent = 'RGB(200, 255, 69)';
  pointerZone.classList.add('active');
});
pointerZone.addEventListener('blur', () => pointerZone.classList.remove('active'));

coordinateBox.addEventListener('mousemove', (event) => {
  const rect = coordinateBox.getBoundingClientRect();
  const x = Math.round(event.clientX - rect.left);
  const y = Math.round(event.clientY - rect.top);
  coordinateX.textContent = x;
  coordinateY.textContent = y;
  addEvent('mousemove', `Coordinate tracker: X ${x}, Y ${y}`);
});

coordinateBox.addEventListener('mouseleave', () => {
  coordinateX.textContent = '0';
  coordinateY.textContent = '0';
});

document.querySelector('#clickDemo').addEventListener('click', () => {
  document.querySelector('#pointerZone').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
document.querySelector('#focusDemo').addEventListener('click', () => {
  pointerZone.focus();
});

pauseButton.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseButton.innerHTML = isPaused ? '<span class="pause-icon">▶</span> Resume capture' : '<span class="pause-icon">Ⅱ</span> Pause capture';
  filterStatus.textContent = isPaused ? 'CAPTURE PAUSED' : 'ALL EVENTS';
});

dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    fileInput.click();
  }
});
fileInput.addEventListener('change', () => {
  [...fileInput.files].forEach((file) => {
    const size = file.size < 1024 * 1024
      ? `${Math.max(file.size, 1)} B`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    addEvent('drop', `File: ${file.name} · Type: ${file.type || 'unknown'} · Size: ${size}`);
  });
  fileInput.value = '';
});

['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add('dragging');
  });
});
['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove('dragging');
  });
});
dropZone.addEventListener('drop', (event) => {
  [...event.dataTransfer.files].forEach((file) => {
    const size = file.size < 1024 * 1024
      ? `${Math.max(file.size, 1)} B`
      : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    addEvent('drop', `File: ${file.name} · Type: ${file.type || 'unknown'} · Size: ${size}`);
  });
});

clearButton.addEventListener('click', clearLog);

updateListenerCount();
