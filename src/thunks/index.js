export const getProgressData = () => (dispatch, getState) => {
  let url = getState().url;
  let username = getState().username;

  console.log('get progress:' + url + 'get-progress.php ' + username);

  fetch(url + 'get-progress.php', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
    }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      //console.log(`data: ${JSON.stringify(data)}`);
      dispatch({type: 'PROGRESS_INFO', payload: data});
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getAccess = () => (dispatch, getState) => {
  let url = getState().url;
  let currentVersion = getState().currentVersion;

  let dest = 'get-access.php';

  console.log('getAccess: ' + url + dest);

  fetch(url + dest, {
    method: 'POST',
    body: JSON.stringify({
      currentVersion: currentVersion,
    }),
  })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      console.log(`access data: ${JSON.stringify(data)}`);
      dispatch({type: 'SET_ACCESS_FEATURE', payload: data});
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getLeaderData = (level, mode) => (dispatch, getState) => {
  let url = getState().url;

  console.log(
    'getLeaderData: ' +
      url +
      'get-leaderboard.php level: ' +
      level +
      ' mode: ' +
      mode,
  );

  fetch(url + 'get-leaderboard.php', {
    method: 'POST',
    body: JSON.stringify({
      level: level,
      mode: mode,
    }),
  })
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      //console.log(`data: ${data}`);
      dispatch({type: 'LEADER_DATA', payload: data});
    })
    .catch((error) => {
      console.log(error);
    });
};

export const saveTestScore = (score, duration) => (dispatch, getState) => {
  //return;

  let username = getState().username;
  let loggedIn = getState().loggedIn;
  let mode = getState().mode;
  let url = getState().url;
  let level = getState().level;

  console.log(
    `saveTestScore: username: ${username} loggedIn: ${loggedIn} mode: ${mode} duration: ${duration} score: ${score} level: ${level}`,
  );

  fetch(url + 'add-results.php', {
    method: 'POST',
    body: JSON.stringify({
      score: score,
      duration: duration,
      mode: mode,
      level: level,
      username: username,
      loggedIn: loggedIn,
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
      dispatch({type: 'SCORE_SAVED', payload: data});
    })

    .catch((error) => {
      console.log(error);
    });
};

export const saveProgress = () => (dispatch, getState) => {
  let highestInterval = getState().highestCompletedIntervalLevel;
  let highestPitch = getState().highestCompletedPitchLevel;
  let userid = getState().userid;
  let url = getState().url;

  console.log(
    'saveProgress: ' +
      JSON.stringify({
        highestInterval: highestInterval,
        highestPitch: highestPitch,
        userid: userid,
      }),
  );

  // return;

  fetch(url + 'save-progress.php', {
    method: 'POST',
    body: JSON.stringify({
      highestInterval: highestInterval,
      highestPitch: highestPitch,
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
  //console.log(`username: ${username} password: ${password}`);

  let deviceUsername = getState().deviceUsername;

  fetch(
    'https://pianolessonwithwarren.com/wp-json/ars/VerifyUser/?key=pk_017ddc497ab0d005eea8e2e2744f05f9e77a0ac4',
    {
      method: 'POST',
      body: JSON.stringify({
        username: username,
        password: password,
        deviceUsername: deviceUsername,
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
      dispatch({
        type: 'AUTH_DATA',
        payload: data,
        user: {username: username, password: password},
      });
    })
    .catch((error) => {
      console.log(error);

      dispatch({type: 'LOGIN_ERROR', payload: error});
    });
};

export const userAuth = (username) => (dispatch, getState) => {
  //console.log(`username: ${username} password: ${password}`);

  let url = getState().url;
  let deviceUsername = getState().deviceUsername;
  let username = getState().username;
  let highestInterval = getState().highestCompletedIntervalLevel;
  let highestPitch = getState().highestCompletedPitchLevel;

  fetch(url + 'user-auth.php', {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      deviceUsername: deviceUsername,
      highestInterval: highestInterval,
      highestPitch: highestPitch,
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
      dispatch({
        type: 'AUTH_SITE_DATA',
        payload: data,
      });
    })
    .catch((error) => {
      console.log(error);

      dispatch({type: 'LOGIN_SITE_ERROR', payload: error});
    });
};

//   "input_1":"name field",
// "input_2":"email@gmail.com",
// "input_2_2":"email@gmail.com",
// "input_4":"this is subject",
// "input_3":"this is message",
// "input_6":0

export const sendSupportMessage = (name, email, subject, message) => (
  dispatch,
  getState,
) => {
  console.log(
    `name: ${name} message: ${message} email: ${email} subject: ${subject}`,
  );

  //return;

  var myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'Basic Y2tfMTNlZWZjYzZkOWMyYTA3ZDE0ODYyYmRhZTZlZDAwYmY1NjU3NDA1ODpjc183ZDg3NDY4ZWEwNzY1ZGJhYjgwNDM2ZjRkYjUzZGU2ZDMyNDIwNDdm',
  );
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Cookie',
    'wfwaf-authcookie-2927716f484e692d82f2f18aaed23c0a=3744%7Cadministrator%7C432b306082b3c7da03e6bd5e831bc9d3cc02bfd52fee14e921bca101cc490312',
  );

  var raw = JSON.stringify({
    input_1: name,
    input_2: email,
    input_2_2: email,
    input_4: subject,
    input_3: message,
    input_6: 0,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch(
    'https://pianolessonwithwarren.com/wp-json/gf/v2/forms/2/submissions',
    requestOptions,
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      dispatch({type: 'SUPPORT_DATA', payload: data});
    })
    .catch((error) => {
      console.log(error);

      dispatch({type: 'SUPPORT_ERROR', payload: error});
    });
};
