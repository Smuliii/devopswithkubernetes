import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

const dir = process.env.FILE_PATH;
const file = path.join(dir, 'hash.txt');
const hash = uuid();

try {
	fs.accessSync(dir, fs.constants.R_OK);
} catch (e) {
	fs.mkdirSync(dir);
}

const saveHash = async () => {
	const timestamp = new Date().toISOString();
	const data = `${timestamp}: ${hash}`;

	await fs.promises.writeFile(file, data, { encoding: 'utf-8' });
};

saveHash();
setInterval(saveHash, 5000);
