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

export const setPitchProgress = (level) => {
  //console.log(`sp: ${JSON.stringify(level)}`);
  return {
    type: 'SET_PITCH_PROGRESS',
    level: level,
  };
};

export const setIntervalProgress = (level) => {
  //console.log(`si: ${JSON.stringify(level)}`);
  return {
    type: 'SET_INTERVAL_PROGRESS',
    level: level,
  };
};
