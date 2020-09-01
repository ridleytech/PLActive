const inititalState = {
  a: 1,
};

export default (state = inititalState, action) => {
  switch (action.type) {
    case 'GET_QUESTION':
      return {
        ...state,
        stuff: 1,
      };

    default:
      return state;
  }
};
