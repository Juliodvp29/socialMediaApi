import pool from '../config/database';

export interface Post {
    id?: number;
    user_id: number;
    content: string;
    created_at?: Date;
}

export default {
    async findById(id: number) {
        const [rows, fields]: [any, any] = await pool.query(`
      SELECT p.*, u.username, u.profile_picture,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [id]);

        return rows[0] as Post;
    },

    async create(post: Post) {
        const [result]: any = await pool.query(
            'INSERT INTO posts (user_id, content) VALUES (?, ?)',
            [post.user_id, post.content]
        );

        return { id: (result as any).insertId, ...post };
    },

    async getPostsWithMedia(postId: number) {
        const post = await this.findById(postId);
        if (!post) return null;

        // Obtener imágenes
        const [images] = await pool.query(
            'SELECT * FROM post_images WHERE post_id = ?',
            [postId]
        );

        // Obtener videos
        const [videos] = await pool.query(
            'SELECT * FROM post_videos WHERE post_id = ?',
            [postId]
        );

        return {
            ...post,
            images,
            videos
        };
    },

    async getFeed(userId: number, page: number = 1, limit: number = 10) {
        const offset = (page - 1) * limit;

        const [rows] = await pool.query(`
      SELECT p.*, u.username, u.profile_picture,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ? 
      OR p.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?)
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [userId, userId, limit, offset]);

        return rows;
    }
};