
function loadShaders() {
    return tdl.programs.loadProgramFromScriptTags(
            'sphereVertexShader', 'sphereFragmentShader');
}

var Program = function() {

    this.canvas = $('#canvas')[0];
    this.gl = tdl.webgl.setupWebGL(this.canvas);
    this.sceneObjects = [];

    var shaders = loadShaders();

    this.sceneObjects.push(new Model(
        new tdl.models.Model(shaders, tdl.primitives.createSphere(0.5, 64, 64)),
        vec3.create([1, 1, 0]),
        vec3.create([1, 0, 0])
    ));

    this.sceneObjects.push(new Model(
        new tdl.models.Model(shaders, tdl.primitives.createSphere(0.5, 64, 64)),
        vec3.create([0, 0, 0]),
        vec3.create([1, 0, 0])
    ));

    this.sceneObjects.push(new Model(
        new tdl.models.Model(shaders, tdl.primitives.createSphere(0.5, 64, 64)),
        vec3.create([-1, -1, 0]),
        vec3.create([1, 0, 0])
    ));

    this.sceneObjects.push(new Model(
        new tdl.models.Model(shaders, tdl.primitives.createPlane(10, 10, 1, 1)),
        vec3.create([0, 0, 0]),
        vec3.create([0, 0, 1])
    ));

    this.cam = new Camera({
        position: vec3.create([0, 5, 4]),
        target: vec3.create(),
        up: vec3.create([ 0, 1, 0 ]),
        fov: 60,
        ratio: this.canvas.clientWidth / this.canvas.clientHeight,
        near: 0.1,
        far: 20
    });
};

Program.prototype.render = function() {
    this.prepareGL();

    var projection = this.cam.computePerspective();
    var view = this.cam.computeLookAtMatrix();

    for (var i = 0; i < this.sceneObjects.length; i++) {
        this.sceneObjects[i].draw(view, projection);
    }
};

Program.prototype.prepareGL = function() {
    var that = this;
    tdl.webgl.requestAnimationFrame(function(){
        that.render();
    }, this.canvas);

    this.gl.colorMask(true, true, true, true);
    this.gl.depthMask(true);
    this.gl.clearColor(0.5, 0.5, 0.5, 1);
    this.gl.clearDepth(1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
};

$(document).ready(function(){
    var p = new Program();
    p.render();
});