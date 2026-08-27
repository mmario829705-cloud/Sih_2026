import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import AppLogo from '../components/AppLogo';
import { IconAlertCircle, IconShieldCheck, IconChevronRight } from '../components/Icons';
import './Auth.css';

const initialForm = {
  name: '', 
  email: '', 
  phone: '', 
  age: '', 
  gender: 'Female', 
  password: '', 
  language: 'Telugu'
};

export default function Register() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.phone.length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await register({ ...form, age: Number(form.age) });
      toastSuccess(t('register_title'));
      navigate('/chat', { replace: true });
    } catch (err) {
      let errMsg = err.response?.data?.message;
      if (!errMsg) {
        if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
          errMsg = 'Server is waking up (Render cold start). Please wait a moment and click Submit again.';
        } else if (err.message === 'Network Error') {
          errMsg = 'Cannot reach backend server. Please check if Render backend is awake and MongoDB Atlas network access (0.0.0.0/0) is enabled.';
        } else {
          errMsg = err.message || t('common_error');
        }
      }
      setError(errMsg);
      toastError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card card-elevated" style={{ maxWidth: 480 }}>
        <div className="auth-card-top">
          <AppLogo size={64} variant="mark" className="auth-logo" />
          <h1 className="auth-title">{t('register_title')}</h1>
          <p className="auth-subtitle">{t('register_subtitle')}</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <IconAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="reg-name">{t('register_name')}</label>
            <input 
              id="reg-name" 
              name="name" 
              required 
              value={form.name} 
              onChange={handleChange} 
              autoComplete="name"
              placeholder="e.g. Ramesh Kumar / రమేష్ కుమార్"
            />
          </div>

          <div className="field">
            <label htmlFor="reg-email">{t('register_email')}</label>
            <input 
              id="reg-email" 
              name="email" 
              type="email" 
              required 
              value={form.email} 
              onChange={handleChange} 
              autoComplete="email" 
              placeholder="e.g. yourname@example.com"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="reg-phone">{t('register_phone')}</label>
              <input 
                id="reg-phone" 
                name="phone" 
                required 
                value={form.phone} 
                onChange={handleChange} 
                autoComplete="tel" 
                inputMode="numeric" 
                maxLength={10} 
                pattern="[0-9]{10}"
                placeholder="10-digit number"
              />
            </div>
            <div className="field">
              <label htmlFor="reg-age">{t('register_age')}</label>
              <input 
                id="reg-age" 
                name="age" 
                type="number" 
                min="1" 
                max="120" 
                required 
                value={form.age} 
                onChange={handleChange} 
                placeholder="e.g. 35"
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="reg-gender">{t('register_gender')}</label>
              <select 
                id="reg-gender" 
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
              <label htmlFor="reg-lang">{t('register_language')}</label>
              <select 
                id="reg-lang" 
                name="language" 
                value={form.language} 
                onChange={handleChange}
              >
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="reg-password">{t('register_password')}</label>
            <div className="password-field-wrap">
              <input 
                id="reg-password" 
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                minLength={6} 
                required 
                value={form.password} 
                onChange={handleChange} 
                autoComplete="new-password" 
                placeholder="At least 6 characters"
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block btn-lg" 
            disabled={submitting}
            style={{ marginTop: 8 }}
          >
            <span>{submitting ? t('common_loading') : t('register_submit')}</span>
            <IconChevronRight size={18} />
          </button>
        </form>

        <p className="auth-switch">
          {t('register_switch')}{' '}
          <Link to="/login">{t('register_switch_link')}</Link>
        </p>

        <div className="auth-footer-badge">
          <IconShieldCheck size={14} />
          <span>Free Public Health Portal · SIH 2026</span>
        </div>
      </div>
    </div>
  );
}
