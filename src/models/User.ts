import { RowDataPacket } from 'mysql2';
import pool from '../config/database';
import bcrypt from 'bcrypt';

export interface User {
    id?: number;
    username: string;
    email: string;
    password?: string;
    profile_picture?: string;
    bio?: string;
    gender?: string;
    created_at?: Date;
}

export default {
    async findByEmail(email: string) {
        const [rows]: [RowDataPacket[], any] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    async findById(id: number) {
        const [rows]: [RowDataPacket[], any] = await pool.query(
            'SELECT id, username, email, profile_picture, bio, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async create(user: User) {
        const hashedPassword = await bcrypt.hash(user.password!, 10);

        const [result]: any = await pool.query(
            'INSERT INTO users (username, email, password, profile_picture, bio, gender) VALUES (?, ?, ?, ?, ?, ?)',
            [user.username, user.email, hashedPassword, user.profile_picture || null, user.bio || null, user.gender || null]
        );

        return { id: result.insertId, ...user };
    },

    async update(id: number, data: Partial<User>) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password!, 10);
        }

        const keys = Object.keys(data);
        const values = Object.values(data);

        const query = `UPDATE users SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`;

        await pool.query(query, [...values, id]);
        return this.findById(id);
    }
};