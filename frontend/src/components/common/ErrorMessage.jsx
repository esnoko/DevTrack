const RATE_LIMIT_HINT =
  'The server hit GitHub\'s API rate limit. Try again in a minute, or search a different username.';

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  const isRateLimit = message.toLowerCase().includes('rate limit');
  const displayMessage = isRateLimit ? RATE_LIMIT_HINT : message;

  return (
    <div
      className="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
      style={{ borderColor: '#fecaca', backgroundColor: '#fff5f5', color: '#991b1b' }}
      role="alert"
    >
      <span style={{ fontSize: '1rem', lineHeight: 1.4 }}>&#9888;</span>
      <p>{displayMessage}</p>
    </div>
  );
};

export default ErrorMessage;
