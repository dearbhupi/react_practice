const quizData = [
  { question: "What is the capital of France?", 
        options: ["Berlin", "London", "Paris", "Madrid"], 
        answer: 2 },
  { question: "Which language runs in a web browser?", 
        options: ["Java", "C", "Python", "JavaScript"], 
        answer: 3 },
  { question: "What does CSS stand for?", 
        options: ["Cascading Style Sheets", "Creative Style System", "Computer Style Sheet"],
        answer: 0 }
];

let currentQuestion = 0;
let score = 0;


const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const scoreText = document.getElementById('scoreText');

function loadQuestion() {
  if (currentQuestion >= quizData.length) {
    questionText.textContent = "Quiz Completed!";
    optionsContainer.innerHTML = '';
    scoreText.textContent = `Final Score: ${score} / ${quizData.length}`;
    return;
  }

  const q = quizData[currentQuestion];
  questionText.textContent = q.question;
  optionsContainer.innerHTML = '';

  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.textContent = opt;
    btn.style.margin = '5px';
    btn.addEventListener('click', () => checkAnswer(idx));
    optionsContainer.appendChild(btn);
  });
}

function checkAnswer(selectedIdx) {
  if (selectedIdx === quizData[currentQuestion].answer) {
    score++;
  }
  currentQuestion++;
  loadQuestion();
}

loadQuestion();