 var Dice = require('./src/dice');
 var Character = require('./src/entity').Character;
 var Item = require('./src/entity').Item;
 var AI = require('./src/ai');
 var FSM = require('./lib/fsm');
 
 
 var monster1 = new Character({ STR: 1, DEX: 1, MIND: 1, Name : 'Monster1'}); 
 var monster2 = new Character({ STR: 1, DEX: 1, MIND: 1, Name : 'Monster2'});
 var monster3 = new Character({ STR: 1, DEX: 1, MIND: 1, Name : 'Monster3'});
 var player = new Character({ STR: 13, DEX: 1, MIND: 1, Name : 'Player'}); 
 
 var Sword = new Item({ DEX : 1, Name : 'Sword of Quickness', DRoll : 5, Type : 'Weapon'});
 var Armor = new Item({ STR : -2, DEX : 10, Name : 'Cloak of Pew', Type : 'Armor'});
  
 
 monster1.AI = new FSM(AI.Generic, 'Idle');
 monster2.AI = new FSM(AI.Generic, 'Idle');
 monster3.AI = new FSM(AI.Generic, 'Idle');
 player.AI = new FSM(AI.Generic, 'Idle');
 
 
 player.Level = 10;
 player.Equip(Sword);
 player.Equip(Armor);
 player.Reset();
 

 //console.log(player);

// monster1.Attack(player);
 
player.Attack(monster1);
 /*
 
 monster2.Attack(player);
 monster3.Attack(player);
 */

 
 setInterval(function() {
   
   player.AI.runCurrent(player);
   monster1.AI.runCurrent(monster1);
   monster2.AI.runCurrent(monster2);
   monster3.AI.runCurrent(monster3);
   
 }, 400);
 
 