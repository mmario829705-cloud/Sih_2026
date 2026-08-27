import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import TriageBadge from '../components/TriageBadge';
import AppLogo from '../components/AppLogo';
import { 
  IconMessageSquare, 
  IconShieldCheck, 
  IconHospital, 
  IconClock, 
  IconChevronRight, 
  IconChevronDown, 
  IconSparkles, 
  IconUser, 
  IconHeartPulse,
  IconPhone,
  IconAlertTriangle,
  IconInfo,
  IconMapPin,
  IconExternalLink
} from '../components/Icons';
import './Home.css';

const LOGO_URL = '/src/assets/logo.jpeg';

const DEMO_CONVERSATIONS = {
  Telugu: [
    { sender: 'user', text: 'నాకు రెండు రోజులుగా తీవ్రమైన జ్వరం మరియు ఒళ్ళు నొప్పులు ఉన్నాయి.' },
    { sender: 'assistant', text: 'జ్వరం ఎంత తీవ్రంగా ఉంది (ఉష్ణోగ్రత)? మరియు శ్వాస తీసుకోవడంలో ఏమైనా ఇబ్బంది ఉందా?', triage: 'MODERATE' },
    { sender: 'user', text: 'జ్వరం 101°F ఉంది, శ్వాస సరిగానే ఉంది కానీ నీరసంగా ఉంది.' },
    { sender: 'assistant', text: 'ఇంట్లోనే విశ్రాంతి తీసుకుంటూ తగినంత ఓఆర్‌ఎస్/నీరు త్రాగండి. 2 రోజుల్లో తగ్గకపోతే సమీప PHC లో రక్త పరీక్ష చేయించుకోండి.', triage: 'LOW' },
  ],
  English: [
    { sender: 'user', text: "I have had high fever and body ache for the past two days." },
    { sender: 'assistant', text: 'What is the temperature of the fever, and is your breathing normal?', triage: 'MODERATE' },
    { sender: 'user', text: 'Temperature is around 101°F, breathing is fine but feeling weak.' },
    { sender: 'assistant', text: 'Rest at home with adequate fluids & ORS. If fever persists past 48 hours, visit your nearest PHC for a routine blood test.', triage: 'LOW' },
  ],
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState(null);

  const demo = DEMO_CONVERSATIONS[language] || DEMO_CONVERSATIONS.English;
  const primaryTo = isAuthenticated ? '/chat' : '/register';
  const phcTo = isAuthenticated ? '/phcs' : '/login';

  const toggleFaq = (index) => {
    setOpenFaq(prev => (prev === index ? null : index));
  };

  const faqs = [
    { q: t('faq1_q'), a: t('faq1_a') },
    { q: t('faq2_q'), a: t('faq2_a') },
    { q: t('faq3_q'), a: t('faq3_a') },
    { q: t('faq4_q'), a: t('faq4_a') },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" aria-label="Introduction">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-logo-wrap">
              <img src={LOGO_URL} alt="Aarogya Connect" className="hero-logo-img" />
            </div>
            <span className="eyebrow">{t('hero_eyebrow')}</span>
            <h1 className="hero-title">{t('hero_title')}</h1>
            <p className="hero-body">{t('hero_body')}</p>

            <div className="hero-actions">
              <Link to={primaryTo} className="btn btn-primary btn-lg">
                <IconSparkles size={20} />
                <span>{language === 'Telugu' ? 'లక్షణాల పరీక్ష ప్రారంభించండి' : 'Start Symptom Assessment'}</span>
                <IconChevronRight size={18} />
              </Link>
              <Link to={phcTo} className="btn btn-outline btn-lg">
                <IconHospital size={20} />
                <span>{language === 'Telugu' ? 'జిల్లా PHC కేంద్రాలు' : 'Find District PHCs'}</span>
              </Link>
            </div>

            <div className="hero-stats-row">
              <div className="hero-stat-pill">
                <IconShieldCheck size={16} />
                <span>26 AP Districts</span>
              </div>
              <div className="hero-stat-pill">
                <IconHeartPulse size={16} />
                <span>24/7 AI Triage</span>
              </div>
              <div className="hero-stat-pill">
                <IconPhone size={16} />
                <span>108/104 Helplines</span>
              </div>
              <div className="hero-stat-pill" style={{ background: 'var(--teal-soft)', borderColor: 'var(--teal-100)' }}>
                <span>🎙️ {language === 'Telugu' ? 'వాయిస్ మద్దతు (తెలుగు & English)' : 'Voice Enabled (Speak Symptoms)'}</span>
              </div>
            </div>

            <p className="hero-disclaimer">
              <span className="disclaimer-dot" aria-hidden="true" />
              {t('hero_disclaimer')}
            </p>
          </div>

          {/* Interactive Live Triage Demo Card */}
          <div className="hero-demo-wrapper">
            <div className="demo-card card">
              <div className="demo-card-header">
                <div className="demo-header-info">
                  <span className="demo-pulse-dot" aria-hidden="true" />
                  <span className="demo-header-title">Medi AI Demo</span>
                </div>
                <span className="demo-header-badge">AI Groq Triage</span>
              </div>

              <div className="demo-card-body" role="log" aria-label="Demonstration conversation">
                {demo.map((msg, i) => (
                  <div key={i} className={`demo-bubble-row ${msg.sender === 'user' ? 'right' : 'left'}`}>
                    <div className={`demo-bubble ${msg.sender === 'user' ? 'user' : 'assistant'}`}>
                      {msg.triage && (
                        <div className="demo-triage-badge">
                          <TriageBadge level={msg.triage} />
                        </div>
                      )}
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="demo-card-footer">
                <Link to={primaryTo} className="demo-cta-link">
                  <span>{language === 'Telugu' ? 'Medi AI తో పూర్తి చాట్ ప్రారంభించండి' : 'Start Full Chat with Medi AI'}</span>
                  <IconChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK BROWSE ACTION PORTAL BUTTONS */}
      <section className="quick-portal-section" aria-label="Quick Action Buttons">
        <div className="container">
          <div className="quick-portal-grid">
            {/* Action 1: Symptom Assessment */}
            <Link to={primaryTo} className="quick-portal-card card card-elevated action-card-symptom">
              <div className="quick-portal-icon-wrap icon-teal">
                <IconSparkles size={28} />
              </div>
              <div className="quick-portal-info">
                <h3>{language === 'Telugu' ? 'లక్షణాల పరీక్ష' : 'Symptom Assessment'}</h3>
                <p>{language === 'Telugu' ? 'AI మార్గదర్శకంతో మీ ఆరోగ్య సమస్యలను తనిఖీ చేయండి' : 'Check symptoms with Medi AI in Telugu or English'}</p>
              </div>
              <span className="quick-portal-btn-label">
                <span>{language === 'Telugu' ? 'పరీక్ష ప్రారంభించండి' : 'Start Check'}</span>
                <IconChevronRight size={16} />
              </span>
            </Link>

            {/* Action 2: Find PHC District-Wise */}
            <Link to={phcTo} className="quick-portal-card card card-elevated action-card-phc">
              <div className="quick-portal-icon-wrap icon-gold">
                <IconHospital size={28} />
              </div>
              <div className="quick-portal-info">
                <h3>{language === 'Telugu' ? 'జిల్లా వారీగా PHC లు' : 'Find PHCs District-Wise'}</h3>
                <p>{language === 'Telugu' ? 'ఆంధ్రప్రదేశ్ 26 జిల్లాల ఆరోగ్య కేంద్రాల వివరాలు' : 'Browse 96+ AP hospitals & PHC contact directory'}</p>
              </div>
              <span className="quick-portal-btn-label">
                <span>{language === 'Telugu' ? 'కేంద్రాలను చూడండి' : 'Browse Directory'}</span>
                <IconChevronRight size={16} />
              </span>
            </Link>

            {/* Action 3: Emergency Data */}
            <a href="#emergency-data" className="quick-portal-card card card-elevated action-card-emergency">
              <div className="quick-portal-icon-wrap icon-brick">
                <IconPhone size={28} />
              </div>
              <div className="quick-portal-info">
                <h3>{language === 'Telugu' ? 'అత్యవసర సమాచారం' : 'Emergency Data & Help'}</h3>
                <p>{language === 'Telugu' ? '108 అంబులెన్స్, 104 హెల్ప్‌లైన్ మరియు అత్యవసర మార్గదర్శకాలు' : 'Direct dial 108, 104, 112 and red-flag guides'}</p>
              </div>
              <span className="quick-portal-btn-label">
                <span>{language === 'Telugu' ? 'అత్యవసర నంబర్లు' : 'View Helplines'}</span>
                <IconChevronRight size={16} />
              </span>
            </a>

            {/* Action 4: About Us & Help */}
            <a href="#about-us" className="quick-portal-card card card-elevated action-card-about">
              <div className="quick-portal-icon-wrap icon-sage">
                <IconInfo size={28} />
              </div>
              <div className="quick-portal-info">
                <h3>{language === 'Telugu' ? 'మా గురించి & సహాయం' : 'About Us & Mission'}</h3>
                <p>{language === 'Telugu' ? 'స్మార్ట్ ఇండియా హ్యాకథాన్ 2026 గ్రామీణ ఆరోగ్య విజన్' : 'Rural health innovation & ASHA volunteer platform'}</p>
              </div>
              <span className="quick-portal-btn-label">
                <span>{language === 'Telugu' ? 'వివరాలు చదవండి' : 'Learn More'}</span>
                <IconChevronRight size={16} />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Emergency Helpline & Red-Flag Data Section */}
      <section className="section" id="emergency-data" aria-label="Emergency Care & Data">
        <div className="container">
          <div className="emergency-hub-card card card-elevated">
            <div className="emergency-hub-header">
              <div className="emergency-icon-wrap" aria-hidden="true">
                <IconAlertTriangle size={32} />
              </div>
              <div>
                <span className="eyebrow" style={{ color: 'var(--brick-700)' }}>
                  {language === 'Telugu' ? '24x7 తక్షణ అత్యవసర స్పందన' : '24x7 Critical Medical Response'}
                </span>
                <h2 style={{ color: 'var(--brick-800)', marginTop: 4 }}>
                  {language === 'Telugu' ? 'అత్యవసర సమాచారం & హెల్ప్‌లైన్ నంబర్లు' : 'Emergency Care & Helpline Directory'}
                </h2>
                <p style={{ color: 'var(--ink-soft)' }}>
                  {language === 'Telugu' 
                    ? 'తీవ్రమైన ప్రమాదాలు, గుండె సమస్యలు లేదా శ్వాస సమస్యల సమయాల్లో ఆలస్యం చేయకుండా క్రింది నంబర్లకు వెంటనే కాల్ చేయండి.'
                    : 'In case of severe acute emergencies, do not wait for chat guidance. Dial state medical response immediately.'}
                </p>
              </div>
            </div>

            <div className="emergency-hub-grid">
              <div className="emergency-contact-box card">
                <div className="emergency-num-title">108</div>
                <div className="emergency-num-sub">{language === 'Telugu' ? 'అత్యవసర అంబులెన్స్ సేవ' : 'Emergency Ambulance Response'}</div>
                <p>{language === 'Telugu' ? 'ఉచిత అంబులెన్స్ మరియు అత్యవసర ఆసుపత్రి రవాణా.' : 'Free paramedic dispatch and transport to nearest hospital.'}</p>
                <a href="tel:108" className="btn btn-danger btn-block">
                  <IconPhone size={18} />
                  <span>Call 108 (Ambulance)</span>
                </a>
              </div>

              <div className="emergency-contact-box card">
                <div className="emergency-num-title">104</div>
                <div className="emergency-num-sub">{language === 'Telugu' ? 'వైద్య సలహా హెల్ప్‌లైన్' : 'AP Health Advice & Doctor Advice'}</div>
                <p>{language === 'Telugu' ? 'ఆంధ్రప్రదేశ్ ప్రభుత్వ ఉచిత వైద్య సలహా మరియు సమాచారం.' : 'Free 24x7 medical counseling and government hospital information.'}</p>
                <a href="tel:104" className="btn btn-outline btn-block">
                  <IconPhone size={18} />
                  <span>Call 104 (Health Advice)</span>
                </a>
              </div>

              <div className="emergency-contact-box card">
                <div className="emergency-num-title">112</div>
                <div className="emergency-num-sub">{language === 'Telugu' ? 'జాతీయ అత్యవసర నంబర్' : 'All-in-One National Emergency'}</div>
                <p>{language === 'Telugu' ? 'పోలీస్, ఫైర్, మరియు అత్యవసర రక్షణ సమన్వయం.' : 'Unified national emergency helpline for all critical emergencies.'}</p>
                <a href="tel:112" className="btn btn-ghost btn-block">
                  <IconPhone size={18} />
                  <span>Call 112 (National)</span>
                </a>
              </div>
            </div>

            {/* Red Flag Symptoms Checklist */}
            <div className="red-flag-checklist card">
              <h4 style={{ color: 'var(--brick-700)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <IconAlertTriangle size={18} />
                <span>{language === 'Telugu' ? 'తక్షణ ఆసుపత్రికి వెళ్లాల్సిన అత్యవసర సంకేతాలు (Red Flags)' : 'Critical Red-Flag Symptoms Requiring Emergency Care'}</span>
              </h4>
              <div className="red-flag-pills">
                <span className="red-pill">{language === 'Telugu' ? 'ఛాతీలో తీవ్రమైన నొప్పి లేదా ఒత్తిడి' : 'Severe Chest Pain / Pressure'}</span>
                <span className="red-pill">{language === 'Telugu' ? 'తీవ్రమైన శ్వాస ఆడకపోవడం' : 'Severe Shortness of Breath'}</span>
                <span className="red-pill">{language === 'Telugu' ? 'స్పృహ కోల్పోవడం / మూర్ఛ' : 'Sudden Loss of Consciousness'}</span>
                <span className="red-pill">{language === 'Telugu' ? 'ఆగని తీవ్ర రక్తస్రావం' : 'Uncontrolled Bleeding'}</span>
                <span className="red-pill">{language === 'Telugu' ? 'పాము కాటు లేదా విషప్రయోగం' : 'Snake Bite / Poison Ingestion'}</span>
                <span className="red-pill">{language === 'Telugu' ? 'ముఖం లేదా ఒక వైపు పక్షవాతం' : 'Facial Droop / Stroke Signs'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="section section-alt" id="features" aria-label="Key Features">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{t('feature_eyebrow')}</span>
            <h2 className="section-title">{t('feature_title')}</h2>
          </div>

          <div className="feature-grid">
            <div className="card feature-card card-elevated">
              <div className="feature-icon feature-icon-teal" aria-hidden="true">
                <AppLogo size={32} variant="mark" />
              </div>
              <h3>{t('feature1_title')}</h3>
              <p>{t('feature1_body')}</p>
            </div>

            <div className="card feature-card card-elevated">
              <div className="feature-icon feature-icon-gold" aria-hidden="true">
                <IconShieldCheck size={26} />
              </div>
              <h3>{t('feature2_title')}</h3>
              <p>{t('feature2_body')}</p>
            </div>

            <div className="card feature-card card-elevated">
              <div className="feature-icon feature-icon-sage" aria-hidden="true">
                <IconHospital size={26} />
              </div>
              <h3>{t('feature3_title')}</h3>
              <p>{t('feature3_body')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" id="how-it-works" aria-label="How It Works">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{t('how_eyebrow')}</span>
            <h2 className="section-title">{t('how_title')}</h2>
          </div>

          <div className="steps-grid">
            <div className="card step-card">
              <div className="step-badge">01</div>
              <div className="step-icon-wrap" aria-hidden="true">
                <IconMessageSquare size={24} />
              </div>
              <h3>{t('how1_title')}</h3>
              <p>{t('how1_body')}</p>
            </div>

            <div className="card step-card">
              <div className="step-badge">02</div>
              <div className="step-icon-wrap" aria-hidden="true">
                <IconSparkles size={24} />
              </div>
              <h3>{t('how2_title')}</h3>
              <p>{t('how2_body')}</p>
            </div>

            <div className="card step-card">
              <div className="step-badge">03</div>
              <div className="step-icon-wrap" aria-hidden="true">
                <IconHospital size={24} />
              </div>
              <h3>{t('how3_title')}</h3>
              <p>{t('how3_body')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us & SIH Mission Section */}
      <section className="section section-alt" id="about-us" aria-label="About Us">
        <div className="container">
          <div className="asha-spotlight card">
            <div className="asha-copy">
              <span className="eyebrow">About Us · Smart India Hackathon 2026</span>
              <h2>{language === 'Telugu' ? 'గ్రామీణ ఆంధ్రప్రదేశ్ కోసం నైతిక AI ఆరోగ్య సంరక్షణ' : 'Empowering Rural Andhra Pradesh with AI Health Triage'}</h2>
              <p>
                {language === 'Telugu'
                  ? 'ఆరోగ్య కనెక్ట్ (Aarogya Connect) ప్రాజెక్ట్ గ్రామీణ ప్రాంత ప్రజలు, ఆశా కార్యకర్తలు మరియు ప్రాథమిక ఆరోగ్య కేంద్రాల (PHC) మధ్య సాంకేతిక వారధిగా రూపొందించబడింది. ఇది లక్షణాల తీవ్రతను అంచనా వేసి సరైన ప్రభుత్వ ఆసుపత్రికి మార్గదర్శనం చేస్తుంది.'
                  : 'Aarogya Connect is engineered to bridge the primary healthcare gap across 26 districts of Andhra Pradesh. Built with bilingual Groq AI intelligence, emergency clinical rules, and an open directory of government Primary Health Centres.'}
              </p>
              <div className="asha-points">
                <div className="asha-point">
                  <IconShieldCheck size={18} />
                  <span>{language === 'Telugu' ? 'తెలుగు & ఇంగ్లీష్ ద్విభాషా మద్దతు' : 'Bilingual Telugu & English AI Triage'}</span>
                </div>
                <div className="asha-point">
                  <IconHospital size={18} />
                  <span>{language === 'Telugu' ? '26 జిల్లాల పూర్తి PHC కేంద్రాల సమాచారం' : '96+ AP PHC, CHC & District Hospitals Directory'}</span>
                </div>
                <div className="asha-point">
                  <IconHeartPulse size={18} />
                  <span>{language === 'Telugu' ? '108 మరియు 104 అత్యవసర సేవల అనుసంధానం' : 'Direct Emergency 108 / 104 Integration'}</span>
                </div>
              </div>
            </div>
            <div className="asha-action-box">
              <div className="asha-box-inner card">
                <IconHospital size={40} style={{ color: 'var(--teal)' }} />
                <h4>{language === 'Telugu' ? 'జిల్లా PHC కేంద్రాల డైరెక్టరీ' : 'Explore AP PHC Directory'}</h4>
                <p>{language === 'Telugu' ? 'మీ జిల్లాలోని ప్రాథమిక ఆరోగ్య కేంద్రాలు & ఏరియా ఆసుపత్రుల వివరాలను పొందండి.' : 'Access contact details and facility types across Andhra Pradesh.'}</p>
                <Link to={phcTo} className="btn btn-primary btn-block">
                  <span>{t('nav_phcs')}</span>
                  <IconChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" id="faq" aria-label="Frequently Asked Questions">
        <div className="container faq-container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <span className="eyebrow">{t('faq_eyebrow')}</span>
            <h2 className="section-title" style={{ margin: '14px auto 36px' }}>{t('faq_title')}</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item card ${openFaq === idx ? 'is-open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  <span className="faq-toggle-icon">
                    {openFaq === idx ? <IconChevronDown size={20} /> : <IconChevronRight size={20} />}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Box */}
      <section className="section" aria-label="Call to action">
        <div className="container">
          <div className="cta-box card">
            <div className="cta-content">
              <span className="eyebrow" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#fff' }}>
                Smart India Hackathon 2026
              </span>
              <h2 className="cta-title">{t('cta_title')}</h2>
              <p className="cta-body">{t('cta_body')}</p>
            </div>
            <Link to={primaryTo} className="btn btn-gold btn-lg">
              <span>{t('cta_button')}</span>
              <IconChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Comprehensive Footer */}
      <footer className="home-footer" role="contentinfo">
        <div className="container footer-inner">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <AppLogo size={36} variant="mark" />
              <span className="footer-title">{t('appName')}</span>
            </div>
            <p className="footer-tagline">{t('tagline')}</p>
            <p className="footer-credit">{t('footer_note')}</p>
          </div>

          <div className="footer-links-col">
            <h4>{t('footer_quick_links')}</h4>
            <ul>
              <li><Link to="/">{t('common_back')}</Link></li>
              <li><Link to={primaryTo}>{t('nav_chat')}</Link></li>
              <li><Link to={phcTo}>{t('nav_phcs')}</Link></li>
              <li><a href="#emergency-data">{language === 'Telugu' ? 'అత్యవసర సమాచారం (108)' : 'Emergency Data (108)'}</a></li>
              <li><a href="#about-us">{language === 'Telugu' ? 'మా గురించి' : 'About Us'}</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Andhra Pradesh Health Portals</h4>
            <ul>
              <li>
                <a href="https://hmfw.ap.gov.in" target="_blank" rel="noopener noreferrer">
                  <span>{t('footer_ap_health')}</span>
                  <IconExternalLink size={13} />
                </a>
              </li>
              <li>
                <a href="https://ysraarogyasri.ap.gov.in" target="_blank" rel="noopener noreferrer">
                  <span>{t('footer_aarogyasri')}</span>
                  <IconExternalLink size={13} />
                </a>
              </li>
              <li>
                <a href="tel:108">
                  <span>108 Ambulance Service</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
