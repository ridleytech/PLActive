import {act} from 'react-test-renderer';

var local = false;
var localPath = 'http://localhost:8888/ridleytech/pianolesson/';
var remotePath = 'https://pianolessonwithwarren.com/dev_site/pianolesson/';

var url;

if (local) {
  url = localPath;
} else {
  url = remotePath;
}

const inititalState = {
  a: 1,
  level: 0,
  mode: 0,
  previousMode: null,
  userid: 1,
  highestCompletedIntervalLevel: 0,
  highestCompletedPitchLevel: 0,
  loggedIn: false,
  graphStarted: false,
  loginEnabled: true,
  loginError: false,
  supportSent: false,
  supportEnabled: true,
  supportError: false,
  responseMessage: null,
  username: null,
  deviceUsername: null,
  password: null,
  fullname: null,
  leaderData: [],
  url: url,
  accessFeature: 0,
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
      var mode1 = state.mode;

      if (loginData.hasAccount === true) {
        loginStatus = true;
        loginError1 = false;
        mode1 = state.previousMode;
      } else {
        loginError1 = true;
      }

      console.log(`status: ${loginStatus}`);

      return {
        ...state,
        username: action.user.username,
        password: action.user.password,
        loggedIn: loginStatus,
        loginEnabled: true,
        loginError: loginError1,
        mode: mode1,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        loginError: true,
        loginEnabled: true,
      };

    case 'SET_ACCESS_FEATURE':
      return {
        ...state,
        accessFeature: action.payload.accessData.status,
      };

    case 'SET_USERNAME':
      return {
        ...state,
        username: action.username,
      };

    case 'SET_DEVICE_USERNAME':
      return {
        ...state,
        deviceUsername: action.username,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        loginError: true,
        loginEnabled: true,
      };

    case 'SUPPORT_DATA':
      let supportData = action.payload;

      console.log(`support data: ${JSON.stringify(supportData)}`);
      var supportStatus = false;
      var supportError1 = false;
      var responseMessage1;

      //{"is_valid":false,"validation_messages":{"2":"Please enter a valid email address."},"page_number":1,"source_page_number":1}

      if (supportData.is_valid == true) {
        // var successResponse =
        //   "<div id='gform_confirmation_wrapper_2' class='gform_confirmation_wrapper '><div id='gform_confirmation_message_2' class='gform_confirmation_message_2 gform_confirmation_message'>Thanks for contacting us! We will get in touch with you within 24 hours.</div></div>";

        // if (supportData.confirmation_message === successResponse) {
        // }

        //console.log('confirmation messages matches');

        responseMessage1 =
          'Thanks for contacting us! We will get in touch with you within 24 hours.';
        supportStatus = true;
        supportError1 = false;
      } else {
        responseMessage1 = supportData.validation_messages[2];

        supportError1 = true;
      }

      console.log(`status: ${supportStatus}`);

      return {
        ...state,
        supportSent: supportStatus,
        supportEnabled: true,
        supportError: supportError1,
        responseMessage: responseMessage1,
      };

    case 'SUPPORT_ERROR':
      return {
        ...state,
        supportError: true,
        supportEnabled: true,
        responseMessage: 'Message was not sent. Please try again later.',
      };

    case 'CLEAR_SUPPORT_ERROR':
      //console.log('CLEAR_SUPPORT_ERROR');
      return {
        ...state,
        supportSent: false,
        supportError: false,
        responseMessage: null,
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

    case 'LOGIN_USER':
      console.log('login redux');
      return {
        ...state,
        // username: action.username,
        // password: action.password,
        loggedIn: true,
      };

    case 'SHOW_LOGIN':
      //console.log('SHOW_LOGIN');

      var pm = state.mode;

      return {
        ...state,
        mode: 3,
        previousMode: pm,
      };

    case 'LOGOUT_USER':
      console.log('logout redux');
      return {
        ...state,
        loggedIn: false,
        username: null,
        password: null,
      };

    case 'MANAGE_GRAPH':
      //console.log('MANAGE_GRAPH: ' + JSON.stringify(action));

      return {
        ...state,
        graphStarted: action.status,
      };

    case 'PROGRESS_INFO':
      let progressData = action.payload.progressData;

      console.log(`progressData: ${JSON.stringify(progressData)}`);

      return {
        ...state,
        highestCompletedIntervalLevel: parseInt(progressData.ihi),
        highestCompletedPitchLevel: parseInt(progressData.phi),
      };

    case 'LEADER_DATA':
      let leaderData = action.payload.leaderData;

      console.log(`leaderData: ${JSON.stringify(leaderData)}`);

      return {
        ...state,
        leaderData: leaderData,
      };

    case 'SCORE_SAVED':
      let scoreData = action.payload;

      console.log(`scoreData: ${JSON.stringify(scoreData)}`);

      return {
        ...state,
        //leaderData: leaderData,
      };

    case 'SET_PITCH_PROGRESS':
      //console.log('action: ' + JSON.stringify(action));

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
      //console.log('action: ' + JSON.stringify(action));

      var completedLevel = parseInt(action.level.highestCompletedIntervalLevel);
      var levelVal = state.highestCompletedIntervalLevel;

      if (completedLevel > state.highestCompletedIntervalLevel) {
        levelVal = completedLevel;
      }

      return {
        ...state,
        highestCompletedIntervalLevel: levelVal,
      };

    case 'RESET_PROGRESS':
      //console.log('action: ' + JSON.stringify(action));

      console.log('RESET_PROGRESS');
      return {
        ...state,
        highestCompletedPitchLevel: 0,
        highestCompletedIntervalLevel: 0,
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
