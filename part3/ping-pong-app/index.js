import 'dotenv/config';
// import path from 'path';
// import fs from 'fs';
import express from 'express';
import pg from 'pg';

// const dir = process.env.FILE_PATH;
// const file = path.join(dir, 'pingpongs.txt');
const app = express();
const port = 3002;

const { Pool } = pg;
const sql = new Pool();

// let pingpongs = 0;

// try {
// 	fs.accessSync(dir, fs.constants.R_OK);
// } catch (e) {
// 	fs.mkdirSync(dir);
// }

// Init db tables
sql.query(
	`SELECT count(*) AS c FROM information_schema.tables WHERE table_catalog = 'dwk' AND table_schema = 'public'`,
	(err, res) => {
		console.log('db error', err);

		if (res.rows[0].c === '0') {
			console.log('creating tables');
			sql.query('CREATE TABLE pings ( count INT NOT NULL )', (err, res) => {
				console.log('tables created');
			});
		}
	}
);

app.get('/pingpong', async (req, res) => {
	// pingpongs++;
	// await fs.promises.writeFile(file, String(pingpongs), { encoding: 'utf-8' });

	await sql.query('INSERT INTO pings VALUES (1)');
	const { rows } = await sql.query('SELECT SUM(count) AS pongs FROM pings');

	res.send(`pong ${rows[0].pongs}`);
});

app.get('/', (req, res) => res.send('ok'));
app.listen(port, () => console.log(`Server started in port ${port}`));
