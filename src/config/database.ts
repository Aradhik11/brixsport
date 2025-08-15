// src/config/database.ts
import { Pool } from 'pg';

const pool = new Pool(
  process.env.DATABASE_URL && process.env.NODE_ENV === 'production'
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'brixsports',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'password',
      }
);

export default pool;

// Database Schema SQL
export const createTables = `
-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255),
    founded_year INTEGER,
    stadium VARCHAR(100),
    city VARCHAR(100),
    country VARCHAR(100),
    color_primary VARCHAR(7),
    color_secondary VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Competitions table
CREATE TABLE IF NOT EXISTS competitions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'football', 'basketball', 'track'
    category VARCHAR(50), -- 'school', 'inter-college', etc.
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'upcoming'
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50),
    jersey_number INTEGER,
    team_id INTEGER REFERENCES teams(id),
    age INTEGER,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    nationality VARCHAR(50),
    photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    competition_id INTEGER REFERENCES competitions(id),
    home_team_id INTEGER REFERENCES teams(id),
    away_team_id INTEGER REFERENCES teams(id),
    match_date TIMESTAMP NOT NULL,
    venue VARCHAR(100),
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed', 'postponed'
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    current_minute INTEGER DEFAULT 0,
    period VARCHAR(20), -- '1st Half', '2nd Half', 'Half Time', 'Full Time'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match Events table
CREATE TABLE IF NOT EXISTS match_events (
    id SERIAL PRIMARY KEY,
    match_id INTEGER REFERENCES matches(id),
    player_id INTEGER REFERENCES players(id),
    event_type VARCHAR(50) NOT NULL, -- 'goal', 'yellow_card', 'red_card', 'substitution'
    minute INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Track Events table
CREATE TABLE IF NOT EXISTS track_events (
    id SERIAL PRIMARY KEY,
    competition_id INTEGER REFERENCES competitions(id),
    event_name VARCHAR(100) NOT NULL, -- 'Sprint Relay - Male', '100m Sprint - Female'
    event_type VARCHAR(50), -- 'sprint', 'relay', 'distance'
    gender VARCHAR(10), -- 'male', 'female', 'mixed'
    scheduled_time TIMESTAMP,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER, -- Would reference users table when auth is implemented
    favorite_type VARCHAR(20), -- 'team', 'player', 'competition'
    favorite_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, favorite_type, favorite_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_competition ON matches(competition_id);
CREATE INDEX IF NOT EXISTS idx_match_events_match ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
`