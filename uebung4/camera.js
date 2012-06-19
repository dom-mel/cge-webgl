
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
    // TODO planeTranslationMatrix  * reflectionMatrix * planeTranslationMatrix ^ -1
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

Camera.prototype.computeRefractedLookAtMatrix = function() {

    var matIndex1 = 1; // Vacuum
    var matIndex2 = 1.333; // Water

    // TODO dynamic refraction: M * refract * M^-1
    var refractedPosition = refract(this.position, matIndex1, matIndex2);
    var refractedTarget = refract(this.target, matIndex1, matIndex2);
    var refractedUp = refract(this.up, matIndex1, matIndex2);


    this.refractedPosition = refractedPosition;
    var matrix = mat4.create();
    mat4.lookAt(refractedPosition, refractedTarget, refractedUp, matrix);
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

function refract(pos, matIndex1, matIndex2) {
    var matRate = matIndex1 / matIndex2;

    var viewDirection = vec3.create();
    vec3.negate(pos, viewDirection);

    var normal = vec3.normalize(vec3.create([0, 1, 0]));

    var cosPhi1 = vec3.dot(normal, pos);
    var cosPhi1Rate = matRate * cosPhi1;

    var cosPhi2 = Math.sqrt(1 - Math.pow(matRate, 2) * (1 - Math.pow(cosPhi1, 2)));

    var second;
    if (cosPhi1 >= 0) {
        second = (cosPhi1Rate - cosPhi2);
    } else {
        second = (cosPhi1Rate + cosPhi2);
    }

    var refract = vec3.create([
        matRate * viewDirection[0] + second * normal[0],
        matRate * viewDirection[1] + second * normal[0],
        matRate * viewDirection[2] + second * normal[0]
    ]);

    vec3.negate(refract);

    return refract;
}