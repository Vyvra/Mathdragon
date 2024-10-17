const LEVELDATA = [
  {
    "level": 1,
    "maxTerm1": 5,
    "maxTerm2": 5,
    "allowNegative": false,
    "operators": ["+"],
  },
  {
    "level": 2,
    "maxTerm1": 10,
    "maxTerm2": 10,
    "allowNegative": false,
    "operators": ["+"],
  },
  {
    "level": 3,
    "maxTerm1": 5,
    "maxTerm2": 5,
    "allowNegative": false,
    "operators": ["-"],
  },
  {
    "level": 4,
    "maxTerm1": 10,
    "maxTerm2": 10,
    "allowNegative": false,
    "operators": ["+", "-"],
  }
]

function createQuestion(level) {
  let leveldata
  let maxlevel = LEVELDATA.length - 1
  if (level > maxlevel) {
    console.log(leveldata)
    leveldata = LEVELDATA[maxlevel]
  } else {
    leveldata = LEVELDATA[level]
  }
  let term1 = Math.floor(Math.random() * leveldata.maxTerm1);
  let term2 = Math.floor(Math.random() * leveldata.maxTerm2);
  let operator = leveldata.operators[Math.floor(Math.random() * leveldata.operators.length)];
  let prompt = [term1, " ", operator, " ", term2].join('')
  let answer = eval(prompt)
  if (!leveldata.allowNegative && answer < 0) {
    retry = createQuestion(level)
    prompt = retry[0]
    answer = retry[1]
  }
  console.log([prompt, answer])
  return [prompt, answer, operator]
}

const playerScore = {
  score: 0,
  addScore: function () {
    this.score += 1;
    if (this.score % 20 == 0) {
      playerLevel.addLevel()
    }
  }

}

const playerLevel = {
  level: 0,
  addLevel: function () { this.level += 1 }
}


function poseQuestion() {
  let question = createQuestion(playerLevel.level)
  let posedQuestion = [question[0], ' = '].join('')
  const container = document.querySelector('#question')
  container.innerHTML = posedQuestion
  if (question[2] == "-") {
    container.style.color = "aqua"
  } else if (question[2] = "+") {
    container.style.color = "orangered"

  }
  return question

}

function checkAnswer(question) {
  const answer = document.querySelector('input[id="answer"]');
  console.log(["answer should be", question[1]], answer.value)
  if (answer.value == question[1]) {
    let result = document.getElementById('result')
    result.className = 'fadereset'
    result.innerHTML = "&#128293;&#128293;&#9989;&#128293;&#128293;"
    setTimeout(() => { result.className = 'fadeout' }, 300);
    playerScore.addScore()
  } else {
    result.className = 'fadereset'
    document.getElementById('result').innerHTML = "&#10062;&#10062;"
    setTimeout(() => { result.className = 'fadeout' }, 300);
  }
  document.getElementById('answer').value = ""

}
function updateLevelAndScore() {
  // update score 
  document.getElementById('score').innerHTML = "Score : " + playerScore.score
  localStorage.setItem("score", playerScore.score)
  localStorage.setItem("level", playerLevel.level)
  // update level
  let dragonSize = ["font-size:", (playerScore.score * 3) + 20, "px"].join("")
  document.getElementById('dragon').setAttribute("style", dragonSize)
  document.getElementById('level').innerHTML = 'Level : ' + playerLevel.level
}


function gameloop(event) {
  console.log(localStorage.getItem("score"));
  event.preventDefault();
  checkAnswer(question);
  updateLevelAndScore();
  question = poseQuestion();
}




savedscore = localStorage.getItem('score')
playerScore.score += Number(savedscore)
savedlevel = localStorage.getItem('level')
playerLevel.level += Number(savedlevel)
updateLevelAndScore();
let question = poseQuestion();
const btn = document.querySelector('#answerbox');
btn.addEventListener('submit', gameloop);

const reset = document.querySelector('#reset');
reset.addEventListener("click", () => { playerScore.score = 0; playerLevel.level = 0, updateLevelAndScore(); })



