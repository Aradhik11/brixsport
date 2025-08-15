// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

// Validation schemas
export const teamSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  logo_url: Joi.string().uri().optional(),
  founded_year: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
  stadium: Joi.string().max(100).optional(),
  city: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional(),
  color_primary: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional(),
  color_secondary: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
});

export const matchSchema = Joi.object({
  competition_id: Joi.number().integer().required(),
  home_team_id: Joi.number().integer().required(),
  away_team_id: Joi.number().integer().required(),
  match_date: Joi.date().required(),
  venue: Joi.string().max(100).optional()
});

export const competitionSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  type: Joi.string().valid('football', 'basketball', 'track').required(),
  category: Joi.string().max(50).optional(),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional()
});