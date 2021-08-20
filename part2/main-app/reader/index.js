import fs from 'fs/promises';
import express from 'express';

const hashFile = '/app/files/hash.txt';
const pingpongFile = '/app/files/pingpongs.txt';
const app = express();
const port = 3000;

const readHash = async () => {
	try {
		const hash = await fs.readFile(hashFile, 'utf-8');
		const pingpongs = await fs.readFile(pingpongFile, 'utf-8');
		return hash + '<br>' + 'Ping / Pongs: ' + pingpongs;
	} catch (e) {
		return 'file(s) not found';
	}
};

app.get('/', async (req, res) => res.send(await readHash()));
app.listen(port, () => console.log(`Server started in port ${port}`));
