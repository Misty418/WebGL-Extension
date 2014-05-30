WebGL.prototype.Matrix = function() {
	var stack = [];
	this.matrix = {
		p : mat4.identity(mat4.create()), // Projection
		m : mat4.identity(mat4.create()), // Modelview
		n : mat4.identity(mat4.create()), // Normal
		translate : function(   x, y, z) { mat4.translate(this.m, this.m,    [x, y, z]); return this; },
		scale     : function(   x, y, z) { mat4.scale    (this.m, this.m,    [x, y, z]); return this; },
		rotate    : function(a, x, y, z) { mat4.rotate   (this.m, this.m, a, [x, y, z]); return this; },
		push : function() { stack.push(mat4.clone(this.m)); return this; },
		pop  : function() { this.m = stack.pop();           return this; }
	};
};
