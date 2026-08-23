import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { IconAlertCircle, IconShieldCheck, IconChevronRight } from '../components/Icons';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const { error: toastError, success: toastSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      toastSuccess(t('login_title'));
      const redirectTo = location.state?.from || '/chat';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const errMsg = err.response?.data?.message || t('common_error');
      setError(errMsg);
      toastError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card card-elevated">
        <div className="auth-card-top">
          <span className="navbar-mark" style={{ margin: '0 auto 14px' }}>ఆ</span>
          <h1 className="auth-title">{t('login_title')}</h1>
          <p className="auth-subtitle">{t('login_subtitle')}</p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            <IconAlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">{t('login_email')}</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              required 
              value={form.email} 
              onChange={handleChange} 
              autoComplete="email" 
              placeholder="e.g. yourname@example.com"
            />
          </div>

          <div className="field">
            <label htmlFor="password">{t('login_password')}</label>
            <div className="password-field-wrap">
              <input 
                id="password" 
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={form.password} 
                onChange={handleChange} 
                autoComplete="current-password" 
                placeholder="••••••••"
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
            disabled={submitting || !form.email || !form.password}
            style={{ marginTop: 8 }}
          >
            <span>{submitting ? t('common_loading') : t('login_submit')}</span>
            <IconChevronRight size={18} />
          </button>
        </form>

        <p className="auth-switch">
          {t('login_switch')}{' '}
          <Link to="/register">{t('login_switch_link')}</Link>
        </p>

        <div className="auth-footer-badge">
          <IconShieldCheck size={14} />
          <span>Encrypted Authentication · Aarogya Connect</span>
        </div>
      </div>
    </div>
  );
}
