import 'dotenv/config';
import express from 'express';
import pg from 'pg';

const app = express();
const port = 3004;

const { Pool } = pg;
const sql = new Pool();

// Init db tables
sql.query(
	`SELECT count(*) AS c FROM information_schema.tables WHERE table_catalog = 'todos-project' AND table_schema = 'public'`,
	(err, res) => {
		console.log('db error', err);

		if (res.rows[0].c === '0') {
			console.log('creating tables');
			sql.query('CREATE TABLE todos ( text VARCHAR(254) NOT NULL )', (err, res) => {
				console.log('tables created');
			});
		}
	}
);

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
	const { rows } = await sql.query('SELECT text FROM todos');
	res.send(rows);
});

app.post('/', async (req, res) => {
	const todo = req.body;

	console.log('todo', JSON.stringify(todo))

	if (typeof todo.text !== 'string' || todo.text.length > 140) {
		res.status(400).send('invalid todo');
	}

	await sql.query('INSERT INTO todos(text) VALUES ($1)', [todo.text]);
	const { rows } = await sql.query('SELECT text FROM todos');

	res.send(rows);
});

app.listen(port, () => console.log(`Server started in port ${port}`));
