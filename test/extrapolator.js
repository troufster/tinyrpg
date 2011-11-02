var Extrapolator = require('../lib/math').Extrapolator;
var Vector = require('../lib/vector');
var assert = require('assert');

module.exports = {
    'Extrapolate' : function() {
        var a = new Vector(1,0);
        var b = new Vector(2,0);
        var c = new Vector(3,0);
        
        var ex = new Extrapolator();
        
        ex.addSample(a, 1);
        ex.addSample(b, 2);
        ex.addSample(c, 3);
        
        var v = ex.getValue(4);
        
        assert.ok(v.x == 4);
        
    }
};