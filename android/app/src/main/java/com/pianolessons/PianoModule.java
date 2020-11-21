// PianoModule.java

package com.pianolessons;

import android.media.MediaPlayer;
import android.util.Log;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;

import org.billthefarmer.mididriver.GeneralMidiConstants;
import org.billthefarmer.mididriver.MidiConstants;
import org.billthefarmer.mididriver.MidiDriver;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

//https://github.com/billthefarmer/mididriver

public class PianoModule extends ReactContextBaseJavaModule implements
        MidiDriver.OnMidiStartListener {

    private static ReactApplicationContext reactContext;
    private static final String DURATION_SHORT_KEY = "SHORT";
    private static final String DURATION_LONG_KEY = "LONG";
    String midiStatus = "failed";
    ;

    protected MidiDriver midi;
    protected MediaPlayer player;

    PianoModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "PlayKey";
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
        constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
        return constants;
    }

    @Override
    public void onMidiStart() {

        // Program change - harpsichord
        sendMidi(MidiConstants.PROGRAM_CHANGE,
                GeneralMidiConstants.ACOUSTIC_GRAND_PIANO);

        // Get the config
        int config[] = midi.config();

        RelativeLayout relativeLayout = new RelativeLayout(getReactApplicationContext());
        TextView btn = new TextView(getReactApplicationContext());
        relativeLayout.addView(btn);

        String st = Integer.toString(config[0]);

        midiStatus = "started";

        Log.i("randall", "midi started");

        //btn.setId((int)System.currentTimeMillis());
        //recentView = btn;

        //String format = getString(R.string.format);
        String format = "Sonivox synthesizer config: maxVoices = %d numChannels = %d sampleRate = %d mixBufferSize = %d";

        String info = String.format(Locale.getDefault(), format, config[0],
                config[1], config[2], config[3]);

        btn.setText(info);

        // if (text != null)
        //     text.setText(info);
    }

    // Send a midi message, 2 bytes
    protected void sendMidi(int m, int n) {
        byte msg[] = new byte[2];

        msg[0] = (byte) m;
        msg[1] = (byte) n;

        midi.write(msg);
    }

    // Send a midi message, 3 bytes
    protected void sendMidi(int m, int n, int v) {
        byte msg[] = new byte[3];

        msg[0] = (byte) m;
        msg[1] = (byte) n;
        msg[2] = (byte) v;

        midi.write(msg);
    }

    @ReactMethod
    public void playKey(int key) {

        Toast.makeText(getReactApplicationContext(), Integer.toString(key), Toast.LENGTH_SHORT).show();
    }

    @ReactMethod
    public void testGraph(Callback cb) {
        try{
            cb.invoke("test passed");
        }catch (Exception e){
            cb.invoke("test failed");
        }
    }

    @ReactMethod
    public void initGraph(
            Callback errorCallback,
            Callback successCallback) {
        try {

            midi = new MidiDriver();

// Set on midi start listener
            if (midi != null) {
                midi.setOnMidiStartListener(this);
                midi.start();
                //status = "started";
            }

            successCallback.invoke("midi status: " + midiStatus);
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke("midi error status: " + e.getMessage());
        }
    }

    @ReactMethod
    public void releaseKey(int key) {
        //Toast.makeText(getReactApplicationContext(), message, duration).show();

        // sendMidi(MidiConstants.NOTE_OFF, 48, 0);
        // sendMidi(MidiConstants.NOTE_OFF, 52, 0);
        // sendMidi(MidiConstants.NOTE_OFF, 55, 0);

        sendMidi(MidiConstants.NOTE_OFF, key, 90);
    }

    @ReactMethod
    public void playKeyCB(
            int key,
            Callback errorCallback,
            Callback successCallback) {

        Log.i("randall", "play key in app");

        try {

            //Toast.makeText(getReactApplicationContext(), Integer.toString(key), Toast.LENGTH_SHORT).show();

            // sendMidi(MidiConstants.NOTE_ON, 48, 63);
            // sendMidi(MidiConstants.NOTE_ON, 52, 63);
            // sendMidi(MidiConstants.NOTE_ON, 55, 63);

            int currentOctave = 3;
            int sustainValue = 0;

            if (currentOctave == 1)
            {
                key = key + 12;
            }
            else if (currentOctave == 2)
            {
                key = key + 36;
            }
            else if (currentOctave == 3)
            {
                key = key + 60;
            }
            else if (currentOctave == 4)
            {
                key = key + 84;
            }
            else if (currentOctave == 5)
            {
                key = key + 108;
            }
            else if (currentOctave == 6)
            {
                key = key + 132;
            }
            else
            {
                key = key + 156;
            }

            sendMidi(MidiConstants.NOTE_ON, key, 90);

            successCallback.invoke("played " + key + " successfully");
        } catch (IllegalViewOperationException e) {
            errorCallback.invoke(e.getMessage());
        }
    }
}