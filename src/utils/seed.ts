import pool from '../config/database';

export const seedDatabase = async () => {
  try {
    console.log('Seeding database...');

    // Insert sample teams
    const teams = [
      { name: 'Pirates FC', logo_url: 'https://example.com/pirates.png', city: 'Lagos', country: 'Nigeria', color_primary: '#000000', color_secondary: '#ffffff' },
      { name: 'Joga FC', logo_url: 'https://example.com/joga.png', city: 'Abuja', country: 'Nigeria', color_primary: '#ff0000', color_secondary: '#ffffff' },
      { name: 'Los Blancos', logo_url: 'https://example.com/blancos.png', city: 'Lagos', country: 'Nigeria', color_primary: '#ffffff', color_secondary: '#000000' },
      { name: 'La Masia', logo_url: 'https://example.com/masia.png', city: 'Lagos', country: 'Nigeria', color_primary: '#ff0000', color_secondary: '#0000ff' },
      { name: 'Spartans', logo_url: 'https://example.com/spartans.png', city: 'Lagos', country: 'Nigeria', color_primary: '#800080', color_secondary: '#ffffff' },
      { name: 'Kings FC', logo_url: 'https://example.com/kings.png', city: 'Lagos', country: 'Nigeria', color_primary: '#000080', color_secondary: '#ffffff' },
      { name: 'Phoenix', logo_url: 'https://example.com/phoenix.png', city: 'Lagos', country: 'Nigeria', color_primary: '#ff4500', color_secondary: '#ffffff' },
      { name: 'Blazers', logo_url: 'https://example.com/blazers.png', city: 'Lagos', country: 'Nigeria', color_primary: '#ff0000', color_secondary: '#000000' },
      { name: 'City Boys FC', logo_url: 'https://example.com/cityboys.png', city: 'Lagos', country: 'Nigeria', color_primary: '#ffff00', color_secondary: '#000000' }
    ];

    for (const team of teams) {
      await pool.query(`
        INSERT INTO teams (name, logo_url, city, country, color_primary, color_secondary)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [team.name, team.logo_url, team.city, team.country, team.color_primary, team.color_secondary]);
    }

    // Insert sample competitions
    const competitions = [
      { name: 'BUSA League', type: 'football', category: 'inter-team', status: 'active' },
      { name: 'BUSA League', type: 'basketball', category: 'inter-team', status: 'active' },
      { name: 'Play Ball Africa', type: 'football', category: 'school', status: 'active' },
      { name: 'Inter-College Cup', type: 'football', category: 'inter-college', status: 'active' },
      { name: 'BEUSA Inter-department Cup', type: 'football', category: 'engineering', status: 'active' },
      { name: 'Bells Friendlies', type: 'football', category: 'friendly', status: 'active' },
      { name: 'Bells Team Matches', type: 'football', category: 'school', status: 'active' },
      { name: 'Convocation Match', type: 'football', category: 'school', status: 'active' },
      { name: 'NPUGA', type: 'track', category: 'school', status: 'active' }
    ];

    for (const competition of competitions) {
      await pool.query(`
        INSERT INTO competitions (name, type, category, status)
        VALUES ($1, $2, $3, $4)
      `, [competition.name, competition.type, competition.category, competition.status]);
    }

    // Insert sample players
    const players = [
      { name: 'Yanko', position: 'Forward', jersey_number: 10, team_id: 1, age: 22, nationality: 'Nigeria' },
      { name: 'McAntony', position: 'Midfielder', jersey_number: 8, team_id: 1, age: 21, nationality: 'Nigeria' },
      { name: 'Animashaun', position: 'Defender', jersey_number: 4, team_id: 2, age: 23, nationality: 'Nigeria' },
      { name: 'John Doe', position: 'Goalkeeper', jersey_number: 1, team_id: 3, age: 24, nationality: 'Nigeria' },
      { name: 'Jane Smith', position: 'Forward', jersey_number: 9, team_id: 4, age: 20, nationality: 'Nigeria' }
    ];

    for (const player of players) {
      await pool.query(`
        INSERT INTO players (name, position, jersey_number, team_id, age, nationality)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [player.name, player.position, player.jersey_number, player.team_id, player.age, player.nationality]);
    }

    // Insert sample matches
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const matches = [
      {
        competition_id: 1,
        home_team_id: 1,
        away_team_id: 2,
        match_date: today,
        status: 'live',
        home_score: 0,
        away_score: 1,
        current_minute: 71,
        period: '2nd Half'
      },
      {
        competition_id: 1,
        home_team_id: 3,
        away_team_id: 4,
        match_date: today,
        status: 'scheduled',
        home_score: 0,
        away_score: 0,
        current_minute: 0
      },
      {
        competition_id: 1,
        home_team_id: 5,
        away_team_id: 6,
        match_date: tomorrow,
        status: 'scheduled',
        home_score: 0,
        away_score: 0,
        current_minute: 0
      },
      {
        competition_id: 2,
        home_team_id: 7,
        away_team_id: 8,
        match_date: today,
        status: 'live',
        home_score: 18,
        away_score: 38,
        current_minute: 0,
        period: '2nd Quarter'
      }
    ];

    for (const match of matches) {
      await pool.query(`
        INSERT INTO matches (competition_id, home_team_id, away_team_id, match_date, status, home_score, away_score, current_minute, period)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [match.competition_id, match.home_team_id, match.away_team_id, match.match_date, match.status, match.home_score, match.away_score, match.current_minute, match.period]);
    }

    // Insert sample track events
    const trackEvents = [
      { competition_id: 9, event_name: 'Sprint Relay - Male', event_type: 'relay', gender: 'male', scheduled_time: new Date('2024-10-18T16:30:00'), status: 'scheduled' },
      { competition_id: 9, event_name: 'Sprint Relay - Female', event_type: 'relay', gender: 'female', scheduled_time: new Date('2024-10-18T16:40:00'), status: 'scheduled' },
      { competition_id: 9, event_name: '100m Sprint - Male', event_type: 'sprint', gender: 'male', scheduled_time: new Date('2024-10-18T16:50:00'), status: 'scheduled' },
      { competition_id: 9, event_name: '100m Sprint - Female', event_type: 'sprint', gender: 'female', scheduled_time: new Date('2024-10-18T17:00:00'), status: 'scheduled' },
      { competition_id: 9, event_name: '400m Sprint - Male', event_type: 'sprint', gender: 'male', scheduled_time: new Date('2024-10-18T17:30:00'), status: 'scheduled' },
      { competition_id: 9, event_name: '400m Sprint - Female', event_type: 'sprint', gender: 'female', scheduled_time: new Date('2024-10-18T17:50:00'), status: 'scheduled' },
      { competition_id: 9, event_name: '1500m Sprint - Male', event_type: 'distance', gender: 'male', scheduled_time: new Date('2024-10-18T18:00:00'), status: 'scheduled' },
      { competition_id: 9, event_name: '1500m Sprint - Female', event_type: 'distance', gender: 'female', scheduled_time: new Date('2024-10-18T18:30:00'), status: 'scheduled' }
    ];

    for (const event of trackEvents) {
      await pool.query(`
        INSERT INTO track_events (competition_id, event_name, event_type, gender, scheduled_time, status)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [event.competition_id, event.event_name, event.event_type, event.gender, event.scheduled_time, event.status]);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};