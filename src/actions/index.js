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

export const setIntervalProgress = (level) => {
  //console.log(`si: ${JSON.stringify(level)}`);
  return {
    type: 'SET_INTERVAL_PROGRESS',
    level: level,
  };
};

export const logout = () => {
  //console.log('action authUser: ' + JSON.stringify(user));

  return {
    type: 'LOGOUT_USER',
  };
};
