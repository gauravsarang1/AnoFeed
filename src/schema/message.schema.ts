import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().trim().min(10, 'content must be 10 charectors long').max(300, 'content must be less than 300 charectors')
})