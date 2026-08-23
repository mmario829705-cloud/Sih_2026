import { useLanguage } from '../context/LanguageContext';
import { IconPhone, IconAlertTriangle } from './Icons';

export default function EmergencyHelpBar() {
  const { t } = useLanguage();

  return (
    <aside className="emergency-help-bar" aria-label={t('emergency_title')}>
      <span>
        <IconAlertTriangle size={15} />
        {t('emergency_title')}
      </span>
      <a href="tel:108" title="Call 108 Emergency Ambulance">
        <IconPhone size={13} />
        {t('emergency_108')}
      </a>
      <a href="tel:104" title="Call 104 AP Health Advice Helpline">
        <IconPhone size={13} />
        {t('emergency_104')}
      </a>
      <a href="tel:112" title="Call 112 National Emergency">
        <IconPhone size={13} />
        {t('emergency_112')}
      </a>
    </aside>
  );
}

