'use strict';

function difficultyToString(difficulty) {
	if (difficulty > 0) {
		return "erschwert um " + difficulty;
	} else if (difficulty < 0) {
		return "erleichtert um " + (-difficulty);
	} else {
		return "nicht modifiziert";
	}
}
