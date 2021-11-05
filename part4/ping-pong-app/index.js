import 'dotenv/config';
import express from 'express';
import pg from 'pg';

const app = express();
const port = 3002;

const { Pool } = pg;
const sql = new Pool();

// Init db tables
try {
	sql.query(
		`SELECT count(*) AS c FROM information_schema.tables WHERE table_catalog = 'dwk' AND table_schema = 'public'`,
		(err, res) => {
			console.log('db error', JSON.stringify(err));

			if (!res) {
				console.log('database connection error');
			}

			if (res?.rows[0].c === '0') {
				console.log('creating tables');
				sql.query('CREATE TABLE pings ( count INT NOT NULL )', (err, res) => {
					console.log('tables created');
				});
			}
		}
	);
} catch (error) {
	console.log('database connection error');
}

app.get('/pingpong', async (req, res) => {
	await sql.query('INSERT INTO pings VALUES (1)');

	const { rows } = await sql.query('SELECT SUM(count) AS pongs FROM pings');

	res.send(`pong ${rows[0].pongs}`);
});

app.get('/healthz', async (req, res) => {
	try {
		await sql.query('SELECT count AS pongs FROM pings LIMIT 1');
		res.send('ok');
	} catch (error) {
		res.sendStatus(500);
	}
});

app.listen(port, () => console.log(`Server started in port ${port}`));
