import { useLanguage } from '../context/LanguageContext';
import { IconAlertTriangle, IconPhone } from './Icons';

export default function EmergencyBanner({ message }) {
  const { t } = useLanguage();

  return (
    <div className="banner banner-emergency" role="alert" aria-live="assertive">
      <IconAlertTriangle size={24} style={{ flexShrink: 0, marginTop: 2, color: 'var(--brick-700)' }} />
      <div style={{ flex: 1 }}>
        <strong style={{ display: 'block', marginBottom: 4, color: 'var(--brick-700)' }}>
          {t('rec_emergency')}
        </strong>
        <p style={{ margin: 0, fontSize: 14 }}>{message}</p>
        <div style={{ marginTop: 10 }}>
          <a href="tel:108" className="btn btn-danger btn-sm" style={{ display: 'inline-flex', gap: 6, fontWeight: 700 }}>
            <IconPhone size={15} />
            {t('emergency_108')}
          </a>
        </div>
      </div>
    </div>
  );
}
