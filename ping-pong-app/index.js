import express from 'express';

const app = express();
const port = 3000;

let pingpongs = 0;

app.get('/', (req, res) => res.send(`pong ${pingpongs++}`));
app.listen(port, () => console.log(`Server started in port ${port}`));
