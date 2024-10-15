




Needed functions

getQuestion(level) -> list[number 1, operator, number 2]
checkanswer(answer) -> boolean

roundhandler()
  addround()
  getround() -> round
  

fight()
  fightanmiation()
  getresult()

addlevel() -> void
getlevel() -> level
resetlevel() -> void
setlevel(level) -> level


gameplay:

level = gelevelfromcookie() || 0

Server gets a new question:

getQuestion(level)

player answers question 
