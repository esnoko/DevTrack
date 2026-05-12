const clampScore = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return 0;
  return Math.max(0, Math.min(100, numeric));
};

export const getScoreTone = (value) => {
  const score = clampScore(value);

  if (score <= 39) {
    return {
      text: '#991b1b',
      border: '#fecaca',
      background: '#fff5f5'
    };
  }

  if (score <= 69) {
    return {
      text: '#92400e',
      border: '#fde68a',
      background: '#fffbeb'
    };
  }

  return {
    text: '#065f46',
    border: '#a7f3d0',
    background: '#f0fdf9'
  };
};
