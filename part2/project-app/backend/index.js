import 'dotenv/config';
import express from 'express';

const app = express();
const port = 3004;

const todos = [
	{
		text: 'Todo #1',
	},
	{
		text: 'Todo foobar',
	},
];

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send(todos);
});

app.post('/', (req, res) => {
	const todo = req.body;
	todos.push(todo);
	res.send(todos);
});

app.listen(port, () => console.log(`Server started in port ${port}`));
