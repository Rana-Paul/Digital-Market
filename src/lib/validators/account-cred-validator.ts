import { z } from "zod"

export const AuthCredentialsValidator = z.object({
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(8, {message: 'Password must be at least 8 characters'}),
  })

export type TAuthCredentialsValidator = z.infer<typeof AuthCredentialsValidator>