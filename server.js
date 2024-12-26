import express, { json } from 'express';
import bodyParser from 'body-parser';
import {dirname} from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));







app.listen(port, () => {
    console.log(`Server is on ${port}`);
    });