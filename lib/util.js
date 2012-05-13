function matrixToString(matrix) {
    var result = "";
    for(y=0; y<4; y++) {
        result += "[";
        for(x=0; x<4; x++) {
            var index = y * 4 + x;
            result += "" + matrix[index];
            if((index+1)%4 != 0) {
                result += ", ";
            }
        }
        result += "]\n";
    }

    return result;
}

function vec3toString(vector) {
    return vector[0] + '; ' + vector[1] + '; ' + vector[2];
}

function vec3fromString(str) {
    if(!str.match(/-?[0-9]+((\.)[0-9]+)?\s?;\s?-?[0-9]+((\.)[0-9]+)?\s?;\s?-?[0-9]+((\.)[0-9]+)?\s?/)) {
        throw "Ungültige Eingabe für Vektor";
    }
    var arr = str.split(';');
    var x = arr[0].trim();
    var y = arr[1].trim();
    var z = arr[2].trim();
    return vec3.create([x, y, z]);
}
