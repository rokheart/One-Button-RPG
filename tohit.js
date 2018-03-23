// does the player hit? //
module.exports = function(d20, mod, ac) {
  let tohit = ((d20+mod)-ac);
  if(tohit > 0) {
    let hit = true
  } else {
    let hit = false
  };
};
