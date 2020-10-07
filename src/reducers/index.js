const inititalState = {
  a: 1,
  level: 0,
  mode: 0,
  userid: 1,
  completedIntervalLevels: [1, 2],
  completedPitchLevels: [1],
  isTrial: false,
};

export default (state = inititalState, action) => {
  switch (action.type) {
    case 'GET_QUESTION':
      return {
        ...state,
        stuff: 1,
      };

    case 'SET_LEVEL':
      return {
        ...state,
        level: action.level,
      };

    case 'SET_MODE':
      return {
        ...state,
        mode: action.mode,
      };

    case 'PROGRESS_SAVED':
      return {
        ...state,
      };

    default:
      return state;
  }
};
