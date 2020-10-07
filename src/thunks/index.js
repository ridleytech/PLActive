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

export const getProgressData = () => (dispatch, getState) => {
  console.log('get progress');
  fetch('http://localhost:8888/ridleytech/pianolessons/get-progress.php')
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(`data: ${data}`);
      dispatch({type: 'PROGRESS_INFO', payload: data});
    })
    .catch((error) => {
      console.log(error);
    });
};

export const saveProgress = (level1) => (dispatch, getState) => {
  console.log('saveProgress');

  return;

  let level = getState().currentLevel;
  let mode = getState().currentMode;
  let userid = getState().userid;

  fetch('http://', {
    method: 'POST',
    body: JSON.stringify({
      level: level,
      mode: mode,
      userid: userid,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      dispatch({type: 'PROGRESS_SAVED', payload: data});
    })
    .catch((error) => {
      console.log(error);
    });
};
