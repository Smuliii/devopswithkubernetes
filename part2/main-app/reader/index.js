import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import express from 'express';
import got from 'got';

const dir = process.env.FILE_PATH;
const hashFile = path.join(dir, 'hash.txt');
const message = process.env.MESSAGE;
const app = express();
const port = 3001;

try {
	fs.accessSync(dir, fs.constants.R_OK);
} catch (e) {
	fs.mkdirSync(dir);
}

const readHash = async () => {
	try {
		const hash = await fs.promises.readFile(hashFile, 'utf-8');
		const pingpongs = await got(process.env.PINGPONG_URL).text();
		return message + '<br>' + hash + '<br>' + 'Ping / Pongs: ' + pingpongs;
	} catch (e) {
		console.log(e);
		return 'file(s) not found';
	}
};

app.get('/', async (req, res) => res.send(await readHash()));
app.listen(port, () => console.log(`Server started in port ${port}`));
