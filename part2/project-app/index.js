import path from 'path';
import fs from 'fs/promises';
import { constants } from 'fs';
import express from 'express';
import got from 'got';

const app = express();
const port = 3000;
const filePath = '/app/files/';

const getDailyImage = async () => {
	const fileName = `${new Date().toISOString().split('T')[0]}.jpg`;

	try {
		await fs.access(filePath + fileName, constants.R_OK);
	} catch (e) {
		const data = await got('https://picsum.photos/1200').buffer();
		await fs.writeFile(filePath + fileName, data);
	}

	return fileName;
};

const createHTML = ({ fileName }) => {
	return `
	<style>
		body { margin: 20px auto; width: 600px; }
		img { margin: 0 0 20px; width: 100%; }
	</style>
	<img src="${fileName}">
	<form>
		<input type="text" maxlength="140">
		<button type="submit">Create TODO</button>
	</form>
	<ul>
		<li>Todo #1</li>
		<li>Todo foobar</li>
	</ul>
	`;
};

app.use(express.static(filePath));
app.get('/', async (req, res) => {
	const dailyImage = await getDailyImage();
	const html = createHTML({ dailyImage });
	res.send(html);
});
app.listen(port, () => console.log(`Server started in port ${port}`));
