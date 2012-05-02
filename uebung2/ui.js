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

function vec3toString(vector) {
	return vector[0] + ', ' + vector[1] + ', ' + vector[2];
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
