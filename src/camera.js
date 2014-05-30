WebGL.prototype.Camera = function(gl, elemCanvas, matrix) {
	this.camera = {
		lookAt: function(eyX,eyY,eyZ,  ctX,ctY,ctZ,  upX,upY,upZ) {
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
			mat4.identity(matrix.m);
			mat4.perspective(matrix.p,
				this.fovy,
				elemCanvas.width / elemCanvas.height,
				this.near, this.far
			);
			mat4.lookAt(matrix.p,
				[eyX, eyY, eyZ],
				[ctX, ctY, ctZ],
				[upX, upY, upZ]
			);
			return this;
		}
	};
};
