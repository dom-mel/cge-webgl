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