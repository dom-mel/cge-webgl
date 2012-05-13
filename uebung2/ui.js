var lights = new Object();
lights['light1'] = light1;
lights['light2'] = light2;

$(document).ready(uiInit);

function uiInit() {
    updateLightControls(1, light1);
    updateLightControls(2, light2);
}

function updateLightControls(number, light) {
    $('#light'+number).attr('checked', !vec3equals([0.0, 0.0, 0.0], light.intensity));
    $('#color'+number).attr('value', vec3toString(light.intensity));
    $('#position'+number).attr('value', vec3toString(light.position));
}

function vec3equals(a, b) {
    if(a[0] == b[0] && a[1] == b[1] && a[2] == b[2]) {
        return true;
    }
    return false;
}

function updateTorusConst() {
    torusConst.light1Position = light1.position;
    torusConst.light1Intensity = light1.intensity;
    torusConst.light1spec = light1.specular;
    torusConst.light2Position = light2.position;
    torusConst.light2Intensity = light2.intensity;
    torusConst.light2spec = light2.specular;
}

function toggleLight(number) {
    var status = $('#light'+number).attr('checked') == undefined ? false : true;
    lights['light'+number].enable(status);
    updateTorusConst();
    updateLightControls(number, lights['light'+number]);
}

function setLightColor(number) {
    var text = $('#color'+number).attr('value');
    var color;
    try {
        color = vec3fromString(text);
    } catch(error) {
        // invalid input can be ignored
        return;
    }
    lights['light'+number].intensity = color;
    updateTorusConst();
}

function setLightPosition(number) {
    var text = $('#position'+number).attr('value');
    var position;
    try {
        position = vec3fromString(text);
    }catch(error) {
        // invalid input can be ignored
        return;
    }
    lights['light'+number].position = position;
    updateTorusConst();
}
