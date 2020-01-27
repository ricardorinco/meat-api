import * as restify from 'restify';

const port = 3000;
const server = restify.createServer({
    name: "meat-api",
    version: "0.1.0"
});

server.get('/hello', (req, resp, next) => {
    resp.json({ message: 'hello' });
    return next();
});

server.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});
