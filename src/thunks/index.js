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
  fetch('http://localhost:8888/ridleytech/PianoLessons/get-progress.php')
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

export const loginUser = (username, password) => (dispatch, getState) => {
  console.log(`username: ${username} password: ${password}`);

  fetch(
    'https://pianolessonwithwarren.com/wp-json/ars/VerifyUser/?key=pk_017ddc497ab0d005eea8e2e2744f05f9e77a0ac4',
    {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      dispatch({type: 'AUTH_DATA', payload: data});
    })
    .catch((error) => {
      console.log(error);

      dispatch({type: 'LOGIN_ERROR', payload: error});
    });
};

export const sendSupportMessage = (username, message) => (
  dispatch,
  getState,
) => {
  console.log(`username: ${username} message: ${message}`);

  fetch('https://pianolessonwithwarren.com/support/index.php', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      message: message,
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
      dispatch({type: 'SUPPORT_DATA', payload: data});
    })
    .catch((error) => {
      console.log(error);

      dispatch({type: 'SUPPORT_ERROR', payload: error});
    });
};
