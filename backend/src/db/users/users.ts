import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersTemplate,
} from "./query-templates";
import { User, UserRow } from "./types";

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error: Error | null, results: {count: number} | undefined) => {
        if (error) {
          reject(error);
        } else {
          resolve(results!.count);
        }
      }
    );
  });

export const getUserById = (id: string): Promise<User | null> =>
  new Promise((resolve, reject) => {
    connection.get<UserRow>(
      `SELECT u.id, u.name, u.username, u.email, u.phone, a.street, a.city, a.state, a.zipcode
       FROM users u
       LEFT JOIN addresses a ON u.id = a.user_id
       WHERE u.id = ?`,
      [id],
      (error: Error | null, results: UserRow | undefined) => {
        if (error) {
          reject(error);
        } else {
          if (results) {
            resolve({
              id: results.id,
              name: results.name,
              username: results.username,
              email: results.email,
              phone: results.phone,
              address: {
                street: results.street,
                city: results.city,
                state: results.state,
                zipcode: results.zipcode
              }
            });
          } else {
            resolve(null);
          }
        }
      }
    );
  });

export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    connection.all<UserRow>(
      selectUsersTemplate,
      [pageNumber * pageSize, pageSize],
      (error: Error | null, results: UserRow[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.map(row => ({
            id: row.id,
            name: row.name,
            username: row.username,
            email: row.email,
            phone: row.phone,
            address: {
              street: row.street,
              city: row.city,
              state: row.state,
              zipcode: row.zipcode
            }
          })));
        }
      }
    );
  });
