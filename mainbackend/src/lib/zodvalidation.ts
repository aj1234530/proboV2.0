import {z} from 'zod';
//zod userRegistrationSchema
export const userRegistrationSchema = z.object({
    username: z.string().min(3,'username must be at least 3 chars long'),
    email:z.string().email('Invalid email address'),
    password: z.string().min(6,'password must be at least 6 chars')
})