import LoginForm from '@/components/admin/LoginForm';

export const metadata = { title: 'Admin — blackcoffee. UGC' };

export default function AdminLoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bcm-black)',
        padding: 'var(--gutter)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <p className="eyebrow" style={{ textAlign: 'center', marginBottom: '0.6rem' }}>
          Internal
        </p>
        <h1 className="display" style={{ fontSize: 'var(--step-2)', textAlign: 'center', marginBottom: '2rem' }}>
          Admin
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
