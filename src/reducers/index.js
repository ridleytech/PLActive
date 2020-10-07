const inititalState = {
  a: 1,
  level: 0,
  mode: 0,
  userid: 1,
  lastCompletedIntervalLevel: 2,
  lastCompletedPitchLevel: 1,
  isTrial: false,
};

export default (state = inititalState, action) => {
  switch (action.type) {
    case 'GET_QUESTION':
      return {
        ...state,
        stuff: 1,
      };
    case 'PROGRESS_INFO':
      let progressData = action.payload.progressData;

      console.log(`progressData: ${progressData}`);

      return {
        ...state,
        lastCompletedIntervalLevel: progressData.lastCompletedIntervalLevel,
        lastCompletedPitchLevel: progressData.lastCompletedPitchLevel,
      };

    case 'SET_PROGRESS':
      console.log('action: ' + JSON.stringify(action));
      return {
        ...state,
        lastCompletedIntervalLevel: parseInt(
          action.levels.lastCompletedIntervalLevel,
        ),
        lastCompletedPitchLevel: parseInt(
          action.levels.lastCompletedPitchLevel,
        ),
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
