function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const cardId = event.dataTransfer.getData("text/plain");
  const cardElement = document.getElementById(cardId);
  
  let targetColumn = event.target;
  while (targetColumn && !targetColumn.classList.contains('column')) {
    targetColumn = targetColumn.parentElement;
  }

  if (targetColumn && cardElement) {
    targetColumn.appendChild(cardElement);
    saveState();
  }
}

function saveState() {
  const columns = ['todo', 'in-progress', 'done'];
  const state = {};

  columns.forEach(colId => {
    const col = document.getElementById(colId);
    const cards = Array.from(col.getElementsByClassName('card')).map(card => ({
      id: card.id,
      text: card.textContent
    }));
    state[colId] = cards;
  });

  localStorage.setItem('kanbanState', JSON.stringify(state));
}

function loadState() {
  const savedState = localStorage.getItem('kanbanState');
  if (!savedState) return;

  const state = JSON.parse(savedState);
  Object.keys(state).forEach(colId => {
    const col = document.getElementById(colId);
    const header = col.querySelector('h3');
    col.innerHTML = '';
    col.appendChild(header);

    state[colId].forEach(cardData => {
      const card = document.createElement('div');
      card.className = 'card';
      card.id = cardData.id;
      card.draggable = true;
      card.textContent = cardData.text;
      card.addEventListener('dragstart', drag);
      col.appendChild(card);
    });
  });
}

document.addEventListener('DOMContentLoaded', loadState);