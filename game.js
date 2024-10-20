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
  },
  {
    "level": 5,
    "maxTerm1": 12,
    "maxTerm2": 12,
    "allowNegative": false,
    "operators": ["+", "-"],
  },
  {
    "level": 6,
    "maxTerm1": 14,
    "maxTerm2": 14,
    "allowNegative": false,
    "operators": ["+", "-"],
  }
]

const MAXLEVEL = LEVELDATA.length - 1
let question

function createQuestion(level) {
  let leveldata
  if (level > MAXLEVEL) {
    console.log(leveldata)
    leveldata = LEVELDATA[MAXLEVEL]
  } else {
    leveldata = LEVELDATA[level]
  }
  let term1 = Math.floor(Math.random() * leveldata.maxTerm1);
  let term2 = Math.floor(Math.random() * leveldata.maxTerm2);
  let operator = leveldata.operators[Math.floor(Math.random() * leveldata.operators.length)];
  let prompt = [term1, " ", operator, " ", term2].join('')
  let answer = eval(prompt)

  if (!leveldata.allowNegative && answer < 0) {
    // what to do when a question with a negative answer is generated ? just try again, recursively!
    // I know this is not the cleanest way to do this : P
    retry = createQuestion(level)
    prompt = retry[0]
    answer = retry[1]
  }
  return [prompt, answer, operator]
}

const Player = {
  score: 0,
  level: 0,
  addScore: function () {
    this.score += 1;
    this.level = Math.floor(this.score / 20)
    if (this.level > MAXLEVEL) {
      this.level = MAXLEVEL
    }
    this.saveData()
  },
  saveData: function () {
    localStorage.setItem("score", this.score)
    localStorage.setItem("level", this.level)
  },
  loadData: function () {
    this.score += Number(localStorage.getItem("score"))
    this.level += Number(localStorage.getItem("level"))
  },
  resetData: function () {
    this.level = 0
    this.score = 0
    this.saveData()
    updateLevelAndScore()
  }
}


function poseQuestion() {
  let question = createQuestion(Player.level)
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
  if (answer.value == question[1]) {
    let result = document.getElementById('result')
    result.className = 'fadereset'
    result.innerHTML = "&#128293;&#128293;&#9989;&#128293;&#128293;"
    setTimeout(() => { result.className = 'fadeout' }, 300);
    Player.addScore()
  } else {
    result.className = 'fadereset'
    document.getElementById('result').innerHTML = "&#10062;&#10062;"
    setTimeout(() => { result.className = 'fadeout' }, 300);
  }
  document.getElementById('answer').value = ""

}
function updateLevelAndScore() {
  // update score 
  document.getElementById('score').innerHTML = "Score : " + Player.score
  document.getElementById('level').innerHTML = 'Level : ' + Player.level
  let dragonSize = ["font-size:", (Math.sqrt(Player.score * 800)) + 20, "px"].join("")
  document.getElementById('dragon').setAttribute("style", dragonSize)
}


function gameloop(event) {
  // stop page from reloading on submit: 
  event.preventDefault();
  checkAnswer(question);
  updateLevelAndScore();
  question = poseQuestion();
}


function init() {
  Player.loadData()
  updateLevelAndScore();
  question = poseQuestion();
}


init()

const btn = document.querySelector('#answerbox');
btn.addEventListener('submit', gameloop);

const reset = document.querySelector('#reset');
reset.addEventListener("click", () => { Player.resetData() })




function pressKey(value) {
  let answer = document.getElementById("answer");
  answer.value += value;
  let button = document.querySelector(`.key[data-value="${value}"]`);
  activateKey(button);
}

function backspace() {
  let answer = document.getElementById("answer");
  answer.value = answer.value.slice(0, -1);
}

function submitInput() {
  let answer = document.getElementById("answer");
  gameloop(event)
  answer.value = ''; // Clear input after submission
  let button = document.querySelector(`.key:contains('↪')`);
  activateKey(button);

}
function activateKey(key) {
  if (key) {
    key.classList.add('active');
    setTimeout(() => {
      key.classList.remove('active');
    }, 10);
  }
}
