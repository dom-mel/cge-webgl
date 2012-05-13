function DirectionalLight(position, intensity) {

    this.position = position;
    this.intensity = intensity;
    this.specular = vec3.create([1.0, 1.0, 1.0]);

    this.enable = function(enabled) {
        if(enabled) {
            this.intensity = this.oldIntensity;
            this.specular = vec3.create([1.0, 1.0, 1.0]);
        } else {
            this.oldIntensity = this.intensity;
            this.intensity = vec3.create([0.0, 0.0, 0.0]);
            this.specular = vec3.create([0.0, 0.0, 0.0]);
        }
    };
}

