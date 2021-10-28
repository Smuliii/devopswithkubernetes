import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import express from 'express';
import got from 'got';

const app = express();
const port = 3003;
const dir = process.env.FILE_PATH;
const backendUrl = process.env.BACKEND_URL;
const formUrl = process.env.FORM_URL;

try {
	fs.accessSync(dir, fs.constants.R_OK);
} catch (e) {
	fs.mkdirSync(dir);
}

const getDailyImage = async () => {
	const fileName = `${new Date().toISOString().split('T')[0]}.jpg`;
	const file = path.join(dir, fileName);

	try {
		await fs.promises.access(file, fs.constants.R_OK);
	} catch (e) {
		const data = await got('https://picsum.photos/1200').buffer();
		await fs.promises.writeFile(file, data);
	}

	return fileName;
};

const getTodosHTML = async () => {
	try {
		const todos = await got(backendUrl).json();
		const html = `<ul>${todos.map((todo) => `<li>${todo.text}</li>`).join('')}</ul>`;
		return html;
	} catch (e) {
		return '';
	}
};

const createHTML = ({ dailyImage, todos }) => {
	return `
	<style>
		body { margin: 20px auto; width: 600px; }
		img { margin: 0 0 20px; width: 100%; }
	</style>
	<img src="${dailyImage}">
	<form method="post" action="${formUrl}">
		<input type="text" name="text" maxlength="140">
		<button type="submit">Create TODO</button>
	</form>
	${todos}
	`;
};

app.use(express.static(dir));

app.get('/', async (req, res) => {
	const dailyImage = await getDailyImage();
	const todos = await getTodosHTML();
	const html = createHTML({ dailyImage, todos });
	res.send(html);
});

app.listen(port, () => console.log(`Server started in port ${port}`));
