export default {
	check,
	lookup,
};

var elements;
var symbols = {};

await loadPeriodicTable();


// ****************************

async function loadPeriodicTable() {
	elements = await (await fetch("periodic-table.json")).json();
	for (let element of elements){
		symbols[element.symbol.toLowerCase()] = element;
	}
}
//TODO: write function that for each letter of the word checks the first letter
// of the symbols and makes a new data set of the matches then parses out any
// two letter symbols that arn't pairwise then return the pruned dataset to check
// instead of using lookup on the initial dataset for each pass on the word
function findCanidates(inputWord){
	let pairwiseCanidates = [];
	let singleCanidates = [];
	for (let i = 0; i < inputWord.length; i++){
		if(inputWord[i] in symbols && !singleCanidates.includes(inputWord[i])){
			singleCanidates.push(inputWord[i]);
		}
		if (i <= (inputWord.length - 2)){
			let two = inputWord.slice(i,i+2);
			if (two in symbols && !pairwiseCanidates.includes(two)){
				pairwiseCanidates.push(two);
			}
		}
	}
	return [...pairwiseCanidates,...singleCanidates];
}

function spellWord(canidates,charsLeft){
	if(charsLeft.length == 0){
		return [];
	}
	else {
		if (charsLeft.length >= 2) {
			let two = charsLeft.slice(0,2);
			let rest = charsLeft.slice(2);
			//found a match?
			if (canidates.includes(two)){
				// more chars to match?
				if (rest.length > 0){
					let res = spellWord(canidates,rest);
					if(res.join("") == rest) {
						return [two, ...res];
					}
				}
				else {
					return [two];
				}
			}
		}
		//now check for one letter symbols
		if(charsLeft.length >= 1){
			let one = charsLeft[0];

			let rest = charsLeft.slice(1);
			if(canidates.includes(one)){
				if(rest.length > 0){
					let res = spellWord(canidates,rest);
					if (res.join("") == rest){
						return [ one, ...res]
					}
				}
				else {
					return [one];
				}
			}
		}
	}
}

function check(inputWord) {
	var canidates = findCanidates(inputWord);
	return spellWord(canidates,inputWord);
}

function lookup(elementSymbol) {
	return symbols[elementSymbol];
}
