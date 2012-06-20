

var Program = function() {

    this.canvas = $('#canvas')[0];
    this.gl = tdl.webgl.setupWebGL(this.canvas);

    var shaders = this.loadShaders();
    this.createBuffers();
    var textures = this.loadTextures();

    this.createSceneObjects(shaders, textures);

    this.cam = new Camera({
        position: vec3.create([3, 2, 4]),
        target: vec3.create([0, 1, 0]),
        up: vec3.create([ 0, 1, 0 ]),
        fov: 60,
        ratio: this.canvas.clientWidth / this.canvas.clientHeight,
        near: 0.1,
        far: 20
    });
    this.cam.initControls();
    
    var cam = this.cam;
    this.canvas.addEventListener('mousedown', function(event) {
        cam.startFreeLook(event);
    });
    this.canvas.addEventListener('mousemove', function(event) {
        cam.freeLook(event);
    });
    this.canvas.addEventListener('mouseup', function(event) {
        cam.stopFreeLook(event);
    });
    this.canvas.addEventListener('mouseout', function(event) {
        cam.stopFreeLook(event);
    });

    this.elapsedTime = 0.0;
    this.then = 0.0;
    this.clock = 0.0;
    
    this.lightDirection = vec3.create([0, 1, 0]);
};

Program.prototype.createSceneObjects = function(shaders, textures) {
    
    this.sceneObjects = [];
    
    this.sceneObjects.push(new Model(
        new tdl.models.Model(shaders.color, tdl.primitives.createSphere(0.5, 64, 64), textures),
        vec3.create([1, 1, 0]),
        vec3.create([1, 0, 0])
    ));

    this.sceneObjects.push(new Model(
        new tdl.models.Model(shaders.color, tdl.primitives.createSphere(0.5, 64, 64), textures),
        vec3.create([0, -0.15, 0]),
        vec3.create([0, 1, 0])
    ));

    this.sceneObjects.push(new Model(
        new tdl.models.Model(shaders.color, tdl.primitives.createSphere(0.5, 64, 64), textures),
        vec3.create([-1, -1, 0]),
        vec3.create([1, 1, 0])
    ));
    
    for(var i=0; i<this.sceneObjects.length; i++) {
        this.sceneObjects[i].direction = vec3.create([0, 1, 0]);
    }
    
    this.waterMesh = new Model(
        new tdl.models.Model(shaders.reflectiveTexture, tdl.primitives.createPlane(10, 10, 1, 1), textures),
        vec3.create([0, 0, 0]),
        vec3.create([0, 0, .5])
    );
    
    var skyBoxPrimitives = tdl.primitives.createCube(20);
    tdl.primitives.reorientPositions(skyBoxPrimitives.position, mat4.scale(mat4.identity([]), [-1, -1, -1]));
    this.skybox = new Model(
        new tdl.models.Model(shaders.skyBox, skyBoxPrimitives, textures),
        vec3.create([0, 0, 0]),
        vec3.create([0, 0, 0])
    );
};

Program.prototype.render = function() {
    
    this.prepareGL();

    var now = (new Date()).getTime() * 0.001;
    this.elapsedTime = (this.then == 0.0 ? 0.0 : now - this.then);
    this.then = now;
    this.clock += this.elapsedTime;

    this.cam.move(this.elapsedTime);
    
    this.animateBalls(this.elapsedTime);

    this.renderReflection();
    this.renderRefraction();
    this.renderBackBuffer();
};

Program.prototype.animateBalls = function(delta) {
    for(var i=0; i<this.sceneObjects.length; i++) {
        if(this.sceneObjects[i].position[1] > 1.0) {
            this.sceneObjects[i].direction = vec3.create([0, -1, 0]);
        }
        if(this.sceneObjects[i].position[1] < -1.0) {
            this.sceneObjects[i].direction = vec3.create([0, 1, 0]);
        }
        var distance = vec3.create([this.sceneObjects[i].direction[0],
                                     this.sceneObjects[i].direction[1],
                                     this.sceneObjects[i].direction[2]]);
        vec3.scale(distance, 0.5 * delta);
        
        vec3.add(
                this.sceneObjects[i].position,
                distance
        );
    }
};

