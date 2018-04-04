//--- Require all necessary files ---//
const http = require('http')
const favicon = require('serve-favicon')
const finalhandler = require('finalhandler')
const path = require('path')
const fs = require('fs')
const util = require('util')
const dice = require('./Functions/roll.js')
const Hit = require('./Functions/toHit.js')

//--- global VARs ---//
let count = 0
let logLine = []
let buttonTag = "attack!"
let phase = 0

//--- Hero stats ---//
let hero = 'Hero'
let hLVL = 1
let hHP = 30
let hHPmax = 30
let hAC = 14
let hMod = 3
let hNumDD = 2
let hDDsides = 6
let EXP = 0
let EXPgoal = 20

//--- Monsters ---//
const monsters = {
  "1": { 'name': 'Skeleton', 'LVL': 1, 'HP': 10, 'HPmax': 10, 'AC': 13, 'mod': 0, 'numDD': 1, 'DDsides': 4, 'EXPmin': 20, 'EXPmax': 30 },
  "2": { 'name': 'Zombie', 'LVL': 2, 'HP': 20, 'HPmax': 20, 'AC': 14, 'mod': 1, 'numDD': 1, 'DDsides': 8, 'EXPmin': 40, 'EXPmax': 60 },
  "3": { 'name': 'Goblin', 'LVL': 1, 'HP': 5, 'HPmax': 5, 'AC': 10, 'mod': 3, 'numDD': 2, 'DDsides': 8, 'EXPmin': 5, 'EXPmax': 10},
  // "3": { 'name': 'Hurt Beholder', 'LVL': 20, 'HP': 1, 'HPmax': 9999, 'AC': 21, 'mod': 5, 'numDD': 1, 'DDsides': 100, 'EXPmin': 9000, 'EXPmax': 10000 },
}

let enemy = 'Skeleton'
let eLVL = 1
let eHP = 10
let eHPmax = 10
let eAC = 13
let eMod = 0
let eNumDD = 2
let eDDsides = 4
let EXPmin = 20
let EXPmax = 30

//--- starts server ---//
_favicon = favicon(path.join(__dirname, 'public', 'favicon.ico'))

