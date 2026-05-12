const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="card">
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
};

export default Loader;
