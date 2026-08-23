import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { symptomAssessmentService } from '../services/symptomService';
import TriageBadge from '../components/TriageBadge';
import { 
  IconClock, 
  IconMessageSquare, 
  IconHospital, 
  IconShieldCheck, 
  IconChevronRight 
} from '../components/Icons';
import './ListPage.css';

const RECOMMENDATION_KEYS = {
  home_monitor: 'rec_home_monitor',
  monitor_phc: 'rec_monitor_phc',
  phc_soon: 'rec_phc_soon',
  emergency: 'rec_emergency',
};

export default function History() {
  const { t } = useLanguage();
  const { error: toastError } = useToast();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('ALL');

  useEffect(() => {
    symptomAssessmentService.getHistory(1, 50)
      .then(data => setAssessments(data.assessments || []))
      .catch(() => toastError(t('common_error')))
      .finally(() => setLoading(false));
  }, []);

  const filteredAssessments = useMemo(() => {
    if (filterLevel === 'ALL') return assessments;
    return assessments.filter(a => a.triageLevel === filterLevel);
  }, [assessments, filterLevel]);

  return (
    <div className="list-page container">
      <div className="list-page-header">
        <div>
          <h1 className="list-title">{t('history_title')}</h1>
          <p className="list-subtitle">{t('history_subtitle')}</p>
        </div>
        <Link to="/chat" className="btn btn-primary btn-sm">
          <IconMessageSquare size={16} />
          <span>{t('chat_new')}</span>
        </Link>
      </div>

      {/* Triage Level Filter Bar */}
      {assessments.length > 0 && (
        <div className="phc-controls card" style={{ padding: '14px 18px', marginBottom: 24 }}>
          <div className="facility-type-pills" style={{ borderTop: 'none', paddingTop: 0 }}>
            {[
              { id: 'ALL', label: t('history_filter_all') },
              { id: 'LOW', label: 'Low Urgency' },
              { id: 'MODERATE', label: 'Moderate' },
              { id: 'URGENT', label: 'Urgent' },
              { id: 'EMERGENCY', label: 'Emergency' },
            ].map(lvl => (
              <button
                key={lvl.id}
                type="button"
                className={`pill-btn ${filterLevel === lvl.id ? 'active' : ''}`}
                onClick={() => setFilterLevel(lvl.id)}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Assessments List */}
      {loading ? (
        <div className="empty-state">
          <div className="spinner" />
          <p>{t('common_loading')}</p>
        </div>
      ) : assessments.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">
            <IconClock size={28} />
          </div>
          <h3>{t('history_empty')}</h3>
          <p>Your recorded symptom checks and triage recommendations will appear here.</p>
          <Link to="/chat" className="btn btn-primary" style={{ marginTop: 8 }}>
            <IconMessageSquare size={18} />
            <span>{t('hero_cta_primary')}</span>
          </Link>
        </div>
      ) : filteredAssessments.length === 0 ? (
        <div className="empty-state card">
          <p>No assessments match the selected filter level.</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setFilterLevel('ALL')}>
            Show All Levels
          </button>
        </div>
      ) : (
        <div className="history-list">
          {filteredAssessments.map(a => (
            <div key={a.id} className="card history-card card-elevated">
              <div className="history-card-header">
                <TriageBadge level={a.triageLevel} />
                <span className="history-date">
                  <IconClock size={14} />
                  {new Date(a.createdAt).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className="history-symptoms-section">
                <span className="history-label">{t('history_symptoms')}</span>
                <div className="history-symptom-tags">
                  {a.symptoms && Array.isArray(a.symptoms) && a.symptoms.map((sym, i) => (
                    <span key={i} className="symptom-tag">{sym}</span>
                  ))}
                </div>
              </div>

              {a.recommendation && (
                <div className={`history-rec-box ${a.triageLevel === 'EMERGENCY' ? 'rec-emergency' : ''}`}>
                  <strong style={{ display: 'block', marginBottom: 2, color: 'var(--teal-deep)' }}>
                    {t('history_recommendation')}:
                  </strong>
                  <span>{t(RECOMMENDATION_KEYS[a.recommendation]) || a.recommendation}</span>
                </div>
              )}

              <div className="history-card-actions">
                <Link to="/phcs" className="btn btn-outline btn-sm">
                  <IconHospital size={15} />
                  <span>{t('history_view_phc')}</span>
                  <IconChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
