// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BrixSports API',
      version: '1.0.0',
      description: 'Live Football Web App API Documentation',
    },
    servers: [
      {
        url: 'https://brixsport.onrender.com/api',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Team: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            logo_url: { type: 'string' },
            founded_year: { type: 'integer' },
            stadium: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            color_primary: { type: 'string' },
            color_secondary: { type: 'string' }
          }
        },
        Match: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            competition_id: { type: 'integer' },
            home_team_id: { type: 'integer' },
            away_team_id: { type: 'integer' },
            match_date: { type: 'string', format: 'date-time' },
            venue: { type: 'string' },
            status: { type: 'string', enum: ['scheduled', 'live', 'completed'] },
            home_score: { type: 'integer' },
            away_score: { type: 'integer' },
            current_minute: { type: 'integer' },
            period: { type: 'string' }
          }
        },
        Competition: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            type: { type: 'string', enum: ['football', 'basketball', 'track'] },
            category: { type: 'string' },
            status: { type: 'string' },
            start_date: { type: 'string', format: 'date' },
            end_date: { type: 'string', format: 'date' }
          }
        },
        Player: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            position: { type: 'string' },
            jersey_number: { type: 'integer' },
            team_id: { type: 'integer' },
            age: { type: 'integer' },
            nationality: { type: 'string' },
            photo_url: { type: 'string' }
          }
        },
        TrackEvent: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            competition_id: { type: 'integer' },
            event_name: { type: 'string' },
            event_type: { type: 'string' },
            gender: { type: 'string' },
            scheduled_time: { type: 'string', format: 'date-time' },
            status: { type: 'string' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };