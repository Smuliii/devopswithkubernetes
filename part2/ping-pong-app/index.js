import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import express from 'express';

const dir = process.env.FILE_PATH;
const file = path.join(dir, 'pingpongs.txt');
const app = express();
const port = 3002;

let pingpongs = 0;

try {
	fs.accessSync(dir, fs.constants.R_OK);
} catch (e) {
	fs.mkdirSync(dir);
}

app.get('/', async (req, res) => {
	pingpongs++;

	await fs.promises.writeFile(file, String(pingpongs), { encoding: 'utf-8' });
	res.send(`pong ${pingpongs}`);
});
app.listen(port, () => console.log(`Server started in port ${port}`));
