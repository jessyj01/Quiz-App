const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalscore = document.getElementById('finalscore');
const MostRecentScore = localStorage.getItem('MostRecentScore');

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_SCORE = 5;

finalscore.innerText = MostRecentScore;

username.addEventListener('keyup', () =>{
    //console.log(username.value);
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = e => {
    //console.log("clicked the save button");
    e.preventDefault();

    const score = {
        score: MostRecentScore,
        name: username.value
    };

    highScores.push(score);
    highScores.sort( (a,b) => b.score - a.score);
    highScores.splice(5);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("/");
};