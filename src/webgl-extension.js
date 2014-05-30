function WebGL(canvas) {
    var gl =
		canvas.getContext('webgl') ||
		canvas.getContext('experimental-webgl');

	// Building objects needed
	this.Matrix   ( );
	this.Canvas   ( gl );
	this.Shaders  ( gl );
	this.Camera   ( gl, this.matrix );
	this.Textures ( gl, this.shaders.program() );
	this.Objects  ( gl, this.matrix, this.textures, this.shaders );
	this.Lights   ( gl, this.shaders );

	// Initialisation
	// * GL
	gl.clearColor(0.07, 0.07, 0.07, 1);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	// * Camera
	this.camera.fovy = Math.PI / 3;
	this.camera.near = 1;
	this.camera.far = 1000;
};
