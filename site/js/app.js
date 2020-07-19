let currentQuestion = {}
let currentQuestionNum = 0
let questionMax = 10
let currentScore = 0
let chosenOperators = []



/**
 * Utility function to generate a random number based on max
 * @param {number} max
 */
function getRandomNumber(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function getRandomNumberInRange(min, max){
    return Math.floor(Math.random() * (max - min) + min);
  }

/**
 * Utility function to shuffle the items in an array
 * @param {object} arr
 */
function shuffleArray(arr) {
    return arr.sort(function (a, b) { return Math.random() - 0.5 })
}

function handleOperatorSelection(){
    hideGameEls()
    showOperatorEl()
    hideScoreEl()
    let startButton = document.querySelector('#btnStartOver')
    startButton.innerText = 'START'
}
function runStartGame(){
    showGameEls()
    showScoreEl()
    handleNextQuestion()
    hideOperatorEl()

    let startButton = document.querySelector('#btnStartOver')
    startButton.innerText = 'START OVER'
}
function handleStartButtonClick(action){
    if (action === 'START' && chosenOperators.length > 0){
        runStartGame()
    }
    else runGameReset()
}
function generateWrongAnswer(question, correctAnswer){
    const QUESTION_DEVIATION = 5
    const FALSE = 0 //comment later
    const TRUE = 2

    let deviation = getRandomNumberInRange(1, QUESTION_DEVIATION + 1)
    let isPlus = getRandomNumberInRange(FALSE,TRUE)
    let wrongAnswer = {}
    wrongAnswer.number = isPlus ? correctAnswer.number + deviation : correctAnswer.number - deviation
    wrongAnswer.correct = false

    if (question.answers.find(a => a.number === wrongAnswer.number)){
        return generateWrongAnswer(question, correctAnswer)
    }
    return wrongAnswer
}
function findCorrect(question){
    switch(question.operator) {
        case '+':
            return question.left + question.right
        case '-':
            return question.left - question.right;
        case '*':
            return question.left * question.right;
        case '/':
            return question.left / question.right;
    }
}
function generateQuestion(){
    const OPERAND_MIN = 1
    const OPERAND_MAX = 9
    const TOTAL_WRONG_ANSWERS = 3

    let question = {}

    question.operator = chosenOperators[getRandomNumber(chosenOperators.length)]
    question.left = getRandomNumberInRange(OPERAND_MIN, OPERAND_MAX)
    question.right = getRandomNumberInRange(OPERAND_MIN, OPERAND_MAX)    
    question.answers = []

    let correctAnswer = {}
    correctAnswer.number = findCorrect(question)
    correctAnswer.correct = true;

    for (let i = 0; i < TOTAL_WRONG_ANSWERS; i++) {
        let wrongAnswer = generateWrongAnswer(question, correctAnswer)
        question.answers.push(wrongAnswer)
    }
    question.answers.push(correctAnswer)
    question.answers = shuffleArray(question.answers)

    return question
}
function writeCurrentQuestion(){
    let answerEls = document.querySelectorAll('#answers ul li')  
    currentQuestion = generateQuestion('*')
    let expressionEL = document.querySelector(".expression")
    expressionEL.innerText = `${currentQuestion.left} ${currentQuestion.operator} ${currentQuestion.right}`      
    for (let i = 0; i < answerEls.length; i++) {
        let answer = currentQuestion.answers[i];
        answerEls[i].innerText = answer.number
    }
}
function  writeCurrentScore(){
    let scoreEl = document.querySelector('.currentScore')
    scoreEl.innerText = currentScore;
}
function writeCurrentQuestionNum(){
    let questionNumEl = document.querySelector('.currentProblem')
    questionNumEl.innerText = currentQuestionNum
}
function runEndgame(){
    hideGameEls()
    writeCurrentScore()
}
function handleNextQuestion(){
    currentQuestionNum++    
    if (currentQuestionNum > questionMax) runEndgame()
    else{
    currentQuestion = generateQuestion()
    writeCurrentQuestion()
    writeCurrentScore()
    writeCurrentQuestionNum()
    }      
}
function runGameReset(){
    currentScore = 0
    currentQuestionNum = 0
    chosenOperators = []

    let operatorEls = document.querySelectorAll('.operator-select li')
    operatorEls.forEach(o => o.classList.remove('selected'))
    handleOperatorSelection()
}
function hideGameEls(){ hideElements('.show-hide')}
function showGameEls(){ showElements('.show-hide')}

function hideOperatorEl(){ hideElement('.operator-select')}
function showOperatorEl(){ showElement('.operator-select')}

function hideScoreEl(){ hideElement('#problem p')}
function showScoreEl(){ showElement('#problem p')}

function hideElements(selector){
    let elements = document.querySelectorAll(selector)
    elements.forEach(e => e.classList.add('hidden'))
}
function showElements(selector){
    let elements = document.querySelectorAll(selector)
    elements.forEach(e => e.classList.remove('hidden'))
}
function hideElement(selector){
    let elements = document.querySelector(selector)
    elements.classList.add('hidden')
}
function showElement(selector){
    let elements = document.querySelector(selector)
    elements.classList.remove('hidden')
}
document.addEventListener('DOMContentLoaded', () => {

    let operatorEls = document.querySelectorAll('.operator-select li')
    operatorEls.forEach(e => e.addEventListener('click', (event) => {
        let clickedOperator = event.target.innerText
        if(!chosenOperators.includes(clickedOperator)){
            chosenOperators.push(clickedOperator)
            event.target.classList.add('selected')
        }
        else{
            chosenOperators = chosenOperators.filter(o => o != clickedOperator)
            event.target.classList.remove('selected')
        }        
    }))

    let answerEls = document.querySelectorAll('#answers ul li')  
    answerEls.forEach(e => e.addEventListener('click', (event) => {
        let number = event.target.innerText
        let answer = currentQuestion.answers.find(a => a.number == number)
        if(answer.correct){currentScore++}
        handleNextQuestion()
    }))
    

    let startOverEl = document.querySelector('#btnStartOver')
    startOverEl.addEventListener('click', (event) => {
        handleStartButtonClick(event.target.innerText)
    })

    handleOperatorSelection()
})