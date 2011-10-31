var b = {
   extend : function(child, parent){
     child.prototype.__proto__ = parent.prototype;
     child.prototype.__super = parent;
   },
   plugin : function() {}
};

module.exports = b; 