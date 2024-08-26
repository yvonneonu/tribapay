import express, { Request, Response } from "express";
import db from "./db";
import { z } from "zod";
import moment from "moment";

const app = express();
app.use(express.json());

const userSchema = z.object({
  email: z.string().email(),
});

// Define the insert type including `id` for workaround
type UserInsertType = {
  id?: number; // Make `id` optional if needed
  email: string;
  createdAt: Date;
};

// Create User Endpoint
app.post("/users", async (req: Request, res: Response) => {
  try {
    const user = userSchema.parse(req.body);

    const insertData: UserInsertType = {
      email: user.email,
      createdAt: moment().toDate(),
    };

    // Perform the insert operation
    const [createdUser] = await db
      .insertInto("user")
      .values(insertData as any) // Use `as any` to bypass type checks, cautiously
      .returning(["email", "createdAt"])
      .execute();

    res.status(201).json(createdUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Other endpoints remain unchanged...

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
