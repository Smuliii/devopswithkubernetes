import fs from 'fs/promises';
import express from 'express';

const file = '/app/files/pingpongs.txt';
const app = express();
const port = 3000;

let pingpongs = 0;

app.get('/', async (req, res) => {
	pingpongs++;

	await fs.writeFile(file, String(pingpongs), { encoding: 'utf-8' });
	res.send(`pong ${pingpongs}`);
});
app.listen(port, () => console.log(`Server started in port ${port}`));
