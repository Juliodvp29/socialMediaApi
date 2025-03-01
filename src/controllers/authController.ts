import { Request, Response } from 'express';
import authService from '../services/authService';

export default {
    async register(req: Request, res: Response) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
};