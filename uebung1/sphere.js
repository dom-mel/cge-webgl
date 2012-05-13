
var sphere = function (gl, detail) {
    this.detail = detail;
    this.gl = gl;
    this.vertices = [];
    this.colors = [];
};

sphere.prototype.calculateVertices = function(detail, A, B, C) {
    var AB = this.calculateNormalisedMiddle(A, B);
    var BC = this.calculateNormalisedMiddle(B, C);
    var CA = this.calculateNormalisedMiddle(C, A);

    if (detail == 0) {
        this.addTriangle(A, AB, CA);
        this.addTriangle(AB, B, BC);
        this.addTriangle(BC, C, CA);
        this.addTriangle(AB, BC, CA);
        return;
    }
    this.calculateVertices(detail -1, A, AB, CA);
    this.calculateVertices(detail -1, AB, B, BC);
    this.calculateVertices(detail -1, BC, C, CA);
    this.calculateVertices(detail -1, AB, BC, CA);
};

sphere.prototype.calculateNormalisedMiddle = function(A, B) {
    var C = vec3.create([0,0,0]);
    vec3.add(A, B, C);
    vec3.normalize(C);
    return C;
};

sphere.prototype.addTriangle = function(A, B, C) {
    this.addPushVector(A);
    this.addPushVector(B);
    this.addPushVector(C);
};

sphere.prototype.addColor = function(A, B, C) {
    this.colors.push(
        (A + 1) / 2,
        (B + 1) / 2,
        (C + 1) / 2,
        1
    );
};

sphere.prototype.addPushVector = function(A) {
    this.vertices.push(A[0], A[1], A[2]);
    this.addColor(A[0], A[1], A[2]);
};

sphere.prototype.generateBuffers = function () {
    var cubeVertexPositionBuffer;
    var cubeVertexColorBuffer;
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);

    var a = [0,0,1];
    var b = [0.943,0,-0.333];
    var c = [-0.471,0.816,-0.333];
    var d = [-0.471,-0.816,-0.333];

    // Front face
    this.calculateVertices(this.detail,
        new glMatrixArrayType(a),
        new glMatrixArrayType(b),
        new glMatrixArrayType(c));

    // Right face
    this.calculateVertices(this.detail,
        new glMatrixArrayType(a),
        new glMatrixArrayType(c),
        new glMatrixArrayType(d));


    // Back face
    this.calculateVertices(this.detail,
        new glMatrixArrayType(a),
        new glMatrixArrayType(d),
        new glMatrixArrayType(b));

    // Left face
    this.calculateVertices(this.detail,
        new glMatrixArrayType(b),
        new glMatrixArrayType(c),
        new glMatrixArrayType(d));

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    var length = this.vertices.length / cubeVertexPositionBuffer.itemSize;
    cubeVertexPositionBuffer.numItems = length;
    cubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
    cubeVertexColorBuffer.itemSize = 4;
    cubeVertexColorBuffer.numItems = length;

    this.cubeVertexPositionBuffer = cubeVertexPositionBuffer;
    this.cubeVertexColorBuffer = cubeVertexColorBuffer;
    this.cubeVertexPositionBuffer = cubeVertexPositionBuffer;
    this.cubeVertexColorBuffer = cubeVertexColorBuffer;
};

sphere.prototype.draw = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.cubeVertexPositionBuffer.numItems);
};
