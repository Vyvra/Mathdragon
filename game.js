
function getQuestion(level) {
  let a = Math.floor(Math.random() * 10);
  let b = Math.floor(Math.random() * 10);
  return [a, b, "+"]
}



function poseQuestion(question) {
  a = question[0]
  b = question[1]
  operator = question[2]
  let posedQuestion = ['How much is ', a, operator, b, '?'].join('')
  return posedQuestion;

}

function checkAnswer() {
  const answer = document.querySelector('input[id="answer"]');
  if (answer.value == (a + b)) {
    document.getElementById('result').innerHTML = "Correct"
  } else {
    document.getElementById('result').innerHTML = "sorry the correct answer was { a + b }"
  }
}

function game() {
  question = getQuestion(1)

  const container = document.querySelector('#question')
  const div = document.createElement('div');
  div.textContent = poseQuestion(question)
  container.appendChild(div)
}


const btn = document.querySelector('#submit')
btn.addEventListener('click', checkAnswer)

game()
