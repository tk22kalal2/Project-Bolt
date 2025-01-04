export class QuizUI {
  constructor(container) {
    this.container = container;
    this.currentQuestion = null;
    this.selectedAnswer = null;
  }

  renderQuestion(questionData) {
    this.currentQuestion = questionData;
    this.selectedAnswer = null;

    this.container.innerHTML = `
      <div class="quiz-container">
        <h3 class="question">${questionData.question}</h3>
        <div class="options">
          ${questionData.options.map((option, index) => `
            <button class="option-btn" data-index="${index}">
              ${option}
            </button>
          `).join('')}
        </div>
        <div class="quiz-controls">
          <button id="checkAnswer" class="quiz-btn">Check Answer</button>
          <button id="nextQuestion" class="quiz-btn" disabled>Next Question</button>
        </div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const optionButtons = this.container.querySelectorAll('.option-btn');
    const checkButton = this.container.querySelector('#checkAnswer');
    const nextButton = this.container.querySelector('#nextQuestion');

    optionButtons.forEach(button => {
      button.addEventListener('click', () => {
        optionButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        this.selectedAnswer = parseInt(button.dataset.index);
        checkButton.disabled = false;
      });
    });

    checkButton.addEventListener('click', () => {
      if (this.selectedAnswer !== null) {
        optionButtons.forEach(button => {
          const index = parseInt(button.dataset.index);
          if (index === this.currentQuestion.correctAnswer) {
            button.classList.add('correct');
          } else if (index === this.selectedAnswer && index !== this.currentQuestion.correctAnswer) {
            button.classList.add('incorrect');
          }
        });
        checkButton.disabled = true;
        nextButton.disabled = false;
      }
    });
  }
}