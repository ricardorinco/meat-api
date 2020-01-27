import * as restify from "restify";

const port = 3000;
const server = restify.createServer({
    name: "meat-api",
    version: "0.1.0"
});

server.use(restify.plugins.queryParser());

server.get("/info", [
    (req, resp, next) => {
        if (req.userAgent() && req.userAgent().includes('MSIE 7.0')) {
            // resp.status(400);
            // resp.json({
            //     message: 'Please, update your brownser'
            // })

            let error:any = new Error();
            error.statusCode = 400;
            error.message = 'Please, update your brownser'

            return next(error);
        }

        return next();
    },
    (req, resp, next) => {
        resp.json({
            browser: req.userAgent(),
            method: req.method,
            ur: req.href(),
            path: req.path(),
            query: req.query
        });

        return next();
    }
]);

server.listen(port, () => {
    console.log(`API is running on http://localhost:${port}`);
});
