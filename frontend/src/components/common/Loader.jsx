const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
        style={{ borderColor: 'var(--color-line)', borderTopColor: 'var(--color-accent)' }}
        role="status"
        aria-label="loading"
      />
      <p className="mt-4 text-sm text-muted">{message}</p>
    </div>
  );
};

export default Loader;
