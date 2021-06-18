import express from 'express';
import { v4 as uuid } from 'uuid';

const app = express();
const port = 3000;

const hash = uuid();
let timestamp;

const logHash = () => {
	timestamp = new Date().toISOString();
	console.log(`${timestamp}: ${hash}`);
};

logHash();
setInterval(logHash, 5000);

app.get('/', (req, res) => res.send(`${timestamp}: ${hash}`));
app.listen(port, () => console.log(`Server started in port ${port}`));
