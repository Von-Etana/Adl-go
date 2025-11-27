import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import routes from './routes';

dotenv.config();

import http from 'http';
import { SocketGateway } from './gateways/socket.gateway';

const app = express();
const httpServer = http.createServer(app);
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Database initialization
initializeDatabase();

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize Socket Gateway
SocketGateway.initialize(httpServer);

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
