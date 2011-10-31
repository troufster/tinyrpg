var Base = require('../lib/base');
var Combat = require('./combat');
var Messages = require('./messages');

function GameObject(params) {
  
}


function Entity(params) {  
  this.Name = params.Name;
  this.STR = params.STR || 0;
  this.DEX = params.DEX || 0;
  this.MIND = params.MIND || 0;
  this.Level = 1;
  this.children = [];
  this.parent = null;  
  this.HRoll = params.HRoll || 0;
  this.DRoll = params.DRoll || 0;
}

function Character(params) {
  this.__super.call(this, params);
  
  this.Target = null;
  this.Race = params.race;
  this.AI = null;
  
  this.Equipment = {
      'Head' : null,
      'Armor' : null,
      'Weapon' : null,
      'Shield' : null
  }
  
  this.Reset();  
}

Character.prototype.Reset = function() {
  this.HP = this.MaxHP();
  
  this.Update();
}

Character.prototype.Update = function() {  
  this.AC = this.MaxAC();
  this.DRoll = this.StatMod('DRoll');
  this.HRoll = this.StatMod('HRoll');    
}


Character.prototype.MaxAC = function() {  
  return Math.floor(10 + ((this.DEX + this.StatMod('DEX'))  - 10)/4 );      
}

Character.prototype.MaxHP = function() {
  return Math.floor((12 + ((this.STR + this.StatMod('STR')) * 1) + (this.Level * 1)));
}

Character.prototype.StatMod = function(stat) {        
  val = 0;
  var eq = this.Equipment;
  
  //Account for eq mods
  for(var e in eq) {
   if(eq[e]) {
    val += eq[e][stat];
   }
  }   
    
  return val;
}

Character.prototype.Equip = function(item) {
  this.Equipment[item.Type] = item;
  Messages.Character.Equip({ actor : this.Name, item : item.Name});
  
  this.Update();  
}

Character.prototype.SetTarget = function(target) {
  if(!this.Target) {
    this.Target = target;
  }
}

Character.prototype.Attack = function(target) {    
    
    this.SetTarget(target);
    
    this.AI.setState('Attack');
    
    this.Target.Defend(this);
}

Character.prototype.Hit = function() {
  var target = this.Target; 
  
  if(target.HP > 0) {
    Combat(this, target);
  } else {
    this.AI.setState('Idle');
  }
  
}

Character.prototype.Defend = function(target) {
  this.SetTarget(target);
  this.AI.setState('Attack');
}

Character.prototype.Death = function(killer) {
  killer.Target = null;  
  this.AI.setState('Dead');
}


Base.extend(Character, Entity);

function Item(params){
  this.Type = params.Type;
  this.__super.call(this, params);  
}

Base.extend(Item, Entity);


exports.Entity = Entity;
exports.Character = Character;
exports.Item = Item;