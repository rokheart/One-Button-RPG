
//--- Dx ---//
module.exports = function rolls(diceNumber, diceSides) {
    for(let x = 0; x < diceNumber; x++ ) {
        (Math.floor(Math.random()*diceSides+1));
    }
}