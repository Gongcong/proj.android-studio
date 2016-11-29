/****************************************************************************
 * Copyright (c) 2015 Chukong Technologies Inc.
 * <p>
 * http://www.cocos2d-x.org
 * <p>
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * <p>
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * <p>
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import android.app.DialogFragment;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.google.gson.Gson;

import org.cocos2dx.javascript.dialog.TipDialog;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxHelper;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import cn.winga.cioosdk.program.Constants;
import cn.winga.cioosdk.program.aidl.HrvPower;
import cn.winga.cioosdk.program.aidl.HrvValue;
import cn.winga.cioosdk.program.aidl.SensorTable;
import cn.winga.cioosdk.program.binder.ServiceBinder;
import cn.winga.cioosdk.program.binder.ServiceNotConnectException;
import cn.winga.cioosdk.program.binder.StatusListener;
import cn.winga.cioosdk.program.binder.WorkListener;

public class AppActivity extends Cocos2dxActivity implements StatusListener, WorkListener {

    public static final String COCOS_GAME_READY = "COCOS_GAME_READY";
    public static final String COCOS_START_ENGINE = "COCOS_START_ENGINE";
    public static final String COCOS_PAUSE_ENGINE = "COCOS_PAUSE_ENGINE";
    public static final String COCOS_RESUME_ENGINE = "COCOS_RESUME_ENGINE";
    public static final String COCOS_STOP_ENGINE = "COCOS_STOP_ENGINE";
    public static final String COCOS_GET_CHECK_STATE = "COCOS_GET_CHECK_STATE";
    public static final String COCOS_READ_MIND_VALUE = "COCOS_READ_MIND_VALUE";
    public static final String COCOS_SET_MIND_TYPE = "COCOS_SET_MIND_TYPE";
    public static final String COCOS_SET_TRAINING_SCORE = "COCOS_SET_TRAINING_SCORE";
    public static final String COCOS_GET_SDCARD_PATH = "COCOS_GET_SDCARD_PATH";
    public static final String COCOS_UNZIP_RESOURCE = "COCOS_UNZIP_RESOURCE";
    public static final String COCOS_GET_RESOURCE_PATH = "COCOS_GET_RESOURCE_PATH";
    public static final String COCOS_QUIT_GAME = "COCOS_QUIT_GAME";
    public static final String COCOS_GET_SENSOR_TABLE = "COCOS_GET_SENSOR_TABLE";
    public static final String COCOS_SET_SENSOR_TABLE = "COCOS_SET_SENSOR_TABLE";
    public static final String COCOS_SHOW_DIALOG = "COCOS_SHOW_DIALOG";

    public static final String TAG = AppActivity.class.getSimpleName();

    static AppActivity instance = null;

    public static final String GAME_NAME = "game_name";
    public static final String OBB_PATH = "obb_path";
    public static final String REPORT_TYPE = "report_type";

    private ServiceBinder serviceBinder;
    private Gson gson = new Gson();

    private String gameName;
    private String obbPath;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIntent();
        instance = this;
        serviceBinder = ServiceBinder.getInstance(getApplication());
        serviceBinder.setOnPrepared(new Runnable() {
            @Override
            public void run() {
                try {
                    serviceBinder.addStatusListener(AppActivity.this);
                    serviceBinder.addWorkListener(AppActivity.this);
                    serviceBinder.stop(-1);
                    serviceBinder.setMindType(Constants.MIND_TYPE_SENSOR_SCORE, 0);
                    serviceBinder.setMindType(Constants.MIND_TYPE_HRV_VALIDATION, 0);
                    serviceBinder.setGameList("asb", "123");
                    int mindResult = serviceBinder.setMindProgram("123", Constants.MIND_OPEN_GAME);
                    if (mindResult == 0) {
                        int linkType = serviceBinder.getLinkType();
                        if (linkType == 0) {

                        }
                    }

                } catch (ServiceNotConnectException e) {
                    e.printStackTrace();
                }
            }
        });
        Utils.getResPath("gong");
    }

    @Override
    protected void onDestroy() {
        serviceBinder.removeStatusListener(this);
        serviceBinder.removeWorkListener(this);
        super.onDestroy();
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        return glSurfaceView;
    }

    public void handleIntent() {
        gameName = getIntent().getStringExtra(GAME_NAME);
        obbPath = getIntent().getStringExtra(OBB_PATH);
    }

    public static int unzipRes(String resPath, String savePath) {
        try {
            InputStream inputStream = Cocos2dxHelper.getObbFile().getInputStream(resPath);
//            File file = new File(Environment.getExternalStorageDirectory().getAbsolutePath() + "/Android/obb/" + "com.gong.game/bg.mp3");
            File file = new File(savePath);
            Utils.copyInputStreamToFile(inputStream, file);
            return 1;
        } catch (IOException e) {
            e.printStackTrace();
            return 0;
        }
    }

    public static String js2Native(String cmd, String content) {
        int result = 0;
        try {
            Log.d(TAG, "from js cmd:" + cmd + "     content:" + content);
            JSONObject jo = null;
            if (!TextUtils.isEmpty(content)) {
                jo = new JSONObject(content);
            }
            switch (cmd) {
                case COCOS_START_ENGINE:
                    instance.serviceBinder.start();
                    return wrapResult(result, 0, "");
                case COCOS_PAUSE_ENGINE:
                    instance.serviceBinder.pause();
                    return wrapResult(result, 0, "");
                case COCOS_RESUME_ENGINE:
                    instance.serviceBinder.resume();
                    return wrapResult(result, 0, "");
                case COCOS_STOP_ENGINE:
                    int flag = jo.getInt("flag");
                    instance.serviceBinder.stop(flag);
                    return wrapResult(result, 0, "");
                case COCOS_GET_CHECK_STATE:
                    int checkState = instance.serviceBinder.getCheckState();
                    JSONObject data = new JSONObject();
                    data.put("state", checkState);
                    return wrapResult(result, 0, data.toString());
                case COCOS_READ_MIND_VALUE:
                    int mindType = jo.getInt("mindType");
                    int mindValue = instance.serviceBinder.readMindValue(mindType);
                    JSONObject readMindData = new JSONObject();
                    readMindData.put("mindValue", mindValue);
                    return wrapResult(result, 0, readMindData.toString());
                case COCOS_SET_MIND_TYPE:
                    int m = jo.getInt("mindType");
                    int value = jo.getInt("value");
                    int code = instance.serviceBinder.setMindType(m, value);
                    return wrapResult(result, code, "");
                case COCOS_SET_TRAINING_SCORE:
                    int score = jo.getInt("score");
                    int finalResult = jo.getInt("finalResult");
                    int setTrainingResult = instance.serviceBinder.setTrainingScore(score, finalResult);
                    return wrapResult(result, setTrainingResult, "");
                case COCOS_UNZIP_RESOURCE:
                    unzipRes(jo.getString("srcPath"), jo.getString("destPath"));
                    return wrapResult(result, 0, "");
                case COCOS_GET_RESOURCE_PATH:
                    String path = Utils.getResPath(instance.gameName);
                    JSONObject pathData = new JSONObject();
                    pathData.put("resPath", path);
                    return wrapResult(result, 0, pathData.toString());
                case COCOS_SET_SENSOR_TABLE:
                    int typeSet = jo.getInt("type");
                    String strDataSet = jo.getString("body");
                    SensorTable sensorTableSet = instance.gson.fromJson(strDataSet, SensorTable.class);
                    int setSensorCode = instance.serviceBinder.setSensorTable(typeSet, sensorTableSet);
                    return wrapResult(result, setSensorCode, "");
                case COCOS_GET_SENSOR_TABLE:
                    int typeGet = jo.getInt("type");
                    SensorTable sensorTableGet = new SensorTable();
                    int getSensorTable = instance.serviceBinder.getSensorTable(typeGet, sensorTableGet);
                    String strData = instance.gson.toJson(sensorTableGet);
                    return wrapResult(result, getSensorTable, strData);
                case COCOS_SHOW_DIALOG:
                    //instance.showTipDialog();
                    int show = jo.getInt("show");
                    String type = jo.getString("state");
                    instance.showTipDialog(type, show);
                    break;
            }
        } catch (ServiceNotConnectException | JSONException e) {
            e.printStackTrace();
            result = -1;
        }
        return wrapResult(result, 0,"");
    }

    public void notifyJs(final String cmd, final String content) {
        runOnGLThread(new Runnable() {
            @Override
            public void run() {
                String function = "engineCallback(\"" + cmd + "\"," + gson.toJson(content) + ")";
                Cocos2dxJavascriptJavaBridge.evalString(function);
            }
        });
    }

    @Override
    public void onError(int i) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("errorNo", i);
            notifyJs("onError", jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onBattery(int i) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("battery", i);
            notifyJs("onBattery", jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onLinkChange(int i, int i1) {

        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("status", i);
            jsonObject.put("type", i1);
            notifyJs("onLinkChange", jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onPsychologyState(int i, int i1, int i2) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("data1", i);
            jsonObject.put("data2", i1);
            jsonObject.put("data3", i2);
            notifyJs("onPsychologyState", jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onPsychologyChart(int i, int i1, int i2) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("curTime", i);
            jsonObject.put("value", i1);
            jsonObject.put("type", i2);
            notifyJs("onPsychologyChart", jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onHrvData(int i, HrvValue hrvValue, HrvPower hrvPower) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("time", i);
            jsonObject.put("hrv_value", gson.toJson(hrvValue));
            jsonObject.put("hrv_power", gson.toJson(hrvPower));
            notifyJs("onHrvData", jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onHeartRateData(int i, int i1) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("time", i);
            jsonObject.put("hr", i1);
            jsonObject.put("value", 0);
            notifyJs("onHeartRateData", jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onPressureData(int i, int i1) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("time", i);
            jsonObject.put("stress", i1);
            jsonObject.put("value", 0);
            notifyJs("onStressData", jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onRelaxData(int i, int i1) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("time", i);
            jsonObject.put("relax", i1);
            jsonObject.put("value", 0);
            notifyJs("onRelaxData", jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onHRVValidation(int i, int i1, int i2) {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put("value", i);
            jsonObject.put("abnorFlag", i1);
            jsonObject.put("validCount", i2);
            notifyJs("onHRVValidation", jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onTrainingResult(String s) {

    }

    public static String wrapResult(int result, int message, String body) {
        JSONObject jo = new JSONObject();
        try {
            jo.put("result", result);
            jo.put("message", message);
            jo.put("body", body);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jo.toString();
    }

    DialogFragment dialog;

    public void showTipDialog(String type, int open) {
        dialog = (DialogFragment) getFragmentManager().findFragmentByTag("dialog");
        if (dialog != null) {
            if (open == 1) {
                dialog.show(getFragmentManager(), "dialog");
            } else {
                dialog.dismiss();
            }
        } else {
            if (open == 0) {
                dialog = TipDialog.newInstance(type);
                dialog.show(getFragmentManager(), "dialog");
            }
        }
    }

}
