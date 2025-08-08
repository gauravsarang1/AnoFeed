import { z } from 'zod'

export const acceptMessage = z.object({
    accceptMessage: z.boolean()
})