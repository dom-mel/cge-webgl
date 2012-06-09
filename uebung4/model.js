
var Model = function(mesh, position, color) {
    this.color = color;
    this.position = position;
    this.mesh = mesh;
};

Model.prototype.computeTransform = function() {
    var matrix = mat4.create();
    mat4.identity(matrix);
    mat4.translate(matrix, this.position);
    return matrix;
};

Model.prototype.draw = function(view, projection) {

    this.mesh.drawPrep({
        view : view,
        projection: projection
    });

    this.mesh.draw({
        model : this.computeTransform(),
        color : this.color
    });

};