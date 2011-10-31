var Dice = require('./dice'); 

function Combat(attacker, defender) {
      
   //Hit Calc
  var hit = (attacker.STR + Dice.D12() + attacker.HRoll) - defender.AC;
       
   if(hit <= 0) {
     console.log(attacker.Name + ' Misses ' + defender.Name)
   } else {
     
     //Dmg calc     
     var save = Math.floor((defender.Level / 4) + (defender.AC / 2) + 1);
              
     var dmg = Dice.D12() + attacker.DRoll - save;
     
     if (dmg <= 0) {
       dmg = 0;
     }
     
     defender.HP -= dmg;          
                      
     //Death
     if(defender.HP <= 0) {
       
       console.log(attacker.Name + ' deals ' + dmg + ' damage, killing ' + defender.Name );
       
       defender.Death(attacker);
     } else {
       console.log(attacker.Name + ' Hits ' + defender.Name + ' for ' + dmg + ' [' + Math.floor(defender.HP/defender.MaxHP() * 100) + '%]');
     }
   }
   
   //Make sure target defends itself if he is without target
   if(defender.Target == null) {
     defender.Target = attacker;
   }
   
 }
 
 
 module.exports = Combat;