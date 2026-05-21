/**
 * Detects technology stack from repository data
 * Identifies frameworks, libraries, and tooling specializations
 */

// Framework detection patterns by category
const FRAMEWORK_PATTERNS = {
  // Frontend Frameworks
  'React': {
    keywords: ['react', 'react-dom', '@react', 'next.js', 'next'],
    category: 'Frontend',
    tier: 1
  },
  'Vue': {
    keywords: ['vue', 'vuex', 'vue-router', 'nuxt'],
    category: 'Frontend',
    tier: 1
  },
  'Angular': {
    keywords: ['angular', '@angular', 'ng-', '@ngrx'],
    category: 'Frontend',
    tier: 1
  },
  'Svelte': {
    keywords: ['svelte', 'sveltekit'],
    category: 'Frontend',
    tier: 2
  },

  // Backend Frameworks
  'Node.js/Express': {
    keywords: ['express', 'fastify', 'koa', 'hapi', 'restify'],
    category: 'Backend',
    tier: 1
  },
  'Django': {
    keywords: ['django', 'djangorestframework', 'drf'],
    category: 'Backend',
    tier: 1
  },
  'FastAPI': {
    keywords: ['fastapi', 'starlette', 'uvicorn'],
    category: 'Backend',
    tier: 1
  },
  'Spring': {
    keywords: ['spring', 'spring-boot', 'spring-security'],
    category: 'Backend',
    tier: 1
  },
  'Rails': {
    keywords: ['rails', 'actionpack', 'activerecord'],
    category: 'Backend',
    tier: 1
  },
  'ASP.NET': {
    keywords: ['aspnet', 'asp.net-core', 'entityframework'],
    category: 'Backend',
    tier: 1
  },

  // Mobile
  'React Native': {
    keywords: ['react-native', 'react native'],
    category: 'Mobile',
    tier: 1
  },
  'Flutter': {
    keywords: ['flutter', 'dart'],
    category: 'Mobile',
    tier: 1
  },

  // Data & ML
  'TensorFlow': {
    keywords: ['tensorflow', 'tf-'],
    category: 'ML/Data',
    tier: 1
  },
  'PyTorch': {
    keywords: ['torch', 'pytorch'],
    category: 'ML/Data',
    tier: 1
  },
  'Pandas': {
    keywords: ['pandas', 'numpy', 'scipy'],
    category: 'ML/Data',
    tier: 1
  },
  'Scikit-learn': {
    keywords: ['scikit-learn', 'sklearn'],
    category: 'ML/Data',
    tier: 2
  },

  // DevOps & Infrastructure
  'Docker': {
    keywords: ['docker', 'dockerfile', 'docker-compose'],
    category: 'DevOps',
    tier: 1
  },
  'Kubernetes': {
    keywords: ['kubernetes', 'k8s', 'helm', 'kubectl'],
    category: 'DevOps',
    tier: 1
  },
  'Terraform': {
    keywords: ['terraform', 'hcl'],
    category: 'DevOps',
    tier: 1
  },
  'AWS': {
    keywords: ['aws', 'aws-sdk', 'boto3', 'amazon'],
    category: 'Cloud',
    tier: 1
  },
  'GCP': {
    keywords: ['google-cloud', 'gcp', 'firestore'],
    category: 'Cloud',
    tier: 1
  },

  // Databases
  'PostgreSQL': {
    keywords: ['postgres', 'postgresql', 'pg', 'psycopg'],
    category: 'Database',
    tier: 1
  },
  'MongoDB': {
    keywords: ['mongodb', 'mongoose', 'mongosh'],
    category: 'Database',
    tier: 1
  },
  'Redis': {
    keywords: ['redis', 'ioredis'],
    category: 'Database',
    tier: 1
  },

  // Testing & Quality
  'Jest': {
    keywords: ['jest'],
    category: 'Testing',
    tier: 1
  },
  'Pytest': {
    keywords: ['pytest'],
    category: 'Testing',
    tier: 1
  },
  'RSpec': {
    keywords: ['rspec'],
    category: 'Testing',
    tier: 1
  }
};

/**
 * Analyzes repositories for framework mentions and dependencies
 * Returns a tech stack profile with expertise levels
 */
const buildTechStack = (repos) => {
  if (!repos || repos.length === 0) {
    return [];
  }

  const techFrequency = {};
  const techRepos = {};

  // Analyze language and repository names
  repos.forEach((repo) => {
    // Check repo language
    if (repo.language) {
      const lang = repo.language.toLowerCase();
      updateTech(lang, repo, techFrequency, techRepos);
    }

    // Check repo name and description for framework hints
    const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
    Object.entries(FRAMEWORK_PATTERNS).forEach(([framework, { keywords }]) => {
      const matches = keywords.some((kw) => text.includes(kw.toLowerCase()));
      if (matches) {
        updateTech(framework, repo, techFrequency, techRepos);
      }
    });
  });

  // Convert to array and sort by frequency
  const techStack = Object.entries(techFrequency)
    .map(([tech, count]) => {
      const framework = FRAMEWORK_PATTERNS[tech];
      const category = framework ? framework.category : categorizeByLanguage(tech);
      const expertise = scoreExpertise(count, repos.length);

      return {
        tech,
        category,
        count,
        percentage: Number(((count / repos.length) * 100).toFixed(1)),
        expertise,
        repos: techRepos[tech] || []
      };
    })
    .sort((a, b) => {
      // Sort by frequency, then by tier (known frameworks first)
      if (b.count !== a.count) return b.count - a.count;

      const aTier = FRAMEWORK_PATTERNS[a.tech]?.tier ?? 999;
      const bTier = FRAMEWORK_PATTERNS[b.tech]?.tier ?? 999;
      return aTier - bTier;
    });

  return techStack;
};

const updateTech = (tech, repo, techFrequency, techRepos) => {
  if (!techFrequency[tech]) {
    techFrequency[tech] = 0;
    techRepos[tech] = [];
  }
  techFrequency[tech] += 1;
  techRepos[tech].push({
    name: repo.name,
    url: repo.url
  });
};

const categorizeByLanguage = (lang) => {
  const langLower = lang.toLowerCase();

  if (['javascript', 'typescript', 'nodejs', 'node.js'].includes(langLower)) {
    return 'Backend/Frontend';
  }
  if (['python', 'py'].includes(langLower)) {
    return 'Backend/Data';
  }
  if (['java', 'kotlin', 'scala'].includes(langLower)) {
    return 'Backend';
  }
  if (['go', 'golang', 'rust'].includes(langLower)) {
    return 'Systems';
  }
  if (['c++', 'c#', 'csharp'].includes(langLower)) {
    return 'Backend';
  }
  if (['ruby', 'rb'].includes(langLower)) {
    return 'Backend';
  }
  if (['php'].includes(langLower)) {
    return 'Backend';
  }
  if (['html', 'css', 'scss', 'sass'].includes(langLower)) {
    return 'Frontend';
  }

  return 'Other';
};

/**
 * Score expertise based on frequency
 * The more repos in a language/framework, the deeper the expertise
 */
const scoreExpertise = (count, totalRepos) => {
  const ratio = count / totalRepos;

  if (ratio >= 0.4) return 'Expert';
  if (ratio >= 0.2) return 'Proficient';
  if (ratio >= 0.1) return 'Experienced';
  return 'Beginner';
};

module.exports = {
  buildTechStack
};
