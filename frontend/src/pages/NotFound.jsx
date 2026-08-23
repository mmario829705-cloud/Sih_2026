import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { IconHospital, IconChevronRight } from '../components/Icons';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="empty-state" style={{ minHeight: 'calc(100vh - var(--header-h) - 80px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: 32 }}>
      <div className="empty-state-icon" style={{ width: 72, height: 72, fontSize: 32 }}>
        <IconHospital size={36} />
      </div>
      <h1 className="display" style={{ fontSize: 48, color: 'var(--teal-deep)' }}>404</h1>
      <h2 style={{ fontSize: 22, color: 'var(--ink)' }}>Page Not Found / పేజీ కనుగొనబడలేదు</h2>
      <p style={{ color: 'var(--ink-soft)', maxWidth: 420 }}>
        The page you are looking for might have been moved or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary btn-lg" style={{ marginTop: 8 }}>
        <span>{t('common_back')}</span>
        <IconChevronRight size={18} />
      </Link>
    </div>
  );
}
