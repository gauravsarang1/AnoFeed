import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string()
            .regex(/.+\@.+\..+/, 'email format is incorrect')
            .min(3, 'email is too short'),

    password:   z.string()
                .min(4, 'password must be greater than 4 charactors')
})