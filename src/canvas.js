WebGL.prototype.Canvas = function(gl) {
	var canvas = gl.canvas;
	this.canvas = {
		gl:     function() { return gl; },
		canvas: function() { return canvas; },
		width:  function() { return canvas.width;  },
		height: function() { return canvas.height; },
		resize: function() {
			gl.viewport(0, 0,
				canvas.width  = canvas.clientWidth,
				canvas.height = canvas.clientHeight
			);
		}
	};
	this.canvas.resize();
};
