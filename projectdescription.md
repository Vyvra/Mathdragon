




Needed functions

getQuestion(level) -> list[number 1, operator, number 2]
checkanswer(answer) -> boolean

roundhandler()
  addround()
  getround() -> round

const score

fight()
  fightanmiation()
  getresult()

addlevel() -> void
getlevel() -> level
resetlevel() -> void
setlevel(level) -> level


gameplay:

while true;

level = gelevelfromcookie() || 0
round = 1

if round % 10 = 0 -> fight()
if won -> level++ && resetScore
if lost -> resetScore() and level--
else: 

Server gets a new question:

getQuestion(level)

player answers question

if answer == correct -> score ++