Program.prototype.renderReflection = function() {
    
    this.reflectionFrameBuffer.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);
    
    this.cam.far = 20;
    var projection = this.cam.computePerspective();
    
    var view = this.cam.computeReflectedLookAtMatrix(this.waterMesh.position);

    this.skybox.position = this.cam.reflectedPosition;
    this.skybox.draw({view: view, projection: projection});
    for (var i = 0; i < this.sceneObjects.length; i++) {
        this.sceneObjects[i].draw({
            view: view,
            projection: projection,
            lightDirection: this.lightDirection,
            eyePosition: this.cam.reflectedPosition,
            lightIntensity: vec3.create([1, 1, 1]),
            clipY: -1
        });
    }
};

Program.prototype.renderRefraction = function() {
    this.refractionFrameBuffer.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

    this.cam.far = 20;
    var projection = this.cam.computePerspective();
    var view = this.cam.computeRefractedLookAtMatrix();

    this.skybox.position = this.cam.refractedPosition;
    this.skybox.draw({view: view, projection: projection});
    for (var i = 0; i < this.sceneObjects.length; i++) {
        this.sceneObjects[i].draw({
            view: view,
            projection: projection,
            lightDirection: this.lightDirection,
            eyePosition: this.cam.refractedPosition,
            lightIntensity: vec3.create([1, 1, 1]),
            clipY: 1
        });
    }
};

Program.prototype.renderBackBuffer = function() {
    
    this.backbuffer.bind();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT | this.gl.STENCIL_BUFFER_BIT);

    this.cam.far = 20;
    var projection = this.cam.computePerspective();
    var view = this.cam.computeLookAtMatrix();

    this.skybox.position = this.cam.position;
    this.skybox.draw({view: view, projection: projection});
    for (i = 0; i < this.sceneObjects.length; i++) {
        this.sceneObjects[i].draw({
            view: view,
            projection: projection,
            lightDirection: this.lightDirection,
            eyePosition: this.cam.position,
            lightIntensity: vec3.create([1, 1, 1]),
            clipY: 0
        });
    }
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.enable(this.gl.BLEND);
    this.waterMesh.draw({view: view, projection: projection});
    this.gl.disable(this.gl.BLEND);
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

    this.gl.enable(this.gl.CULL_FACE);
    this.gl.enable(this.gl.DEPTH_TEST);
};

Program.prototype.loadShaders = function() {
    var shaders = {};
    shaders.color = tdl.programs.loadProgramFromScriptTags('colorVs', 'colorFs');
    shaders.reflectiveTexture = tdl.programs.loadProgramFromScriptTags('reflectiveTextureVs', 'reflectiveTextureFs');
    shaders.skyBox = tdl.programs.loadProgramFromScriptTags('skyBoxVs', 'skyBoxFs');
    return shaders;
};

Program.prototype.loadTextures = function() {
    var skyBox = tdl.textures.loadTexture([
        'images/skybox_right.jpg',
        'images/skybox_left.jpg',
        'images/skybox_top.jpg',
        'images/skybox_bottom.jpg',
        'images/skybox_front.jpg',
        'images/skybox_back.jpg'
    ]);
    return {
        skybox: skyBox,
        reflectionFrameBuffer: this.reflectionFrameBuffer.texture,
        refractionFrameBuffer: this.refractionFrameBuffer.texture
    };
};

Program.prototype.createBuffers = function() {
    this.reflectionFrameBuffer = tdl.framebuffers.createFramebuffer(this.canvas.width, this.canvas.height, false);
    this.refractionFrameBuffer = tdl.framebuffers.createFramebuffer(this.canvas.width, this.canvas.height, false);
    this.backbuffer = new tdl.framebuffers.BackBuffer(this.canvas);
};


$(document).ready(function(){
    var p = new Program();
    p.render();
});