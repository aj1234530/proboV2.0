import { string, z } from "zod";

const mySchema = z.string();

//keeping simple for now
export const signupSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string(),
});
