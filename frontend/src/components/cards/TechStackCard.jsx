import { useMemo } from 'react';
import { getScoreTone } from '../../utils/scoreTone';

const EXPERTISE_COLORS = {
  'Expert': { bg: '#065f46', text: '#ecfdf5', border: '#059669' },
  'Proficient': { bg: '#1e40af', text: '#eff6ff', border: '#2563eb' },
  'Experienced': { bg: '#b45309', text: '#fffbeb', border: '#d97706' },
  'Beginner': { bg: '#6366f1', text: '#eef2ff', border: '#818cf8' }
};

const TechStackCard = ({ techStack = [] }) => {
  // Group tech by category for easier visualization
  const techByCategory = useMemo(() => {
    const grouped = {};
    techStack.forEach((tech) => {
      const cat = tech.category || 'Other';
      if (!grouped[cat]) {
        grouped[cat] = [];
      }
      grouped[cat].push(tech);
    });
    return grouped;
  }, [techStack]);

  if (!techStack || techStack.length === 0) {
    return (
      <section className="card">
        <h2 className="text-base font-semibold tracking-tight text-primary">Tech Stack</h2>
        <p className="mt-2 text-sm text-muted">
          No framework signals detected. This profile may use languages without matching repo names or descriptions.
        </p>
      </section>
    );
  }

  // Get top 3 tech for headline
  const topTechs = techStack.slice(0, 3);
  const topHeadline = topTechs.map((t) => t.tech).join(' • ');

  return (
    <section className="card">
      <div>
        <h2 className="text-base font-semibold tracking-tight text-primary">Tech Stack</h2>
        <p className="mt-0.5 text-xs text-muted">
          Specializations detected from {techStack.length} technologies
        </p>
      </div>

      {/* Top 3 headline */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-gradient-to-r from-slate-50 to-white px-3.5 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600">Primary Stack</p>
        <p className="mt-1.5 line-clamp-2 text-sm font-medium text-primary">{topHeadline}</p>
      </div>

      {/* Tech organized by category */}
      <div className="mt-5 space-y-4">
        {Object.entries(techByCategory).map(([category, techs]) => (
          <div key={category}>
            <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-gray-700">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {techs.map((tech) => {
                const colors = EXPERTISE_COLORS[tech.expertise] || EXPERTISE_COLORS['Beginner'];
                return (
                  <div
                    key={tech.tech}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-shadow hover:shadow-md"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.text,
                      border: `1px solid ${colors.border}`
                    }}
                    title={`${tech.count} repo(s) • ${tech.expertise}`}
                  >
                    <span>{tech.tech}</span>
                    <span className="inline-block h-1 w-1 rounded-full bg-white opacity-60"></span>
                    <span className="text-xs opacity-80">{tech.expertise}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Expertise legend */}
      <div className="mt-5 rounded-lg bg-gray-50 px-3 py-2.5">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-gray-600">
          Expertise Levels
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
          {Object.entries(EXPERTISE_COLORS).map(([level, colors]) => (
            <div key={level} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded"
                style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
              ></div>
              <span className="text-gray-600">{level}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total tech count */}
      <div className="mt-4 border-t border-gray-200 pt-3 text-center">
        <p className="text-xs text-muted">
          <span className="font-semibold text-primary">{techStack.length}</span> technologies detected
        </p>
      </div>
    </section>
  );
};

export default TechStackCard;
