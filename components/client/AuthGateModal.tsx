'use client';

import { useRouter } from 'next/navigation';
import Modal, { modalStyles } from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import { ROUTES } from '@/lib/routes';

/** Browsing never requires an account — only shortlisting or requesting
 *  does. This is the gate shown at that moment (see PROJECT_REPORT.md). */
export default function AuthGateModal({
  open,
  context,
  onClose,
}: {
  open: boolean;
  context: string;
  onClose: () => void;
}) {
  const router = useRouter();

  return (
    <Modal open={open} onClose={onClose} title="Create a free account">
      <p className={modalStyles.body}>{context} Browsing stays open — this is the only step that needs an account.</p>
      <div className={modalStyles.actions}>
        <Button
          variant="primary"
          block
          arrow
          onClick={() => {
            onClose();
            router.push(ROUTES.client.register);
          }}
        >
          Create account
        </Button>
        <Button
          variant="secondary"
          block
          onClick={() => {
            onClose();
            router.push(ROUTES.client.login);
          }}
        >
          Log in
        </Button>
        <Button variant="ghost" block onClick={onClose}>
          Keep browsing
        </Button>
      </div>
    </Modal>
  );
}
