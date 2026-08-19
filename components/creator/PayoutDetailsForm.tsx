'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BadgeCheck, Clock, Landmark, Lock, Smartphone } from 'lucide-react';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { savePayoutDetails } from '@/app/actions/profile';
import { payoutDetailsSchema, type PayoutDetailsInput } from '@/lib/schemas/payout';
import { cx } from '@/lib/utils';
import type { MaskedPayoutDetails, PayoutMethod } from '@/lib/types';
import styles from './PayoutDetails.module.css';

/**
 * Nothing in this component receives a full account or PAN number back from
 * the server. `saved` carries only the last four digits of each, masked in
 * lib/data/creator.ts before it ever leaves the server.
 */
export default function PayoutDetailsForm({ saved }: { saved: MaskedPayoutDetails | null }) {
  const [method, setMethod] = useState<PayoutMethod>(saved?.method ?? 'bank');
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PayoutDetailsInput>({
    resolver: zodResolver(payoutDetailsSchema),
    mode: 'onTouched',
    // Deliberately empty: the stored values are never sent back to the
    // browser, so re-saving means re-entering them in full.
    defaultValues: { method: 'bank' } as PayoutDetailsInput,
  });

  const switchMethod = (next: PayoutMethod) => {
    setMethod(next);
    setMessage(null);
    reset({ method: next } as PayoutDetailsInput);
  };

  const onSubmit = (values: PayoutDetailsInput) => {
    setMessage(null);
    startTransition(async () => {
      const result = await savePayoutDetails(values);
      setMessage({ ok: result.ok, text: result.message });
      if (result.ok) reset({ method } as PayoutDetailsInput);
    });
  };

  return (
    <div className={styles.wrap}>
      <p className={styles.why}>
        BCM pays creators directly for the work it brings them. These details are needed before your
        first payout, and nothing is sent until you are approved and a job is complete.
      </p>

      <p className={styles.privacy}>
        <Lock size={14} aria-hidden="true" />
        Only you can read these. They are never shown on your profile and never shared with a brand.
      </p>

      {saved && <SavedSummary saved={saved} />}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
        <input type="hidden" value={method} {...register('method')} />

        <div className={styles.methods} role="radiogroup" aria-label="Payout method">
          <MethodTile
            active={method === 'bank'}
            icon={<Landmark size={18} aria-hidden="true" />}
            label="Bank account"
            onClick={() => switchMethod('bank')}
          />
          <MethodTile
            active={method === 'upi'}
            icon={<Smartphone size={18} aria-hidden="true" />}
            label="UPI"
            onClick={() => switchMethod('upi')}
          />
        </div>

        {method === 'bank' ? (
          <>
            <FormField
              label="Account holder name"
              placeholder="As printed on the passbook"
              error={'accountHolderName' in errors ? errors.accountHolderName?.message : undefined}
              {...register('accountHolderName')}
            />
            <FormField
              label="Account number"
              inputMode="numeric"
              autoComplete="off"
              error={'accountNumber' in errors ? errors.accountNumber?.message : undefined}
              {...register('accountNumber')}
            />
            <FormField
              label="Confirm account number"
              inputMode="numeric"
              autoComplete="off"
              onPaste={(e) => e.preventDefault()}
              error={'confirmAccountNumber' in errors ? errors.confirmAccountNumber?.message : undefined}
              {...register('confirmAccountNumber')}
            />
            <FormField
              label="IFSC"
              placeholder="HDFC0001234"
              autoCapitalize="characters"
              error={'ifsc' in errors ? errors.ifsc?.message : undefined}
              {...register('ifsc')}
            />
          </>
        ) : (
          <FormField
            label="UPI ID"
            placeholder="naam@bank"
            autoComplete="off"
            error={'upiId' in errors ? errors.upiId?.message : undefined}
            {...register('upiId')}
          />
        )}

        <FormField
          label="PAN number"
          placeholder="ABCDE1234F"
          autoCapitalize="characters"
          error={errors.panNumber?.message}
          {...register('panNumber')}
        />

        {message && (
          <p className={message.ok ? styles.noteOk : styles.noteError}>{message.text}</p>
        )}

        <div>
          <Button type="submit" variant="primary" disabled={isPending}>
            {isPending ? 'Saving' : saved ? 'Replace details' : 'Save details'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function MethodTile({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      className={cx(styles.method, active && styles.methodOn)}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function SavedSummary({ saved }: { saved: MaskedPayoutDetails }) {
  return (
    <div className={styles.saved}>
      <div className={styles.savedRow}>
        <span className={styles.savedLabel}>On file</span>
        <span className={styles.savedValue}>
          {saved.method === 'bank'
            ? `Bank account ending ${saved.account_number_last4}`
            : 'UPI ID saved'}
        </span>
      </div>

      <div className={styles.savedRow}>
        <span className={styles.savedLabel}>PAN</span>
        <span className={styles.savedValue}>Ending {saved.pan_number_last4}</span>
      </div>

      <div className={styles.savedRow}>
        <span className={styles.savedLabel}>Status</span>
        {saved.verified ? (
          <span className={cx(styles.savedValue, styles.verified)}>
            <BadgeCheck size={15} aria-hidden="true" />
            Verified by BCM
          </span>
        ) : (
          <span className={cx(styles.savedValue, styles.pending)}>
            <Clock size={15} aria-hidden="true" />
            Waiting on BCM to verify
          </span>
        )}
      </div>
    </div>
  );
}
