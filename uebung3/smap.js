
function loadShaders() {
    return tdl.programs.loadProgramFromScriptTags(
            'sphereVertexShader', 'sphereFragmentShader');
}

function initializeGraphics() {

    var canvas = $('#canvas')[0];
    var gl = tdl.webgl.setupWebGL(canvas);
    var shaders = loadShaders();
    var texture = {
        texture : tdl.textures.loadTexture('cga-labor-sphere-small.png')
    };
    var sphere = new tdl.models.Model(shaders, tdl.primitives
            .createSphere(1, 64, 64), texture);

    var renderParams = {
        view : mat4.create(),
        model : mat4.create(),
        projection : mat4.create(),
        position : vec3.create([0, 0, 0]),
        camPos : vec3.create()
    };

    var eyeRadius = 4;

    var cam = {
        position : vec3.create([0, 0, eyeRadius]),
        target : vec3.create(),
        up : vec3.create([ 0, 1, 0 ])
    };

    function render() {

        tdl.webgl.requestAnimationFrame(render, canvas);

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

