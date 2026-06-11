import { authErrorStyle } from '../styles/authStyles';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div style={authErrorStyle}>
      {message}
    </div>
  );
};

export default ErrorMessage;
