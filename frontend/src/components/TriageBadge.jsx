import { useLanguage } from '../context/LanguageContext';

const LABELS = {
  LOW: { English: 'Low Urgency', Telugu: 'తక్కువ తీవ్రత' },
  MODERATE: { English: 'Moderate Urgency', Telugu: 'మధ్యస్థ తీవ్రత' },
  URGENT: { English: 'Urgent Care', Telugu: 'అత్యవసరమైనది' },
  EMERGENCY: { English: 'Critical Emergency (108)', Telugu: 'తీవ్ర అత్యవసరం (108)' },
};

export default function TriageBadge({ level, showLabel = true }) {
  const { language } = useLanguage();
  if (!level || !LABELS[level]) return null;
  const label = LABELS[level][language] || LABELS[level].English;

  return (
    <span className={`triage-pill triage-${level}`} role="status" aria-label={`Triage Level: ${label}`}>
      {showLabel && label}
    </span>
  );
}
