// src/services/socketService.ts
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
// import pool from '../config/databse';

export class SocketService {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3001",
        methods: ["GET", "POST"]
      }
    });

    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      // Join match room for live updates
      socket.on('join_match', (matchId: string) => {
        socket.join(`match_${matchId}`);
        console.log(`User ${socket.id} joined match room: ${matchId}`);
      });

      // Leave match room
      socket.on('leave_match', (matchId: string) => {
        socket.leave(`match_${matchId}`);
        console.log(`User ${socket.id} left match room: ${matchId}`);
      });

      // Join competition room
      socket.on('join_competition', (competitionId: string) => {
        socket.join(`competition_${competitionId}`);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  // Broadcast live score update
  public broadcastScoreUpdate(matchId: number, scoreData: any) {
    this.io.to(`match_${matchId}`).emit('score_update', {
      matchId,
      ...scoreData
    });
  }

  // Broadcast match event (goal, card, etc.)
  public broadcastMatchEvent(matchId: number, eventData: any) {
    this.io.to(`match_${matchId}`).emit('match_event', {
      matchId,
      ...eventData
    });
  }

  // Broadcast match status change
  public broadcastMatchStatus(matchId: number, status: string, data?: any) {
    this.io.to(`match_${matchId}`).emit('match_status', {
      matchId,
      status,
      ...data
    });
  }

  public getIO() {
    return this.io;
  }
}