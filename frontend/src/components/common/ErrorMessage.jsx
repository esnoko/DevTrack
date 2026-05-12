const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="card border-red-300 bg-red-50" role="alert">
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
};

export default ErrorMessage;
