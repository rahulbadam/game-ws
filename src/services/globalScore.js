// Global score service using localStorage
const SCORE_KEY = 'gameGlobalScore';

export const getGlobalScore = () => {
  const score = localStorage.getItem(SCORE_KEY);
  return score ? parseInt(score, 10) : 0;
};

export const updateGlobalScore = (points) => {
  const currentScore = getGlobalScore();
  const newScore = currentScore + points;
  localStorage.setItem(SCORE_KEY, newScore.toString());
  return newScore;
};

export const resetGlobalScore = () => {
  localStorage.setItem(SCORE_KEY, '0');
  return 0;
};
