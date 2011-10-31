var Dice = require('../lib/dice');

var AI = {
  Attack: function(agent) {
    if(agent.Target) {      
      agent.Hit();
    }
  },
  
  Idle: function(agent) {
    var val = Dice.DX(100);       
      if(val < 5) {
        console.log(agent.Name + ' scans the area looking for a kill');
      }
  },
  None : function() {},
  Dead : function(agent) {    
  }
};
          

var AIProfiles = {}

//["State", "Entry", "Exit", [func, "State"], trans, trans]
AIProfiles["Generic"] = {
      'Attack' : [AI.Attack, AI.None, AI.None,[function(actor) { return (actor.HP <= 0);}, 'Dead']],      
      'Idle' : [AI.Idle, AI.None, AI.None, []],
      'Dead' : [AI.None, AI.None, AI.None, []]
};


 module.exports = AIProfiles;