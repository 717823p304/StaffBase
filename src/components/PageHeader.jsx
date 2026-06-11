import { titleStyle, subtitleStyle, headerStyle } from '../styles/shared';

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div style={children ? headerStyle : undefined}>
      <div>
        <h1 style={titleStyle}>{title}</h1>
        <p style={subtitleStyle}>{subtitle}</p>
      </div>
      {children}
    </div>
  );
};

export default PageHeader;
