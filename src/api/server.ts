import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { WebSocket, WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import type { BotStatus, ApiResponse } from './types.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: jwt.JwtPayload;
    }
  }
}

config();

const app = express();
const port = process.env.API_PORT || 3001;
const API_SECRET = process.env.API_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// WebSocket server for real-time updates
const wss = new WebSocketServer({ noServer: true });

// Authentication middleware
const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, API_SECRET);
    req.user = decoded as jwt.JwtPayload;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Bot control state
let botProcess: any = null;
let botStatus: BotStatus = {
  isRunning: false,
  lastUpdate: new Date().toISOString(),
  portfolioValue: 0,
  recentTrades: [],
  recentTweets: []
};

// API Routes
app.post('/api/auth', (req: Request, res: Response) => {
  const { password } = req.body;
  
  if (password === process.env.DASHBOARD_PASSWORD) {
    const token = jwt.sign({ authorized: true }, API_SECRET, { expiresIn: '24h' });
    res.json({ success: true, data: { token } });
  } else {
    res.status(401).json({ success: false, error: 'Invalid password' });
  }
});

app.get('/api/status', authenticate, (req: Request, res: Response) => {
  res.json({ success: true, data: botStatus });
});

app.post('/api/bot/start', authenticate, async (req: Request, res: Response) => {
  try {
    if (botStatus.isRunning) {
      return res.json({ success: false, error: 'Bot is already running' });
    }

    // Start the bot process
    botStatus.isRunning = true;
    botStatus.lastUpdate = new Date().toISOString();
    
    // Broadcast status update to all connected clients
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'status', data: botStatus }));
      }
    });

    res.json({ success: true, data: botStatus });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to start bot' });
  }
});

app.post('/api/bot/stop', authenticate, async (req: Request, res: Response) => {
  try {
    if (!botStatus.isRunning) {
      return res.json({ success: false, error: 'Bot is not running' });
    }

    // Stop the bot process
    botStatus.isRunning = false;
    botStatus.lastUpdate = new Date().toISOString();

    // Broadcast status update
    wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: 'status', data: botStatus }));
      }
    });

    res.json({ success: true, data: botStatus });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to stop bot' });
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});

// Handle WebSocket upgrade
server.on('upgrade', (request: IncomingMessage, socket: Socket, head: Buffer) => {
  wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
    wss.emit('connection', ws, request);
  });
});

// WebSocket connection handling
wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected to WebSocket');
  
  // Send initial status
  ws.send(JSON.stringify({ type: 'status', data: botStatus }));

  ws.on('close', () => {
    console.log('Client disconnected from WebSocket');
  });
}); 