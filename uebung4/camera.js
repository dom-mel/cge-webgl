
var Camera = function(settings) {
    this.position = settings.position;
    this.target = settings.target;
    this.up = settings.up;
    this.fov = settings.fov;
    this.ratio = settings.ratio;
    this.near = settings.near;
    this.far = settings.far;

    this.pressed = {};
    this.speed = 1.0;
};

Camera.prototype.computeLookAtMatrix = function() {
    var matrix = mat4.create();
    mat4.lookAt(this.position, this.target, this.up, matrix);
    return matrix;
};

Camera.prototype.computePerspective = function() {
    var matrix = mat4.create();
    mat4.perspective(this.fov, this.ratio, this.near, this.far, matrix);
    return matrix;
};

Camera.prototype.computeReflectedLookAtMatrix = function(planePosition) {
    
    var normal = vec3.normalize(vec3.create([0, 1, 0]));

    // Matrix to reflect on Y Axis - to move water plane change calculation to
    // planeTranslationMatrix  * reflectionMatrix * planeTranslationMatrix ^ -1
    var reflectionMatrix = mat4.create([
        1,  0, 0, 0,
        0, -1, 0, 0,
        0,  0, 1, 0,
        0,  0, 0, 1
    ]);

    var reflectedPosition = vec3.create();
    var reflectedTarget = vec3.create();
    var reflectedUp = vec3.create();

    mat4.multiplyVec3(reflectionMatrix, this.position, reflectedPosition);
    mat4.multiplyVec3(reflectionMatrix, this.target, reflectedTarget);
    mat4.multiplyVec3(reflectionMatrix, this.up, reflectedUp);

    this.reflectedPosition = reflectedPosition;
    var matrix = mat4.create();
    mat4.lookAt(reflectedPosition, reflectedTarget, reflectedUp, matrix);
    return matrix;
};

Camera.prototype.initControls = function() {
    var that = this;
    window.addEventListener('keydown', function(event) {
        that.pressed[event.keyCode] = true;
    });
    window.addEventListener('keyup', function(event) {
        delete that.pressed[event.keyCode];
    });
};

Camera.prototype.move = function(elapsed) {

    var direction = vec3.create();
    vec3.subtract(this.position, this.target, direction);

    if (87 in this.pressed) {
        vec3.add(
            this.position,
            vec3.scale(direction, -this.speed * elapsed)
        );
    }

    if (83 in this.pressed) {
        vec3.add(
            this.position,
            vec3.scale(direction, this.speed * elapsed)
        );
    }
};

function reflect(a, b) {
    // V - 2.0 * dot(N, V) * N
    var v = vec3.create([a[0], a[1], a[2]]);
    var n = vec3.create([b[0], b[1], b[2]]);
    var temp = 2.0 * vec3.dot(n, v);
    n[0] *= temp;
    n[1] *= temp;
    n[2] *= temp;
    v[0] -= n[0];
    v[1] -= n[1];
    v[2] -= n[2];
    return v;
}