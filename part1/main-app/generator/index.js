import fs from 'fs/promises';
import { v4 as uuid } from 'uuid';

const file = '/app/files/hash.txt';
const hash = uuid();

const saveHash = async () => {
	const timestamp = new Date().toISOString();
	const data = `${timestamp}: ${hash}`;

	await fs.writeFile(file, data, { encoding: 'utf-8' });
};

saveHash();
setInterval(saveHash, 5000);
