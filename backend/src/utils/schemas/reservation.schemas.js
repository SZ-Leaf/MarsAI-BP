import { z } from 'zod';

export const reservationSchema = z.object({
   first_name: z
      .string({
         required_error: 'zod_errors.reservation.first_name.required',
         invalid_type_error: 'zod_errors.reservation.first_name.invalid',
      })
      .min(1, { message: 'zod_errors.reservation.first_name.min' })
      .max(100, { message: 'zod_errors.reservation.first_name.max' })
      .trim(),
   last_name: z
      .string({
         required_error: 'zod_errors.reservation.last_name.required',
         invalid_type_error: 'zod_errors.reservation.last_name.invalid',
      })
      .min(1, { message: 'zod_errors.reservation.last_name.min' })
      .max(100, { message: 'zod_errors.reservation.last_name.max' })
      .trim(),
   email: z
      .string({
         required_error: 'zod_errors.reservation.email.required',
         invalid_type_error: 'zod_errors.reservation.email.invalid',
      })
      .email({ message: 'zod_errors.reservation.email.format' })
      .trim()
      .toLowerCase(),

});

export const reservationConfirmSchema = z.object({
   token: z
      .string({
         required_error: 'zod_errors.reservation.token.required',
         invalid_type_error: 'zod_errors.reservation.token.invalid',
      })
      .min(1, { message: 'zod_errors.reservation.token.min' }),
});
