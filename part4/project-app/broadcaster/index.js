import 'dotenv/config';
import got from 'got';
import { connect, StringCodec } from 'nats';

const sc = StringCodec();
const nc = await connect({ servers: process.env.NATS_URL });
console.log(`NATS: connected to ${nc.getServer()}`);

const sub = nc.subscribe('todo', { queue: 'todos-broadcaster' });

(async () => {
	for await (const m of sub) {
		console.log({
			received: sub.getReceived(),
			processed: sub.getProcessed(),
			pending: sub.getPending(),
		});
		const message = sc.decode(m.data);
		await got.post(process.env.BROADCASTER_BOT_URL, { form: { message } });
	}
})();
