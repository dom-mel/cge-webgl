

var sphere = function (gl, detail) {
    this.recrusion = detail;
    this.gl = gl;
}

sphere.prototype.generateBuffers = function() {
    var cubeVertexPositionBuffer;
    var cubeVertexColorBuffer;
    cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
    var vertices = [
        // Front face
        0.0,  1.0,  0.0,
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,

        // Right face
        0.0,  1.0,  0.0,
        1.0, -1.0,  1.0,
        1.0, -1.0, -1.0,

        // Back face
        0.0,  1.0,  0.0,
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,

        // Left face
        0.0,  1.0,  0.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    cubeVertexPositionBuffer.itemSize = 3;
    cubeVertexPositionBuffer.numItems = vertices.length / cubeVertexPositionBuffer.itemSize;

    cubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);

    var colors = [];
    for (var i = 0; i < 12; i++) {
        colors = colors.concat([0.7, 0.7, 0.7, 1.0]);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    cubeVertexColorBuffer.itemSize = 4;
    cubeVertexColorBuffer.numItems = 12;

    this.cubeVertexPositionBuffer = cubeVertexPositionBuffer;
    this.cubeVertexColorBuffer = cubeVertexColorBuffer;
    this.cubeVertexPositionBuffer = cubeVertexPositionBuffer;
    this.cubeVertexColorBuffer = cubeVertexColorBuffer;
}

sphere.prototype.draw = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.cubeVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.cubeVertexPositionBuffer.numItems);
}