if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('Mathdragon/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}



const LEVELDATA = [
  {
    "level": 0,
    "requiredScore": 0,
    "name": "dog",
    "symbol": "🐲",
    "maxTerm1": 5,
    "maxTerm2": 5,
    "allowNegative": false,
    "operators": ["+"],
    "unlockScore": 0
  },
  {
    "level": 1,
    "requiredScore": 20,
    "name": "bear",
    "symbol": "👻",
    "maxTerm1": 10,
    "maxTerm2": 10,
    "allowNegative": false,
    "operators": ["+"],
  },
  {
    "level": 2,
    "requiredScore": 60,
    "name": "tiger",
    "symbol": "🦈",
    "maxTerm1": 7,
    "maxTerm2": 5,
    "allowNegative": false,
    "operators": ["-"],
  },
  {
    "level": 3,
    "requiredScore": 90,
    "name": "robot",
    "symbol": "🤖",
    "maxTerm1": 10,
    "maxTerm2": 10,
    "allowNegative": false,
    "operators": ["+", "-"],
  },
  {
    "level": 4,
    "requiredScore": 120,
    "name": "T-rex",
    "symbol": "🦖",
    "maxTerm1": 12,
    "maxTerm2": 12,
    "allowNegative": false,
    "operators": ["+", "-"],
  },
  {
    "level": 5,
    "requiredScore": 150,
    "name": "superdragon",
    "symbol": "🐉",
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

function getLevelDataFromSymbol(symbol) {
  for (let index = 0; index < LEVELDATA.length; index++) {
    levelsymbol = LEVELDATA[index].symbol
    if (levelsymbol == symbol) {
      return LEVELDATA[index].level
    }
  }
}

const Player = {
  score: 0,
  currentCharacter: LEVELDATA[0].symbol,
  currentCharacterScore: 0,
  currentLevel: LEVELDATA[getLevelDataFromSymbol(this.currentCharacter)],
  level: 0,
  setScore: function (int) {
    this.currentCharacterScore += int;
    this.score += int
    localStorage.setItem(getLevelDataFromSymbol(this.currentCharacter), Number(this.currentCharacterScore))
    localStorage.setItem("score", this.score)
    // Switch character on levelup and show level up splash
    for (let index = 0; index < LEVELDATA.length; index++) {
      if (LEVELDATA[index].requiredScore == this.score) {
        this.switchCharacter(LEVELDATA[index].symbol)
        showLevelUpSplash()
      }
    }
  },

  switchCharacter: function (newchar) {
    localStorage.setItem(this.currentCharacter, this.currentCharacterScore)
    this.currentCharacter = newchar
    this.currentCharacterScore = Number(localStorage.getItem(newchar))
    this.level = getLevelDataFromSymbol(this.currentCharacter)
    localStorage.setItem("currentCharacter", this.currentCharacter)
    drawScreen()
  },

  loadData: function () {
    this.score += Number(localStorage.getItem("score"))
    this.currentCharacter = localStorage.getItem("currentCharacter")
    if (localStorage.getItem("currentCharacter")) {
      this.currentCharacter = localStorage.getItem("currentCharacter")
    } else {
      this.currentCharacter = LEVELDATA[0].symbol
    }
    this.currentCharacterScore += Number(localStorage.getItem(this.currentCharacter))
  },
  resetData: function () {
    this.score = 0
    localStorage.clear()
    this.currentCharacter = LEVELDATA[0].symbol
    init()
    drawScreen()
  }
}


function poseQuestion() {
  let question = createQuestion(Player.level)
  let posedQuestion = [question[0], ' = '].join('')
  const container = document.querySelector('#question')
  container.textContent = posedQuestion
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
    Player.setScore(1)
  } else {
    result.className = 'fadereset'
    document.getElementById('result').innerHTML = "&#10062;&#10062;"
    setTimeout(() => { result.className = 'fadeout' }, 300);
  }
  document.getElementById('answer').value = ""

}
function drawScreen() {
  // update score 
  document.getElementById('score').textContent = "Score : " + Player.score;
  document.getElementById('level').textContent = 'Level : ' + Player.level;
  document.getElementById('dragon').textContent = Player.currentCharacter
  let dragonSize = ["font-size:", (Math.sqrt(Player.currentCharacterScore * 800)) + 20, "px"].join("")
  document.getElementById('dragon').setAttribute("style", dragonSize)
}

function gameloop(event) {
  // stop page from reloading on submit: 
  event.preventDefault();
  checkAnswer(question);
  drawScreen();
  question = poseQuestion();
}

// on page load: load data and render screen
function init() {
  Player.loadData()
  drawScreen();
  question = poseQuestion();
}

init()


// character selection screen

const btn = document.querySelector('#answerbox');
btn.addEventListener('submit', gameloop);

const reset = document.querySelector('#reset');
reset.addEventListener("click", () => {
  resetbox = document.querySelector("#reset")
  resettext = document.createElement("input")
  resettext.setAttribute("type", "text")
  resettext.setAttribute("placeholder", "Type RESET to reset")
  resettext.setAttribute("id", "resetbox")
  resetbox.replaceWith(resettext);
  reallyReset = document.querySelector("#resetbox")
  reallyReset.addEventListener("input", (event) => {
    if (reallyReset.value == ('RESET' || 'reset')) {
      Player.resetData()
      floatingMenu.classList.add('hidden')
      resetBtn = document.createElement("button")
      resetBtn.setAttribute("id", "reset")
      resetBtn.textContent = "Reset"
      resetBtn.style.backgroundColor = "red"
      resetbox = document.querySelector("#resetbox")
      resetbox.replaceWith(resetBtn)


    }
  })
})

const menuButton = document.getElementById('menu');
const floatingMenu = document.getElementById('floatingMenu');
menuButton.addEventListener('click', () => {
  floatingMenu.classList.toggle('hidden');
  populateCharacterSelect(Player);
});
const closeMenu = document.getElementById('closeMenu');
closeMenu.addEventListener('click', () => {
  floatingMenu.classList.add('hidden');
});

function characterSelector(symbol) {
  Player.switchCharacter(symbol);
  init()
  floatingMenu.classList.add('hidden');
}

function populateCharacterSelect(Player) {
  let characterSelect = document.getElementById("character-select")
  characterSelect.textContent = ""
  for (let index = 0; index < LEVELDATA.length; index++) {
    const levelbutton = document.createElement('button');
    let buttonlabel
    if (Player.score >= LEVELDATA[index].requiredScore) {
      buttonlabel = document.createTextNode(LEVELDATA[index].symbol);
      let charattribute = ["characterSelector('", buttonlabel.textContent, "')"].join("")
      levelbutton.setAttribute("onclick", charattribute)
    } else {
      buttonlabel = document.createTextNode(" ? ");
    }
    characterSelect.appendChild(levelbutton)
    levelbutton.appendChild(buttonlabel)
  }
}


// keypad logic

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
    }, 100);
  }
}

function showLevelUpSplash() {
  // Get the splash element
  const splash = document.getElementById('splash');

  // Show the splash and set it to fade in
  splash.classList.remove('hidden');
  splash.classList.add('show');

  // After a short delay, hide the splash
  setTimeout(() => {
    splash.classList.remove('show');
    splash.classList.add('hidden');
  }, 2000); // Display for 2 seconds
}
