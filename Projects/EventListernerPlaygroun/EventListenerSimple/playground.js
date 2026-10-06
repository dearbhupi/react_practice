const log = document.getElementById('log');
const coordinateBox = document.getElementById('coordinateBox');
const coordinateX = document.getElementById('coordinateX');
const coordinateY = document.getElementById('coordinateY');

function logMe(name, note) {
    const time = new Date().toLocaleTimeString();
    const line = document.createElement('div');

    line.textContent = `${time} - ${name}: ${note}`;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
}

coordinateBox.addEventListener('pointermove', (event) => {
    const rect = coordinateBox.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    coordinateX.textContent = x;
    coordinateY.textContent = y;
    logMe('coordinateBox pointermove', `X: ${x}, Y: ${y}`);
});

coordinateBox.addEventListener('pointerleave', () => {
    logMe('coordinateBox pointerleave', 'Pointer left the coordinate box');
    coordinateX.textContent = '0';
    coordinateY.textContent = '0';
});
   