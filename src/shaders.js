WebGL.prototype.Shaders = function(gl) {
	var DIRLIGHTS_MAX = 5;
	this.shaders = {
		program: function() { return this.prog; },
		DIRLIGHTS_MAX: DIRLIGHTS_MAX,
		xVertex:
			'attribute vec4 aVertexPosition;'+
			'attribute vec3 aVertexNormal;'+
			'attribute vec4 aVertexColor;'+
			'attribute vec2 aTextureCoord;'+
			'uniform int lightsActive;'+
			'uniform mat4 uNMatrix;'+
			'uniform mat4 uMVMatrix;'+
			'uniform mat4 uPMatrix;'+
			'struct Light {'+
				'int  act;'+
				'vec3 pos;'+
				'vec3 col;'+
			'};'+
			'uniform Light dir['+DIRLIGHTS_MAX+'];'+
			'uniform vec3 ambCol;'+
			'varying vec4 vColor;'+
			'varying vec4 vFinalLight;'+
			'varying highp vec2 vTextureCoord;'+
			'void main(void) {'+
				'vFinalLight.xyz = ambCol;'+
				'vColor = aVertexColor;'+
				'if (lightsActive == 1) {'+
					'vec3 N = normalize(vec3(uNMatrix * vec4(aVertexNormal, 1.0)));'+
					'for (int i = 0; i < '+DIRLIGHTS_MAX+'; ++i)'+
						'if (dir[i].act == 1) {'+
							'vec3 L = normalize(dir[i].pos);'+
							'float lambertCoef = max(dot(N, -L), 0.0);'+
							'vFinalLight.xyz += dir[i].col * lambertCoef;'+
						'}'+
				'}'+
				'vFinalLight.a = 1.0;'+
				'vTextureCoord = aTextureCoord;'+
				'gl_Position = uPMatrix * uMVMatrix * aVertexPosition;'+
			'}',
		xFragment:
			'precision mediump float;'+
			'uniform int textureActive;'+
			'uniform sampler2D uSampler;'+
			'varying highp vec2 vTextureCoord;'+
			'varying vec4 vColor;'+
			'varying vec4 vFinalLight;'+
			'void main(void) {'+
				'gl_FragColor = vFinalLight * vColor;'+
				'if (textureActive == 1)'+
					'gl_FragColor *= texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));'+
			'}',
		load: function() {
			var attribs = ['aVertexPosition', 'aVertexNormal', 'aVertexColor', 'aTextureCoord'],
			    vShad = this.loadShader(gl.VERTEX_SHADER, this.xVertex),
			    fShad = this.loadShader(gl.FRAGMENT_SHADER, this.xFragment);
			this.prog = gl.createProgram();
			gl.attachShader(this.prog, vShad);
			gl.attachShader(this.prog, fShad);
			for (var i = 0, a; a = attribs[i]; ++i) {
				gl.bindAttribLocation(this.prog, i, a);
				gl.enableVertexAttribArray(i);
			}
			gl.linkProgram(this.prog);
			if (gl.getProgramParameter(this.prog, gl.LINK_STATUS)) {
				gl.useProgram(this.prog);
				this.uNMatrix  = gl.getUniformLocation(this.prog, 'uNMatrix');
				this.uPMatrix  = gl.getUniformLocation(this.prog, 'uPMatrix');
				this.uMVMatrix = gl.getUniformLocation(this.prog, 'uMVMatrix');
			} else {
				console.log('Shaders: Unable to initialize the shader program.');
				console.log(gl.getProgramInfoLog(this.prog));
				gl.deleteProgram(vShad);
				gl.deleteProgram(fShad);
				gl.deleteProgram(this.prog);
			}
		},
		loadShader: function(type, source) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				console.log('Shaders: compiling error: ' + gl.getShaderInfoLog(shader));
				shader = null;
			}
			return shader;
		}
	};
	this.shaders.load();
};
