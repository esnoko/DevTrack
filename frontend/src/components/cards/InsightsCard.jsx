const InsightsCard = ({ insights }) => {
  if (!insights) {
    return null;
  }

  return (
    <section className="card">
      <h2 className="text-lg font-semibold text-primary">Insights</h2>
      <p className="mt-2 text-sm text-muted">{insights.summary}</p>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-primary">Strengths</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          {(insights.strengths || []).map((strength) => (
            <li key={strength}>• {strength}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-primary">Weaknesses</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          {(insights.weaknesses || []).map((weakness) => (
            <li key={weakness}>• {weakness}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 rounded-md border border-line bg-page px-3 py-2">
        <h3 className="text-sm font-semibold text-primary">Recommendation</h3>
        <p className="mt-1 text-sm text-muted">{insights.recommendation}</p>
      </div>
    </section>
  );
};

export default InsightsCard;
