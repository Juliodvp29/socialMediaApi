import { RowDataPacket } from 'mysql2';
import pool from '../config/database';

export interface Message {
    id?: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    created_at?: Date;
}

export default {
    async sendMessage(message: Message) {
        const [result]: any = await pool.query(
            'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
            [message.sender_id, message.receiver_id, message.content]
        );
        return { id: result.insertId, ...message };
    },

    async getMessages(sender_id: number, receiver_id: number) {
        const [rows]: [RowDataPacket[], any] = await pool.query(
            'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC',
            [sender_id, receiver_id, receiver_id, sender_id]
        );
        return rows;
    }
};
