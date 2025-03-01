import { RowDataPacket } from 'mysql2';
import pool from '../config/database';

export interface Comment {
    id?: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at?: Date;
}

export default {
    async create(comment: Comment) {
        const [result]: any = await pool.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [comment.post_id, comment.user_id, comment.content]
        );
        return { id: result.insertId, ...comment };
    },

    async findByPostId(post_id: number) {
        const [rows]: [RowDataPacket[], any] = await pool.query(
            'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC',
            [post_id]
        );
        return rows;
    },

    async delete(id: number) {
        await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    }
};
