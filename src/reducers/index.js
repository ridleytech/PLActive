const inititalState = {
  a: 1,
  level: 0,
  mode: 0,
  userid: 1,
  highestCompletedIntervalLevel: 0,
  highestCompletedPitchLevel: 0,
  isTrial: true,
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
        highestCompletedIntervalLevel:
          progressData.highestCompletedIntervalLevel,
        highestCompletedPitchLevel: progressData.highestCompletedPitchLevel,
      };

    case 'SET_PITCH_PROGRESS':
      console.log('action: ' + JSON.stringify(action));

      var completedLevel = parseInt(action.level.highestCompletedPitchLevel);
      var levelVal = state.highestCompletedPitchLevel;

      // console.log(`sp completed: ${completedLevel}
      // levelVal: ${levelVal}`);

      if (completedLevel > state.highestCompletedPitchLevel) {
        levelVal = completedLevel;
      }

      return {
        ...state,
        highestCompletedPitchLevel: levelVal,
      };

    case 'SET_INTERVAL_PROGRESS':
      console.log('action: ' + JSON.stringify(action));

      var completedLevel = parseInt(action.level.highestCompletedIntervalLevel);
      var levelVal = state.highestCompletedIntervalLevel;

      if (completedLevel > state.highestCompletedIntervalLevel) {
        levelVal = completedLevel;
      }

      return {
        ...state,
        highestCompletedIntervalLevel: levelVal,
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
