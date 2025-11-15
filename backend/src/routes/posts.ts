import { Router, Request, Response } from "express";
import { getPosts, deletePost, createPost } from "../db/posts/posts";
import { getUserById } from "../db/users/users";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const userId = req.query.userId?.toString();
  if (!userId) {
    res.status(400).send({ error: "userId is required" });
    return;
  }
  try {
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).send({ error: "Invalid userId" });
      return;
    }
    const posts = await getPosts(userId);
    res.send(posts);
  } catch (error) {
    res.status(500).send({ error: "Database error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  const { title, body, userId } = req.body;
  if (!title || !body || !userId) {
    res.status(400).send({ error: "Title, body, and userId are required" });
    return;
  }
  if (typeof title !== 'string' || typeof body !== 'string' || typeof userId !== 'string') {
    res.status(400).send({ error: "Invalid input types" });
    return;
  }
  try {
    const user = await getUserById(userId);
    if (!user) {
      res.status(404).send({ error: "Invalid userId" });
      return;
    }
    const newPost = await createPost(userId, title, body);
    res.status(201).send(newPost);
  } catch (error) {
    res.status(500).send({ error: "Database error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send({ error: "Post ID is required" });
    return;
  }
  try {
    const deleted = await deletePost(id);
    if (deleted) {
      res.status(200).send({ message: "Post deleted successfully" });
    } else {
      res.status(404).send({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Database error" });
  }
});

export default router;
