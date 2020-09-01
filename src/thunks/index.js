const getQuestions = () => {
  return (dispatch) => {
    fetch('http://')
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        dispatch({type: 'GOT_QUESTION', payload: data});
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
