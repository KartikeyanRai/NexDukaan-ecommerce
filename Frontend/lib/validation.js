import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, "Name must be 3+ chars"),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().nonnegative(),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Valid image URL required")
});