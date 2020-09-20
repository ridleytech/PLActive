export const setLevel = (level) => {
  console.log('try level');
  return {
    type: 'SET_LEVEL',
    level: level,
  };
};
