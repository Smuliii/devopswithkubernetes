import 'dotenv/config';
import express from 'express';
import pg from 'pg';

const app = express();
const port = 3004;

const { Pool } = pg;
const sql = new Pool();

// Init db tables
try {
	sql.query(
		`SELECT count(*) AS c FROM information_schema.tables WHERE table_catalog = $1 AND table_schema = 'public'`,
		[process.env.PGDATABASE],
		(err, res) => {
			console.log('db error', JSON.stringify(err));

			if (!res) {
				console.log('database connection error');
			}

			if (res?.rows[0].c === '0') {
				console.log('creating tables');
				sql.query(`
				CREATE TABLE todos (
					id SERIAL,
					text VARCHAR(254) NOT NULL,
					done BOOLEAN NOT NULL DEFAULT FALSE
				)
				`, (err, res) => {
					console.log('tables created');
					
					if (err || !res) {
						console.log(err);
					}
				});
			}
		}
	);
} catch (error) {
	console.log('database connection error');
}

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
	const { rows } = await sql.query('SELECT id, text FROM todos WHERE done = false');
	res.send(rows);
});

app.post('/', async (req, res) => {
	const todo = req.body;

	console.log('todo', JSON.stringify(todo));

	if (typeof todo.text !== 'string' || todo.text.length > 140) {
		res.status(400).send('invalid todo');
	}

	try {
		await sql.query('INSERT INTO todos(text) VALUES ($1)', [todo.text]);
		const { rows } = await sql.query('SELECT id, text FROM todos WHERE done = false');
		res.send(rows);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
});

app.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { text, done } = req.body;
	
	try {
		const { rows } = await sql.query('UPDATE todos SET text = $1, done = $2 WHERE id = $3 RETURNING id, text, done', [text, done, id]);
		res.send(rows[0]);
	} catch (error) {
		console.log(error);
		res.sendStatus(400);
	}
});

app.get('/healthz', async (req, res) => {
	try {
		await sql.query('SELECT text AS todo FROM todos LIMIT 1');
		res.send('ok');
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
});

app.listen(port, () => console.log(`Server started in port ${port}`));
