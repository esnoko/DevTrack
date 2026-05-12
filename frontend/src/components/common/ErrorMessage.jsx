const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className="flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
      style={{ borderColor: '#fecaca', backgroundColor: '#fff5f5', color: '#991b1b' }}
      role="alert"
    >
      <span style={{ fontSize: '1rem', lineHeight: 1.4 }}>&#9888;</span>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
