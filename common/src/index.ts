import z from "zod";

export const signupInput = z.object({
  email: z.string().email("Invalid Email format"),
  password: z.string().min(4, "Password should be of minimum 6 characters"),
  name: z.string().trim().optional(),
});

export const signinInput = z.object({
  email: z.string().email("Invalid Email format"),
  password: z.string(),
});

export const createBlogInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  id: z.string(),
});

export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
