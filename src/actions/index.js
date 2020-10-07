export const setLevel = (level) => {
  return {
    type: 'SET_LEVEL',
    level: level,
  };
};

export const setMode = (mode) => {
  return {
    type: 'SET_MODE',
    mode: mode,
  };
};

export const setProgress = (obj) => {
  return {
    type: 'SET_PROGRESS',
    levels: obj,
  };
};
