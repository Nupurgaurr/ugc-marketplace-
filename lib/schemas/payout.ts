import { z } from 'zod';

/**
 * Payout and identity details. Same rules as the CHECK constraints on
 * creator_payout_details. Nothing in this file is ever logged.
 */

const panSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'PAN dus character ka hota hai, jaise ABCDE1234F.');

const bankSchema = z.object({
  method: z.literal('bank'),
  accountHolderName: z.string().trim().min(2, 'Account holder ka naam chahiye.').max(80),
  accountNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{9,18}$/, 'Account number sirf digits, 9 se 18 tak.'),
  confirmAccountNumber: z.string().trim(),
  ifsc: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC aisa dikhta hai: HDFC0001234.'),
  panNumber: panSchema,
});

const upiSchema = z.object({
  method: z.literal('upi'),
  upiId: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9._-]{2,64}@[a-zA-Z]{2,64}$/, 'UPI ID aisi dikhti hai: naam@bank.'),
  panNumber: panSchema,
});

export const payoutDetailsSchema = z.discriminatedUnion('method', [bankSchema, upiSchema]).refine(
  (value) => value.method !== 'bank' || value.accountNumber === value.confirmAccountNumber,
  { message: 'Dono account numbers match nahi kar rahe.', path: ['confirmAccountNumber'] }
);

export type PayoutDetailsInput = z.infer<typeof payoutDetailsSchema>;

/** Never show a full account or PAN back to the browser. */
export function maskTail(value: string | null, visible = 4): string | null {
  if (!value) return null;
  return value.slice(-visible);
}
