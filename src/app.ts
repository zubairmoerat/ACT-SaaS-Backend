import express, { Application, Request, Response } from 'express';

const app: Application = express();

// Middleware
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World with TypeScript!');
});

export default app;