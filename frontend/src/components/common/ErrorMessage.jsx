const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return <p role="alert">{message}</p>;
};

export default ErrorMessage;
