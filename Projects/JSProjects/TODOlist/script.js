const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

addTaskBtn.addEventListener('click', addTask);

function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const li = document.createElement('li');
  li.textContent = taskText;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.style.marginLeft = '10px';
  deleteBtn.addEventListener('click', () => li.remove());

  li.appendChild(deleteBtn);
  taskList.appendChild(li);

  taskInput.value = '';
}