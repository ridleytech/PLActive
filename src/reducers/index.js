const inititalState = {
  a: 1,
  level: 0,
};

export default (state = inititalState, action) => {
  switch (action.type) {
    case 'GET_QUESTION':
      return {
        ...state,
        stuff: 1,
      };

    case 'SET_LEVEL':
      console.log('set level: ' + action.level);
      return {
        ...state,
        level: action.level,
      };

    default:
      return state;
  }
};
