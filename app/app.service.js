

module.exports = {
	getKey 
}

async function getKey(key) {
	const keyResult = process.env[key];
	if(!keyResult || keyResult === null || keyResult === undefined) {
		throw 'Invalid Request';
	}
	if(keyResult) {
		console.log(key, keyResult)
		return {
			name: key, value: keyResult
		}
	}
}