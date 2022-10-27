package cn.drew;

import android.content.Context;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Build;
import android.text.TextUtils;
import android.util.Base64;
import android.util.Log;
import android.util.TypedValue;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.net.URL;
import java.util.regex.Pattern;

/**
 * This class echoes a string called from JavaScript.
 */
public class DynamicLaunchScreen extends CordovaPlugin {

    private final static String TAG = "DynamicLaunchScreen";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if ("set".equals(action)) {
            new Thread(() -> {
                try {
                    URL url = new URL(args.getString(0));
                    Bitmap bitmap = BitmapFactory.decodeStream(url.openConnection().getInputStream());
                    File file = new File(cordova.getContext().getFilesDir(), "splash.jpg");
                    FileOutputStream out = new FileOutputStream(file);
                    bitmap.compress(Bitmap.CompressFormat.JPEG, 100, out);
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                } catch (Exception e) {
                    e.printStackTrace();
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, e.getMessage()));
                }
            }).start();
        } else if ("restore".equals(action)) {
            new Thread(() -> {
                try {
                    File file = new File(cordova.getContext().getFilesDir(), "splash.jpg");
                    if (file.exists()) {
                        file.delete();
                    }
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                } catch (Exception e) {
                    e.printStackTrace();
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR, e.getMessage()));
                }
            }).start();
        }
        return false;
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
    }
}
