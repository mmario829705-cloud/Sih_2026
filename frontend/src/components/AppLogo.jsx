import React from 'react';
import './AppLogo.css';

export default function AppLogo({ 
  size = 38, 
  variant = 'mark', // 'mark' | 'full' | 'horizontal'
  className = '',
  showTagline = true 
}) {
  const logoSrc = '/logo.jpeg';

  const MarkImage = (
    <img 
      src={logoSrc} 
      alt="Aarogya Connect" 
      width={size} 
      height={size} 
      className="ac-logo-img"
      draggable={false}
    />
  );

  if (variant === 'mark') {
    return (
      <div className={`ac-logo-mark-wrap ${className}`} style={{ width: size, height: size }}>
        {MarkImage}
      </div>
    );
  }

  return (
    <div className={`ac-logo-full-wrap ${variant === 'horizontal' ? 'is-horizontal' : 'is-stacked'} ${className}`}>
      <div className="ac-logo-icon-box" style={{ width: size, height: size }}>
        {MarkImage}
      </div>
      <div className="ac-logo-text-box">
        <div className="ac-logo-brand-title">
          <span className="brand-word">AR</span>
          <span className="brand-o-leaf">
            <span className="o-char">O</span>
            <svg className="leaf-svg" viewBox="0 0 24 24" fill="#22C55E" width="10" height="10">
              <path d="M12 2C8 6 6 10 6 15C6 18.5 8.5 21 12 21C15.5 21 18 18.5 18 15C18 10 16 6 12 2Z" />
            </svg>
          </span>
          <span className="brand-word">GYA</span>
        </div>
        <div className="ac-logo-connections-sub">
          <span className="conn-line" />
          <span className="conn-text">CONNECTIONS</span>
          <span className="conn-line" />
        </div>
        {showTagline && (
          <div className="ac-logo-assist-tag">HEALTH ASSIST AI</div>
        )}
      </div>
    </div>
  );
}
