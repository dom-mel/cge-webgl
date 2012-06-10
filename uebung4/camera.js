
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
    var reflectionMatrix = mat4.create([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, -1, 2 * planePosition[1],
        0, 0, 0, 1
    ]);
    var matrix = mat4.create();
    mat4.multiply(this.computeLookAtMatrix(), reflectionMatrix, matrix);
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