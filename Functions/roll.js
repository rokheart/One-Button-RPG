
//--- Dx ---//
module.exports.roll = function roll(diceNumber, diceSides) {
    let result = 0;
    let roll = 0
    let x = 0
    for (x = 0; x < diceNumber; x++ ) {
        roll = (Math.floor(Math.random()*diceSides+1));
        result += roll;  
        console.log(x);
    }
    return (result);
}