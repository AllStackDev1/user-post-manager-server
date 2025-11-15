import { Router, Request, Response } from "express";

import { getUsers, getUsersCount } from "../db/users/users";
import { PaginatedResponse } from "../types";
import { User } from "../db/users/types";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  const pageNumber = Number(req.query.pageNumber) || 0;
  const pageSize = Number(req.query.pageSize) || 4;
  if (pageNumber < 0 || pageSize < 1) {
    res.status(400).send({ message: "Invalid page number or page size" });
    return;
  }

  try {
    const [users, total] = await Promise.all([
      getUsers(pageNumber, pageSize),
      getUsersCount()
    ]);
    const totalPages = Math.ceil(total / pageSize);
    const response: PaginatedResponse<User> = {
      data: users,
      total,
      pageNumber,
      pageSize,
      totalPages
    };
    res.send(response);
  } catch (error) {
    res.status(500).send({ message: "Database error" });
  }
});

router.get("/count", async (req: Request, res: Response) => {
  const count = await getUsersCount();
  res.send({ count });
});

export default router;
