import { z } from 'zod'

export const signUpSchema = z.object({
    username: z.string()
            .min(3, 'Minimum 3 digit username is required')
            .trim().regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special charectors'),

    email:  z.string()
            .regex(/.+\@.+\..+/, 'email is format is required')
            .trim(),
    
    password:   z.string()
                .min(4, 'password must be greater than 4 digit')
    
})