let server = http.createServer(function onRequest(req, res) {
  let done = finalhandler(req, res)

  _favicon(req, res, function onNext(err) {
    if (err) return done(err)
    count++
    //--- resetable VARs ---//
    let eToHit = false
    let enemyAlive = 0
    let diceRoll = 0
    let EXPgain
    console.log('/---' + count + '---/')
    logLine.push("/--- " + count + ' ---/')

    //--- Are you dead? ---//
    if (hHP <= 0) {
      res.write('<style type="text/css">.tg  {border-collapse:collapse;border-spacing:0;}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}.tg .tg-cpu2{border-color:#000000;vertical-align:top}.tg .tg-3z1b{border-color:#000000;text-align:right;vertical-align:top}.tg .tg-wp8o{border-color:#000000;text-align:center;vertical-align:top}')
      res.write('</style><table class="tg"><tr><td class="tg-wp8o" colspan="7">')
      res.write(EXP.toString() + " / " + EXPgoal.toString())
      res.write('</td></tr><tr><td class="tg-cpu2" colspan="2">')
      res.write(hero)
      res.write('</td><td class="tg-cpu2">')
      res.write(hLVL.toString())
      res.write('</td><td class="tg-cpu2">')
      res.write('LVL')
      res.write('</td><td class="tg-3z1b">')
      res.write(eLVL.toString())
      res.write('</td><td class="tg-yw41" colspan="2">')
      res.write(enemy)
      res.write('</td></tr><tr><td class="tg-cpu2" colspan="2">')
      res.write(hHP.toString() + '/' + hHPmax.toString())
      res.write('</td><td class="tg-wp8o" colspan="3">')
      res.write('Health')
      res.write('</td><td class="tg-3z1b" colspan="2">')
      res.write(eHP.toString() + '/' + eHPmax.toString())
      res.write('</td></tr></table>')
      res.write('<font size="7">You are dead</font>')
      res.write('<p>Level reached: ')
      res.write(hLVL.toString())
      res.write('</p>')
    } else {

      //--- did your attack hit? ---//
      diceRoll = dice.roll(1, 20)
      let toHit = Hit.attack(diceRoll, hMod, eAC)
      if (toHit === true) {
        console.log('Hero hit')
        logLine.push('You rolled a ' + diceRoll + ' and hit!')
      } else {
        console.log('Hero missed')
        logLine.push('You rolled a ' + diceRoll + ' and missed!')
      }

      //--- damage if hit ---//
      if (toHit === true) {
        dmg = dice.roll(hNumDD, hDDsides)
        eHP -= dmg
        console.log('Hero dmg: ' + dmg)
        logLine.push('You did ' + dmg + ' damage!')
        if (eHP <= 0) {
          console.log('Enemy died')
          logLine.push('You killed the ' + enemy + "!")
        } else {
          enemyAlive = 1
        }
      } else {
        enemyAlive = 1
      }

      //---enemy attack if still alive ---//
      if (enemyAlive === 1) {
        eDiceRoll = dice.roll(1, 20)
        eToHit = Hit.attack(eDiceRoll, eMod, hAC)
        if (eToHit === true) {
          console.log('Enemy hit')
          logLine.push('The ' + enemy + ' rolled a ' + eDiceRoll + ' and hit!')
        } else {
          console.log('Enemy missed')
          logLine.push('The ' + enemy + ' rolled a ' + eDiceRoll + ' and missed!')
        }
      }

      //--- damage if hit ---//
      if (eToHit === true) {
        let eDmg = dice.roll(eNumDD, eDDsides)
        hHP -= eDmg
        console.log('Enemy dmg: ' + eDmg)
        logLine.push('The ' + enemy + ' did ' + eDmg + ' damage!')
        if (hHP <= 0) {
          console.log('Hero died')
          logLine.push('The ' + enemy + ' killed You!')
        }
      }

      //--- reward exp ---/
      if (eHP <= 0) {
        EXPgain = dice.roll(1, (EXPmax - EXPmin))
        EXPgain += EXPmin
        EXP += EXPgain
        console.log("gained EXP: " + EXPgain)
        logLine.push('You gain ' + EXPgain + ' EXP!')
      }

      //--- LVL up if exp over goal ---/
      if (EXP >= EXPgoal) {
        hLVL += 1
        EXPgoal += 2 * EXPgoal
        hMod += 1
        hNumDD += 1
        hDDsides += 2
        hHPmax += 10
        hAC += 1
        hHP = hHPmax
        console.log('Hero LVLed up: ' + hLVL)
        logLine.push('You LVLed up!')
      }

      //--- Load new enemy if dead ---/
      if (enemyAlive === 0) {
        let monIndex = dice.roll(1, 3)
        enemy = monsters[monIndex.toString()]['name']
        eLVL = monsters[monIndex.toString()]['LVL']
        eHP = monsters[monIndex.toString()]['HP']
        eHPmax = monsters[monIndex.toString()]['HPmax']
        eAC = monsters[monIndex.toString()]['AC']
        eMod = monsters[monIndex.toString()]['mod']
        eNumDD = monsters[monIndex.toString()]['numDD']
        eDDsides = monsters[monIndex.toString()]['DDsides']
        EXPmin = monsters[monIndex.toString()]['EXPmin']
        EXPmax = monsters[monIndex.toString()]['EXPmax']
        console.log('new enemy: ' + enemy)
        logLine.push('A new challenger approches, you see a ' + enemy)
      }
      
      //--- scrolls log to the bottom
      res.write("<!DOCTYPE html>")
      res.write("<html>")
      res.write('<body onload="myFunction()">')
      res.write("<script>")
      res.write("function myFunction() {")
      res.write("let objDiv=document.getElementById('log');")
      res.write("objDiv.scrollTop=objDiv.scrollHeight;")
      res.write("}")
      res.write("</script>")

      //--- Write out info table/hud ---//
      res.write('<style type="text/css">.tg  {border-collapse:collapse;border-spacing:0;}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}.tg .tg-cpu2{border-color:#000000;vertical-align:top}.tg .tg-3z1b{border-color:#000000;text-align:right;vertical-align:top}.tg .tg-wp8o{border-color:#000000;text-align:center;vertical-align:top}')
      res.write('</style><table class="tg"><tr><td class="tg-wp8o" colspan="7">')
      res.write(EXP.toString() + " / " + EXPgoal.toString())
      res.write('</td></tr><tr><td class="tg-cpu2" colspan="2">')
      res.write(hero)
      res.write('</td><td class="tg-cpu2">')
      res.write(hLVL.toString())
      res.write('</td><td class="tg-cpu2">')
      res.write('LVL')
      res.write('</td><td class="tg-3z1b">')
      res.write(eLVL.toString())
      res.write('</td><td class="tg-yw41" colspan="2">')
      res.write(enemy)
      res.write('</td></tr><tr><td class="tg-cpu2" colspan="2">')
      res.write(hHP.toString() + '/' + hHPmax.toString())
      res.write('</td><td class="tg-wp8o" colspan="3">')
      res.write('Health')
      res.write('</td><td class="tg-3z1b" colspan="2">')
      res.write(eHP.toString() + '/' + eHPmax.toString())
      res.write('</td></tr></table>')

      //--- Fuction to print out the text log ---//
      res.write('<div id="log" style="height:290px;overflow:scroll;padding:10px;">')
      for (i = 0; i < logLine.length; i++) {
        res.write('<p>')
        res.write(logLine[i])
        res.write('</p>')
      }
      res.write('</div>')

      //--- Action button ---//
      res.write('<form action="/">')
      res.write('    <input type="submit" value="')
      res.write(buttonTag)
      res.write('">')
      res.write('</form>')
      res.write("</body>")
      res.write("</html>")
    }
    console.log('')
    res.end()
  })
}).listen(3030)
console.log('Server open, listening on port: ' + server.address().port)