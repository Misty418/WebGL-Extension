window.onload = function() {

function lg(s) { console.log(s); } // debug

// ### Variables ###
var
	// * Init
	canvas = document.getElementsByTagName('canvas')[0],
	webgl = new WebGL(canvas),
	btnLeft = false,
	// * Camera
	cam_rad = 10,
	cam_radIncr = 1.1,
	cam_long = Math.PI * 1.2,
	cam_lat  = Math.PI * 0.4,
	cam_lat2 = cam_lat,
	cam_eX = 0, cam_eY = 0, cam_eZ = 0,
	cam_cX = 0, cam_cY = 0, cam_cZ = 0,
	cam_uX = 0, cam_uY = 0, cam_uZ = 1;

// ### Lights ###
webgl.lights.enable()
	.ambient(0.06, 0.06, 0.06)
	.dir('sunA')
		.pos(-0.6, -0.1, 1.0)
		.col(0, 0, 0.3);
webgl.lights
	.dir('sunB')
		.pos(0.6, 0.1, 1.5)
		.col(1, 0.5, 0);

// ### Objects ###
var cube_a = webgl.objects.create(primitives.create({
	type: 'box',
	sizeX: 1, sizeY: 1, sizeZ: 1.8,
	r: 100, g:  60, b: 255
}));
var cube_b = webgl.objects.create(primitives.create({
	type: 'box',
	sizeX: 2.8, sizeY: 2, sizeZ: 1.2,
	r: 200, g:  35, b:  35
}));
var sphere_a = webgl.objects.create(primitives.create({
	type: 'sphere', radius: 0.6,
	latitudes:10, longitudes:10, 
	r: 200, g: 255, b: 255
})).type('lines');
var sphere_b = webgl.objects.create(primitives.create({
	type: 'sphere', radius: 0.4,
	latitudes:10, longitudes:10, 
	r: 200, g: 255, b: 255
}));

document.onkeydown = function(e) {
	switch (e.keyCode) {
		case 76: webgl.lights.toggle(); break; // L
		case 65: webgl.lights.dir('sunA').toggle(); break; // A
		case 66: webgl.lights.dir('sunB').toggle(); break; // B
		//case 71: grid.toggle(); break; // G
	}
};

function spherique_to_cartesian() {
	var sinTheta = Math.sin(cam_lat);
	cam_eX = cam_rad * Math.cos(cam_long) * sinTheta;
	cam_eY = cam_rad * Math.sin(cam_long) * sinTheta;
	cam_eZ = cam_rad * Math.cos(cam_lat);
}

canvas.onwheel = function(e) {
	e.preventDefault();
	cam_rad *= e.deltaY > 0 ? cam_radIncr : 1 / cam_radIncr;
	spherique_to_cartesian();
};
canvas.onmousedown = function(e) {
	if (e.button === 0)
		btnLeft = true;
};
canvas.onmouseup = function(e) {
	if (e.button === 0)
		btnLeft = false;
};
canvas.onmousemove = function(e) {
	if (btnLeft) {
		var mX, mY;
		if (e.webkitMovementX !== undefined) {
			mX = e.webkitMovementX;
			mY = e.webkitMovementY;
		} else {
			mX = e.mozMovementX;
			mY = e.mozMovementY;
		}
		cam_long -= mX / 120;
		cam_lat  -= mY / 120;
		cam_lat %= 2 * Math.PI;
		if (cam_lat > 0        !== cam_lat2 > 0
		||  cam_lat < +Math.PI !== cam_lat2 < +Math.PI
		||  cam_lat < -Math.PI !== cam_lat2 < -Math.PI)
		{
			cam_uX = -cam_uX;
			cam_uY = -cam_uY;
			cam_uZ = -cam_uZ;
		}
		cam_lat2 = cam_lat;
		spherique_to_cartesian();
	}
};
spherique_to_cartesian();

function render() {
	webgl.camera.lookAt(
		cam_eX, cam_eY, cam_eZ,
		cam_cX, cam_cY, cam_cZ,
		cam_uX, cam_uY, cam_uZ
	);
	var mat = webgl.matrix;
	mat.push().translate(1,-2, 0.9).rotate(Math.PI/5, 0, 0, 1);
		cube_a.draw();
	mat.pop().push().translate(0, 0, 0.6);
		cube_b.draw();
	mat.pop().push().translate(-1.5, -1.7, 0.6);
		sphere_a.draw();
	mat.pop().push().translate(0.4, -0.7, 1.2 + 0.4);
		sphere_b.draw();
	mat.pop();
}

setInterval(render, 1000 / 40);

}; // window.onload
