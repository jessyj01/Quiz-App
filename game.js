const question= document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressbarfull = document.getElementById("progressbarfull");
const progressText= document.getElementById("progressText");
const scoreText= document.getElementById("score");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion ={};
let acceptingAnswers = true;
let score = 0;
let questioncounter=0;
let availableQuestion=[];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&category=9&type=multiple")
.then(res => {
    //console.log(res);
    return res.json();
})
.then(loadedQuestions => {
    //console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map( loadedQuestion =>{
        const formattedQuestion ={
            question: loadedQuestion.question,
        };

        const answerChoices = [... loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random()*4) + 1;

        answerChoices.splice(formattedQuestion.answer -1, 0, 
            loadedQuestion.correct_answer);

        answerChoices.forEach((choice, index) => {
            formattedQuestion["choice" + (index + 1)] = choice;
        });

        return formattedQuestion;
    });
    

    startGame();

})
.catch(err => {
    console.error(err);
});


const CORRECT_BONUS=10;
const MAX_QUESTION=10;

startGame = () => {
    questioncounter=0;
    score=0;
    availableQuestions=[ ...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {

    if(availableQuestions.length === 0 || questioncounter >= MAX_QUESTION){
        localStorage.setItem("MostRecentScore", score);
        return window.location.assign("/end.html");
    }
    questioncounter++;
    progressText.innerText = `Question ${questioncounter}/${MAX_QUESTION}`;
    progressbarfull.style.width = `${(questioncounter/MAX_QUESTION) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = currentQuestion.question;
    

    choices.forEach(choice =>{
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e=> {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        const classToApply = selectedAnswer==currentQuestion.answer ? "correct" : "incorrect";

        if(classToApply === "correct") {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);


        setTimeout( () =>{

            if(classToApply === "incorrect")
        {
            window.alert("Answer: " + currentQuestion.answer);
        }
        }, 750);
        

        setTimeout( () =>{

            selectedChoice.parentElement.classList.remove(classToApply);
            
            getNewQuestion();
        }, 1000);

        
        

    });
});

incrementScore = num => {
    score+=num;
    scoreText.innerText=score;
}



