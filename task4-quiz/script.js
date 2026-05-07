const quizData = [
    {
        question: "Which language is used to structure web pages?",
        a: "CSS",
        b: "HTML",
        c: "Java",
        d: "Python",
        correct: "b"
    },
    {
        question: "Which language styles websites?",
        a: "Python",
        b: "HTML",
        c: "CSS",
        d: "C++",
        correct: "c"
    },
    {
        question: "Which language adds interactivity?",
        a: "JavaScript",
        b: "SQL",
        c: "Java",
        d: "Bootstrap",
        correct: "a"
    },
    {
        question: "Which tag creates hyperlinks?",
        a: "<a>",
        b: "<img>",
        c: "<div>",
        d: "<p>",
        correct: "a"
    },
    {
        question: "Which company developed JavaScript?",
        a: "Google",
        b: "Microsoft",
        c: "Netscape",
        d: "Apple",
        correct: "c"
}];
quizData.sort(() => Math.random() - 0.5);
const homeScreen = document.getElementById("homeScreen");
const quizContainer = document.getElementById("quizContainer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const nextBtn = document.getElementById("nextBtn");
const progress = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const warning = document.getElementById("warning");
const answers = document.querySelectorAll('input[name="answer"]');
let currentQuiz = 0;
let score = 0;
let timeLeft = 30;
let timer;
document.getElementById("startBtn")
.addEventListener("click", startQuiz);
window.onload = function () {
    if(localStorage.getItem("popupShown")) {
        document.getElementById("popup")
        .style.display = "none";
    }};
function closePopup() {
    document.getElementById("popup")
    .style.display = "none";
    localStorage.setItem("popupShown", "true");
}
function startQuiz() {
    homeScreen.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    loadQuiz();
}
function loadQuiz() {
    deselectAnswers();
    startTimer();
    const currentData = quizData[currentQuiz];
    questionEl.innerText = currentData.question;
    a_text.innerText = currentData.a;
    b_text.innerText = currentData.b;
    c_text.innerText = currentData.c;
    d_text.innerText = currentData.d;
    progress.innerText =
        `${currentQuiz + 1}/${quizData.length}`;
    if(currentQuiz === quizData.length - 1) {
        nextBtn.innerText = "Submit Quiz";
    }
    else {
        nextBtn.innerText = "Next Question";
    }}
function deselectAnswers() {
    answers.forEach(answer => {
        answer.checked = false;
        answer.parentElement
        .classList.remove("selected");
    });
}
answers.forEach(answer => {
    answer.addEventListener("change", () => {
        answers.forEach(a => {
            a.parentElement
            .classList.remove("selected");
        });
        answer.parentElement
        .classList.add("selected");
    });
});
function getSelected() {
    let selected = undefined;
    answers.forEach(answer => {
        if(answer.checked) {
            selected = answer.value;
        }});
    return selected;
}
function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    timerEl.innerText = `${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        timerEl.innerText = `${timeLeft}s`;
        if(timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion(true);}}, 1000);
}
nextBtn.addEventListener("click", () => {
    nextQuestion(false);
});
function nextQuestion(isTimeUp) {
    const answer = getSelected();
    if(!answer && !isTimeUp) {
        warning.innerText =
        "Please select an answer!";
        return;}
    warning.innerText = "";
    if(answer === quizData[currentQuiz].correct) {
        score++;
    }
    currentQuiz++;
    if(currentQuiz < quizData.length) {
        loadQuiz();
    }
    else {
        clearInterval(timer);
        showResult();
    }}
function showResult() {
    let message = "";
    if(score >= 3) {
        message = `🎉 Hurray! You passed the quiz.<br><br>
              Your Score: ${score}/${quizData.length}`;}
    else {
        message = `😢 Oops! You failed the quiz.<br><br>
              Your Score: ${score}/${quizData.length}`;}
    quizContainer.innerHTML = `<div class="result-box">
            <h2>${message}</h2>
            <button onclick="restartQuiz()">
            Restart Quiz</button></div>`;}
function restartQuiz() {
    currentQuiz = 0;
    score = 0;
    quizData.sort(() => Math.random() - 0.5);
    quizContainer.innerHTML = `<div class="top-bar">
            <span id="progress">1/${quizData.length}</span>
            <span id="timer">30s</span>
        </div>
        <h2 id="question"></h2>
        <div class="options">
            <label class="option">
                <input type="radio" name="answer" value="a">
                <span id="a_text"></span>
            </label>
            <label class="option">
                <input type="radio" name="answer" value="b">
                <span id="b_text"></span>
            </label>
            <label class="option">
                <input type="radio" name="answer" value="c">
                <span id="c_text"></span>
            </label>
            <label class="option">
                <input type="radio" name="answer" value="d">
                <span id="d_text"></span>
            </label>
        </div>
        <button id="nextBtn">
            Next Question
        </button>
        <p id="warning"></p>`;
    location.reload();}