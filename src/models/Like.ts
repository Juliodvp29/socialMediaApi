import pool from '../config/database';

export interface Like {
    user_id: number;
    post_id: number;
}

export default {
    async likePost(like: Like) {
        await pool.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [
            like.user_id,
            like.post_id
        ]);
    },

    async unlikePost(like: Like) {
        await pool.query('DELETE FROM likes WHERE user_id = ? AND post_id = ?', [
            like.user_id,
            like.post_id
        ]);
    },

    async countLikes(post_id: number) {
        const [rows]: any = await pool.query(
            'SELECT COUNT(*) AS count FROM likes WHERE post_id = ?',
            [post_id]
        );
        return rows[0].count;
    }
};
