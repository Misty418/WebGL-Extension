WebGL.prototype.Textures = function(gl, prog) {
	this.textures = {
		uActive: gl.getUniformLocation(prog, 'textureActive'),
		create: function(img) {
			var tex = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);    // gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
			//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // Prevents s-coordinate wrapping (repeating).
			//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // Prevents t-coordinate wrapping (repeating).
			gl.generateMipmap(gl.TEXTURE_2D);
			this.bind(null);
			return tex;
		},
		bind: function(tex) {
			if (this._currentTex !== tex) {
				this._currentTex = tex;
				gl.activeTexture(gl.TEXTURE0); 
				gl.bindTexture(gl.TEXTURE_2D, tex);
				gl.uniform1i(this.uActive, tex !== null);
				if (tex !== null)
					gl.uniform1i(gl.getUniformLocation(prog, 'uSampler'), 0);
			}
		}
	};
};
