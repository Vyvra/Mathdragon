let level = localStorage.getItem("level") || 0;
let score = localStorage.getItem("score") || 0;
let a = 0;
let b = 0;

function getQuestion(level) {
  let a = Math.floor(Math.random() * 10);
  let b = Math.floor(Math.random() * 10);
  return [a, b, "+"]
}

function poseQuestion() {
  let question = getQuestion(level)
  a = question[0]
  b = question[1]
  let operator = question[2]
  let posedQuestion = [a, " ", operator, " ", b, ' = '].join('')
  const container = document.querySelector('#question')
  container.innerHTML = posedQuestion

}

function checkAnswer() {
  const answer = document.querySelector('input[id="answer"]');
  if (answer.value == (a + b)) {
    document.getElementById('result').innerHTML = "&#128293;&#128293;&#9989;&#128293;&#128293;"
    score += 1;
    if (score % 10 == 0) {
      level += 1;
    }
  } else {
    document.getElementById('result').innerHTML = "&#10062;&#10062;"
  }
  document.getElementById('answer').value = ""

}
function updateLevelAndScore() {
  // update score 
  document.getElementById('score').innerHTML = "Score : " + score
  localStorage.setItem("score", score)
  // update level
  let dragonSize = ["font-size:", score * 4 + 20, "px"].join("")
  document.getElementById('dragon').setAttribute("style", dragonSize)
  // document.getElementById('level').innerHTML = ':evel : ' + level
}


function gameloop(event) {
  event.preventDefault()
  checkAnswer();
  updateLevelAndScore();
  poseQuestion();
}

updateLevelAndScore();
poseQuestion();
const btn = document.querySelector('#answerbox');
btn.addEventListener('submit', gameloop);

// game()
