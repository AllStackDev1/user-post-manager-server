import { connection } from "../connection";
import { selectPostsTemplate } from "./query-templates";
import { Post } from "./types";
import { v4 as uuidv4 } from 'uuid';

export const getPosts = (userId: string): Promise<Post[]> =>
  new Promise((resolve, reject) => {
    connection.all<Post>(
      selectPostsTemplate,
      [userId],
      (error: Error | null, results: Post[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });

export const deletePost = (id: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    connection.run(
      `DELETE FROM posts WHERE id = ?`,
      id,
      function (error: Error | null) {
        if (error) {
          reject(error);
        } else {
          resolve(this.changes > 0);
        }
      }
    );
  });

export const createPost = (userId: string, title: string, body: string): Promise<Post> => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const created_at = new Date().toISOString();
    connection.run(
      `INSERT INTO posts (id, user_id, title, body, created_at) VALUES (?, ?, ?, ?, ?)`,
      [id, userId, title, body, created_at],
      function (error: Error | null) {
        if (error) {
          reject(error);
        } else {
          resolve({
            id,
            user_id: userId,
            title,
            body,
            created_at
          });
        }
      }
    );
  });
};
