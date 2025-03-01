import pool from '../config/database';

export interface Follower {
    follower_id: number;
    following_id: number;
}

export default {
    async follow(follower: Follower) {
        await pool.query(
            'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)',
            [follower.follower_id, follower.following_id]
        );
    },

    async unfollow(follower: Follower) {
        await pool.query(
            'DELETE FROM followers WHERE follower_id = ? AND following_id = ?',
            [follower.follower_id, follower.following_id]
        );
    },

    async countFollowers(user_id: number) {
        const [rows]: any = await pool.query(
            'SELECT COUNT(*) AS count FROM followers WHERE following_id = ?',
            [user_id]
        );
        return rows[0].count;
    },

    async countFollowing(user_id: number) {
        const [rows]: any = await pool.query(
            'SELECT COUNT(*) AS count FROM followers WHERE follower_id = ?',
            [user_id]
        );
        return rows[0].count;
    }
};
