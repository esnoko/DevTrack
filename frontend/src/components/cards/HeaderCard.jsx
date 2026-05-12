const HeaderCard = ({ username }) => {
  return (
    <header className="card">
      <p className="text-sm text-muted">Developer Dashboard</p>
      <h1 className="mt-1 text-2xl font-semibold text-primary">{username || 'GitHub Profile'}</h1>
      <p className="mt-2 text-sm text-muted">
        Analytics are computed by backend and rendered here for quick review.
      </p>
    </header>
  );
};

export default HeaderCard;
