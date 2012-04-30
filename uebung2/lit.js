// Loads all shader programs from the DOM and return them in an array.
function createProgramsFromTags() {
	var programs = [];
	try {
		while(true) {
			programs[programs.length] = tdl.programs.loadProgramFromScriptTags(
				'sphereVertexShader' + programs.length,
				'sphereFragmentShader' + programs.length);
		}
	} catch (e) {
	}
	return programs;
}

// Registers an onload handler.
window.onload = initialize;

// The main entry point.
function initialize() {
	// Setup the canvas widget for WebGL.
	var canvas = document.getElementById("canvas");
	var gl = tdl.webgl.setupWebGL(canvas);

	// Create the shader programs.
	var programs = createProgramsFromTags();
	var frag = window.location.hash.substring(1);
	var pnum = frag ? parseInt(frag) : 0;

	var torus = new tdl.models.Model(programs[4], tdl.primitives
			.createTorus(0.28, 0.16, 32, 32));

	// Register a keypress-handler for shader program switching using the number
	// keys.
	window.onkeypress = function(event) {
		var n = String.fromCharCode(event.which);
		if (n == "s")
			animate = !animate;
		else
			torus.setProgram(programs[n % programs.length]);
	};

	// Create some matrices and vectors now to save time later.
	var projection = mat4.create();
	var view = mat4.create();
	var model = mat4.create();
	

	// Uniforms for lighting.
	var lightPosition = vec3.create([ 10, 10, 10 ]);
	var lightIntensity = vec3.create([ 1, 1, 1 ]);
	var color = vec3.create();

	// Camera
	var eyePosition = vec3.create();
	var target = vec3.create();
	var up = vec3.create([ 0, 1, 0 ]);

	// Animation parameters for the rotating eye-point.
	var eyeSpeed = 0.2;
	var eyeHeight = 2;
	var eyeRadius = 3.5;
	var animate = true;

	// Animation needs accurate timing information.
	var elapsedTime = 0.0;
	var then = 0.0;
	var clock = 0.0;

	// Uniform variables that are the same for all sphere in one frame.
	var torusConst = {
		view : view,
		projection : projection,
		eyePosition : eyePosition,
		lightPosition : lightPosition,
		lightIntensity : lightIntensity,
		time : clock
	};

	// Uniform variables that change for each sphere in a frame.
	var torusPer = {
		model : model,
		color : color
	};

	// Renders one frame and registers itself for the next frame.
	function render() {
		tdl.webgl.requestAnimationFrame(render, canvas);

		// Do the time keeping.
		var now = (new Date()).getTime() * 0.001;
		elapsedTime = (then == 0.0 ? 0.0 : now - then);
		then = now;
		if (animate) {
			clock += elapsedTime;
		}

		// Calculate the current eye position.
		eyePosition[0] = Math.sin(clock * eyeSpeed) * eyeRadius;
		eyePosition[1] = eyeHeight;
		eyePosition[2] = Math.cos(clock * eyeSpeed) * eyeRadius;

		// Setup global WebGL rendering behavior.
		gl.colorMask(true, true, true, true);
		gl.depthMask(true);
		gl.clearColor(0.5, 0.5, 0.5, 1);
		gl.clearDepth(1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT
				| gl.STENCIL_BUFFER_BIT);

		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		// Calculate the perspective projection matrix.
		mat4.perspective(60, canvas.clientWidth / canvas.clientHeight, 0.1, 10,
				projection);

		// Calculate the viewing transfomation.
		mat4.lookAt(eyePosition, target, up, view);

		// Prepare rendering of spheres.
		torusConst.time = clock;
		torus.drawPrep(torusConst);

		var across = 3;
		var half = (across - 1) * 0.5;
		for ( var xx = 0; xx < across; ++xx) {
			for ( var yy = 0; yy < across; ++yy) {
				for ( var zz = 0; zz < across; ++zz) {
					mat4.identity(torusPer.model);
					var rightAngleRad = degToRad(90.0);
					mat4.rotateX(torusPer.model, rightAngleRad);
					mat4.rotateY(torusPer.model, rightAngleRad);
					mat4.translate(torusPer.model, [ xx - half,
							yy - half, zz - half ]);
					torusPer.color[0] = xx / (across - 1);
					torusPer.color[1] = yy / (across - 1);
					torusPer.color[2] = zz / (across - 1);

					torus.draw(torusPer);
				}
			}
		}
	}

	render();
}
