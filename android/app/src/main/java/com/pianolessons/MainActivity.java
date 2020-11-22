package com.pianolessons;

import android.os.Bundle;

import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

  //https://www.netguru.com/codestories/react-native-splash-screen

      @Override
    protected void onCreate(Bundle savedInstanceState) {
            SplashScreen.show(this, R.style.SplashStatusBarTheme);
            super.onCreate(savedInstanceState);
       }


  @Override
  protected String getMainComponentName() {

    return "PianoLessons";
  }
}
