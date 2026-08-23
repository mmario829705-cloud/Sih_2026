import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { 
  IconMessageSquare, 
  IconClock, 
  IconHospital, 
  IconUser, 
  IconMenu, 
  IconClose, 
  IconShieldCheck,
  IconSparkles,
  IconPhone,
  IconInfo
} from './Icons';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, member, logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const memberInitial = member?.name ? member.name.charAt(0).toUpperCase() : 'A';
  const chatRoute = isAuthenticated ? '/chat' : '/register';
  const phcRoute = isAuthenticated ? '/phcs' : '/login';

  return (
    <header className="navbar" role="banner">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand" aria-label={t('appName')}>
          <span className="navbar-mark" aria-hidden="true">ఆ</span>
          <div className="navbar-brand-text">
            <span className="navbar-name">{t('appName')}</span>
            <span className="navbar-badge">
              <IconShieldCheck size={12} />
              SIH &apos;26
            </span>
          </div>
        </Link>

        {/* Complete Horizontal Desktop Navigation Bar */}
        <nav className="navbar-links" aria-label="Main horizontal navigation">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive && location.pathname === '/' && !location.hash ? 'active' : ''}`}>
            <span>{language === 'Telugu' ? 'హోమ్' : 'Home'}</span>
          </NavLink>

          <NavLink to={chatRoute} className={({ isActive }) => `nav-item ${isActive && location.pathname === '/chat' ? 'active' : ''}`}>
            <IconSparkles size={16} />
            <span>{language === 'Telugu' ? 'లక్షణాల పరీక్ష' : 'Symptom Triage'}</span>
          </NavLink>

          <NavLink to={phcRoute} className={({ isActive }) => `nav-item ${isActive && location.pathname === '/phcs' ? 'active' : ''}`}>
            <IconHospital size={16} />
            <span>{t('nav_phcs')}</span>
          </NavLink>

          <a href="/#emergency-data" className="nav-item nav-item-emergency">
            <IconPhone size={16} />
            <span>{language === 'Telugu' ? 'అత్యవసరం 108' : 'Emergency 108'}</span>
          </a>

          <a href="/#about-us" className="nav-item">
            <IconInfo size={16} />
            <span>{language === 'Telugu' ? 'మా గురించి' : 'About Us'}</span>
          </a>

          {isAuthenticated && (
            <>
              <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <IconClock size={16} />
                <span>{t('nav_history')}</span>
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <IconUser size={16} />
                <span>{t('nav_profile')}</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Desktop Right Actions (Language + User Profile/Login/Logout) */}
        <div className="navbar-actions">
          <LanguageToggle />

          {isAuthenticated ? (
            <div className="navbar-user-group">
              <Link to="/profile" className="navbar-avatar" title={member?.name || t('nav_profile')}>
                {memberInitial}
              </Link>
              <button 
                type="button" 
                className="btn btn-ghost btn-sm navbar-logout-btn" 
                onClick={handleLogout}
              >
                {t('nav_logout')}
              </button>
            </div>
          ) : (
            <div className="navbar-auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">{t('nav_login')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('nav_register')}</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="navbar-hamburger"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label={mobileMenuOpen ? t('nav_close') : t('nav_menu')}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <IconClose size={24} /> : <IconMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-title">
                <span className="navbar-mark">ఆ</span>
                <span>{t('appName')}</span>
              </div>
              <button 
                type="button" 
                className="mobile-drawer-close" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label={t('nav_close')}
              >
                <IconClose size={22} />
              </button>
            </div>

            {isAuthenticated && member && (
              <div className="mobile-drawer-user">
                <div className="navbar-avatar">{memberInitial}</div>
                <div>
                  <strong>{member.name}</strong>
                  <p>{member.phone || member.email}</p>
                </div>
              </div>
            )}

            <nav className="mobile-drawer-nav">
              <NavLink 
                to="/" 
                className={({ isActive }) => `mobile-nav-item ${isActive && location.pathname === '/' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{language === 'Telugu' ? 'హోమ్ పేజీ' : 'Home'}</span>
              </NavLink>

              <NavLink 
                to={chatRoute} 
                className={({ isActive }) => `mobile-nav-item ${isActive && location.pathname === '/chat' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <IconSparkles size={19} />
                <span>{language === 'Telugu' ? 'లక్షణాల పరీక్ష (Medi AI)' : 'Symptom Triage (Medi AI)'}</span>
              </NavLink>

              <NavLink 
                to={phcRoute} 
                className={({ isActive }) => `mobile-nav-item ${isActive && location.pathname === '/phcs' ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <IconHospital size={19} />
                <span>{t('nav_phcs')} (26 Districts)</span>
              </NavLink>

              <a 
                href="/#emergency-data" 
                className="mobile-nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <IconPhone size={19} style={{ color: 'var(--brick)' }} />
                <span style={{ color: 'var(--brick-700)', fontWeight: 700 }}>
                  {language === 'Telugu' ? 'అత్యవసర సమాచారం & 108' : 'Emergency Data & 108'}
                </span>
              </a>

              <a 
                href="/#about-us" 
                className="mobile-nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <IconInfo size={19} />
                <span>{language === 'Telugu' ? 'మా గురించి & సహాయం' : 'About Us & Help'}</span>
              </a>

              {isAuthenticated ? (
                <>
                  <NavLink 
                    to="/history" 
                    className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconClock size={19} />
                    <span>{t('nav_history')}</span>
                  </NavLink>
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconUser size={19} />
                    <span>{t('nav_profile')}</span>
                  </NavLink>
                </>
              ) : (
                <div className="mobile-auth-actions">
                  <Link 
                    to="/login" 
                    className="btn btn-outline btn-block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav_login')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary btn-block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav_register')}
                  </Link>
                </div>
              )}
            </nav>

            <div className="mobile-drawer-footer">
              <div className="mobile-lang-row">
                <LanguageToggle />
              </div>
              {isAuthenticated && (
                <button 
                  type="button" 
                  className="btn btn-danger btn-block btn-sm"
                  onClick={handleLogout}
                  style={{ marginTop: 12 }}
                >
                  {t('nav_logout')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
