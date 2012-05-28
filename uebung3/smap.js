
function loadShaders() {
    return tdl.programs.loadProgramFromScriptTags(
            'sphereVertexShader', 'sphereFragmentShader');
}

function initializeGraphics() {

    var canvas = $('#canvas')[0];
    var gl = tdl.webgl.setupWebGL(canvas);
    var shaders = loadShaders();
    var texture = {
        texture : tdl.textures.loadTexture('cga-labor-sphere.png')
    };
    var sphere = new tdl.models.Model(shaders, tdl.primitives
            .createSphere(1, 64, 64), texture);
            //.createCube(1), texture);
            //.createTorus(0.5, 0.5, 64, 64), texture);

    var renderParams = {
        view : mat4.create(),
        model : mat4.create(),
        projection : mat4.create(),
        position : vec3.create([0, 0, 0]),
        camPos : vec3.create()
    };

    var eyeRadius = 2;

    var cam = {
        position : vec3.create([0, 0, eyeRadius]),
        target : vec3.create(),
        up : vec3.create([ 0, 1, 0 ])
    };

    // Animation needs accurate timing information.
    var elapsedTime = 0.0;
    var then = 0.0;
    var clock = 0.0;

    function render() {

        var now = (new Date()).getTime() * 0.001;
        elapsedTime = (then == 0.0 ? 0.0 : now - then);
        then = now;
        clock += elapsedTime;

        /*/ Calculate the current eye position.
        cam.position[0] = Math.sin(clock * 0.2) * eyeRadius;
        cam.position[1] = 0;
        cam.position[2] = Math.cos(clock * 0.2) * eyeRadius;
        */

        tdl.webgl.requestAnimationFrame(render, canvas);
        renderParams.camPos = cam.position;


        gl.colorMask(true, true, true, true);
        gl.depthMask(true);
        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.clearDepth(1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT
                | gl.STENCIL_BUFFER_BIT);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        mat4.perspective(60, canvas.clientWidth / canvas.clientHeight, 0.1, 10,
                renderParams.projection);

        mat4.lookAt(cam.position, cam.target,
                cam.up, renderParams.view);

        sphere.drawPrep(renderParams);

        mat4.identity(renderParams.model);
        mat4.translate(renderParams.model, renderParams.position);

        sphere.draw(renderParams);
    }
    
    render(gl, renderParams);
}

