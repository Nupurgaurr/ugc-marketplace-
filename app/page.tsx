import HomePage from '@/components/home/HomePage';
import { getApprovedCreators } from '@/lib/data/creators';

export default function Page() {
  return <HomePage creators={getApprovedCreators()} />;
}
