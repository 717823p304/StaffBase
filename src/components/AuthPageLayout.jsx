import { ArrowLeft } from 'lucide-react';
import { authPageStyle, authCardStyle, authBackLinkStyle } from '../styles/authStyles';

const AuthPageLayout = ({ children, showBackLink = true }) => {
  return (
    <div style={authPageStyle}>
      <div style={authCardStyle} className="glass-card animate-fade-in">
        {children}
        {showBackLink && (
          <a href="#/login" style={authBackLinkStyle}>
            <ArrowLeft size={14} />
            <span>Return to Sign In</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default AuthPageLayout;
