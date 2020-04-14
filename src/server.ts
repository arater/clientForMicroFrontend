import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { getContents } from './utils';

dotenv.config();

const PORT = process.env.PORT || 8082;
const app: Application = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', async (req: Request, res: Response) => {
    const data = await getContents('http://localhost:8081');
    console.log('data from server.ts :', data);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    //res.setHeader('Content-Type', 'application/json');
    res.write(`<!DOCTYPE html>
    <html>
      <head>
        <title>Client</title>
      </head>
      <body>`);
    res.write(JSON.parse(JSON.stringify(data)));
    res.write(`</body></html>`)
    res.end();
    console.log("!Request:", req );
});


app.listen(PORT, () => {
    console.log(`Server runnig at PORT:${PORT}`);
});

export default app;