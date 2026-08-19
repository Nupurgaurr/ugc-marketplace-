'use client';

import Button from '@/components/shared/Button';
import StatusTracker from './StatusTracker';
import { useAuth } from '@/lib/auth/useAuth';
import { getCreatorById } from '@/lib/data/creators';
import { ROUTES } from '@/lib/routes';
import styles from './creator.module.css';

export default function DashboardOverview() {
  const { session } = useAuth('creator');
  const creator = session ? getCreatorById(session.id) : undefined;

  if (!creator) return null;

  return (
    <div>
      <StatusTracker status={creator.status} />

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Your profile</p>
        <div className={styles.quickLinks}>
          <Button href={ROUTES.creator.profile} variant="secondary" arrow>
            Edit profile
          </Button>
        </div>
      </div>
    </div>
  );
}
