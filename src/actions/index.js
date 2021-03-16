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

export const setTriadMode = (mode) => {
  return {
    type: 'SET_TRIAD_MODE',
    mode: mode,
  };
};

export const setLeaderboardMode = (mode) => {
  return {
    type: 'SET_LEADERBOARD_MODE',
    mode: mode,
  };
};

export const setIntervalMode = (mode) => {
  return {
    type: 'SET_INTERVAL_MODE',
    mode: mode,
  };
};

export const manageGraph = (status) => {
  return {
    type: 'MANAGE_GRAPH',
    status: status,
  };
};

export const manageLogin = (status) => {
  return {
    type: 'MANAGE_LOGIN',
    status: status,
  };
};

export const manageSupport = (status) => {
  return {
    type: 'MANAGE_SUPPORT',
    status: status,
  };
};

export const clearSupportError = () => {
  return {
    type: 'CLEAR_SUPPORT_ERROR',
  };
};

export const setPitchProgress = (level) => {
  //console.log(`sp: ${JSON.stringify(level)}`);
  return {
    type: 'SET_PITCH_PROGRESS',
    level: level,
  };
};

export const setBassProgress = (level) => {
  //console.log(`sp: ${JSON.stringify(level)}`);
  return {
    type: 'SET_BASS_PROGRESS',
    level: level,
  };
};

export const setProgressionProgress = (level) => {
  //console.log(`sp: ${JSON.stringify(level)}`);
  return {
    type: 'SET_PROGRESSION_PROGRESS',
    level: level,
  };
};

export const setIntervalProgressBlocked = (level) => {
  //console.log(`si: ${JSON.stringify(level)}`);
  return {
    type: 'SET_INTERVAL_BLOCKED_PROGRESS',
    level: level,
  };
};

export const setIntervalProgressBroken = (level) => {
  //console.log(`si: ${JSON.stringify(level)}`);
  return {
    type: 'SET_INTERVAL_BROKEN_PROGRESS',
    level: level,
  };
};

export const setTriadsProgress = (level) => {
  //console.log(`si: ${JSON.stringify(level)}`);
  return {
    type: 'SET_TRIADS_PROGRESS',
    level: level,
  };
};

export const setTriadsProgressBlocked = (level) => {
  //console.log(`si: ${JSON.stringify(level)}`);
  return {
    type: 'SET_TRIADS_BLOCKED_PROGRESS',
    level: level,
  };
};

export const setTriadsProgressBroken = (level) => {
  //console.log(`si: ${JSON.stringify(level)}`);
  return {
    type: 'SET_TRIADS_BROKEN_PROGRESS',
    level: level,
  };
};

export const resetProgress = () => {
  return {
    type: 'RESET_PROGRESS',
  };
};

export const login = (username, password) => {
  return {
    type: 'LOGIN_USER',
    // username: username,
    // password: password,
  };
};

export const showLogin = () => {
  return {
    type: 'SHOW_LOGIN',
  };
};

export const setUsername = (username) => {
  return {
    type: 'SET_USERNAME',
    username: username,
  };
};

export const setUserID = (userid) => {
  return {
    type: 'SET_USERID',
    userid: userid,
  };
};

export const setDeviceUsername = (username) => {
  return {
    type: 'SET_DEVICE_USERNAME',
    username: username,
  };
};

export const logout = () => {
  //console.log('action authUser: ' + JSON.stringify(user));

  return {
    type: 'LOGOUT_USER',
  };
};
