
var Camera = function(settings) {
    this.position = settings.position;
    this.target = settings.target;
    this.up = settings.up;
    this.fov = settings.fov;
    this.ratio = settings.ratio;
    this.near = settings.near;
    this.far = settings.far;
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
