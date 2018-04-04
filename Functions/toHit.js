// does the attack hit? //
let hit
module.exports.attack = function attack(roll, mod, ac) {
  let hit = ((roll+mod)-ac);
  if(hit >= 0) {
    return (true)
  } else {
    return (false);
  };
};
