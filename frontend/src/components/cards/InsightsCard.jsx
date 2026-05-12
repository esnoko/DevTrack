const InsightsCard = ({ insights }) => {
  if (!insights) {
    return null;
  }

  return (
    <section className="card">
      <h2 className="text-base font-semibold tracking-tight text-primary">Insights</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{insights.summary}</p>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-widest" style={{ color: '#065f46' }}>
            Strengths
          </h3>
          <div className="flex flex-col gap-2">
            {(insights.strengths || []).map((item) => (
              <div key={item} className="insight-tag insight-tag-success">
                <span style={{ color: 'var(--color-success)', fontSize: '0.6rem' }}>&#9679;</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-widest" style={{ color: '#991b1b' }}>
            Areas to Improve
          </h3>
          <div className="flex flex-col gap-2">
            {(insights.weaknesses || []).map((item) => (
              <div key={item} className="insight-tag insight-tag-danger">
                <span style={{ color: 'var(--color-danger)', fontSize: '0.6rem' }}>&#9679;</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {insights.recommendation && (
        <div className="mt-5 rounded-lg border-l-4 px-4 py-3 text-sm" style={{ borderLeftColor: 'var(--color-accent)', backgroundColor: '#eff6ff' }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-accent)' }}>Recommendation</p>
          <p className="mt-1 leading-relaxed text-primary">{insights.recommendation}</p>
        </div>
      )}
    </section>
  );
};

export default InsightsCard;
