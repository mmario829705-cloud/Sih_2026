import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { memberService } from '../services/memberService';
import { 
  IconUser, 
  IconPhone, 
  IconShieldCheck, 
  IconCheck 
} from '../components/Icons';
import './Auth.css';

export default function Profile() {
  const { member } = useAuth();
  const { t, setLanguage } = useLanguage();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({ 
    name: '', 
    phone: '', 
    age: '', 
    gender: 'Female',
    language: 'Telugu' 
  });
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || '',
        phone: member.phone || '',
        age: member.age || '',
        gender: member.gender || 'Female',
        language: member.language || 'Telugu',
      });
    }
  }, [member]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await memberService.updateProfile({ ...form, age: Number(form.age) });
      localStorage.setItem('aarogya_member', JSON.stringify({ ...member, ...form, age: Number(form.age) }));
      setLanguage(form.language);
      setSaved(true);
      success(t('profile_saved'));
    } catch {
      toastError(t('common_error'));
    } finally {
      setSubmitting(false);
    }
  };

  const memberInitial = form.name ? form.name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="auth-page">
      <div className="card auth-card card-elevated" style={{ maxWidth: 500 }}>
        {/* Profile Header Card */}
        <div className="profile-header-block">
          <div className="profile-large-avatar">{memberInitial}</div>
          <div>
            <h1 className="auth-title" style={{ fontSize: 24 }}>{t('profile_title')}</h1>
            <p className="auth-subtitle" style={{ margin: 0 }}>{member?.email}</p>
          </div>
        </div>

        {saved && (
          <div className="banner banner-info" style={{ marginBottom: 20 }}>
            <IconCheck size={18} />
            <span>{t('profile_saved')}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="prof-name">{t('register_name')}</label>
            <input 
              id="prof-name"
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="prof-phone">{t('register_phone')}</label>
              <input 
                id="prof-phone"
                name="phone" 
                value={form.phone} 
                onChange={handleChange} 
                required 
                inputMode="numeric"
                maxLength={10}
                pattern="[0-9]{10}"
              />
            </div>
            <div className="field">
              <label htmlFor="prof-age">{t('register_age')}</label>
              <input 
                id="prof-age"
                name="age" 
                type="number" 
                min="1" 
                max="120" 
                value={form.age} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="prof-gender">{t('register_gender')}</label>
              <select 
                id="prof-gender"
                name="gender" 
                value={form.gender} 
                onChange={handleChange}
              >
                <option value="Female">{t('register_gender_female')}</option>
                <option value="Male">{t('register_gender_male')}</option>
                <option value="Other">{t('register_gender_other')}</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="prof-language">{t('register_language')}</label>
              <select 
                id="prof-language"
                name="language" 
                value={form.language} 
                onChange={handleChange}
              >
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-lg" 
            disabled={submitting}
            style={{ marginTop: 12 }}
          >
            <IconCheck size={18} />
            <span>{submitting ? t('common_loading') : t('profile_save')}</span>
          </button>
        </form>

        <div className="profile-security-note">
          <IconShieldCheck size={16} />
          <span>Your health records and assessments are private and securely stored.</span>
        </div>
      </div>
    </div>
  );
}
