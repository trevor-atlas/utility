const {promisify} = require('util');
const {unlink} = require('fs');
const {join} = require('path');
const unlinkAsync = promisify(unlink);

const links = require('./links.json');

(async () => {
	const projectDir = process.env.INIT_CWD || path.resolve("../../", __dirname);
	console.log('projectdir', projectDir)
	for (let link of links) {
		await unlinkAsync(`./${link}`, join(projectDir, link));
	}
})();
