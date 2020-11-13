const inititalState = {
  a: 1,
  level: 0,
  mode: 0,
  userid: 1,
  highestCompletedIntervalLevel: 0,
  highestCompletedPitchLevel: 0,
  isTrial: false,
  loggedIn: false,
  graphStarted: false,
  loginEnabled: true,
  loginError: false,
  supportSent: false,
  supportEnabled: true,
  supportError: false,
};

export default (state = inititalState, action) => {
  switch (action.type) {
    case 'GET_QUESTION':
      return {
        ...state,
        stuff: 1,
      };
    case 'AUTH_DATA':
      let loginData = action.payload.data;

      console.log(`loginData: ${JSON.stringify(loginData)}`);
      var loginStatus = false;
      var loginError1 = false;

      if (loginData.hasAccount === true) {
        loginStatus = true;
        loginError1 = false;
      } else {
        loginError1 = true;
      }

      console.log(`status: ${loginStatus}`);

      return {
        ...state,
        loggedIn: loginStatus,
        loginEnabled: true,
        loginError: loginError1,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        loginError: true,
        loginEnabled: true,
      };

    case 'SUPPORT_DATA':
      let supportData = action.payload.data;

      console.log(`support data: ${JSON.stringify(supportData)}`);
      var supportStatus = false;
      var supportError1 = false;

      if (loginData.hasAccount === 1) {
        supportStatus = true;
        supportError1 = false;
      } else {
        supportError1 = true;
      }

      console.log(`status: ${loginStatus}`);

      return {
        ...state,
        supportSent: supportStatus,
        supportEnabled: true,
        supportError: supportError1,
      };

    case 'SUPPORT_ERROR':
      return {
        ...state,
        supportError: true,
        supportEnabled: true,
      };

    case 'CLEAR_SUPPORT_ERROR':
      console.log('CLEAR_SUPPORT_ERROR');
      return {
        ...state,
        supportError: false,
      };

    case 'MANAGE_LOGIN':
      return {
        ...state,
        loginEnabled: action.status,
      };

    case 'MANAGE_SUPPORT':
      return {
        ...state,
        supportEnabled: action.status,
      };

    case 'LOGOUT_USER':
      console.log('logout redux');
      return {
        ...state,
        loggedIn: false,
      };

    case 'MANAGE_GRAPH':
      console.log('MANAGE_GRAPH: ' + JSON.stringify(action));

      return {
        ...state,
        graphStarted: action.status,
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
