package org.cocos2dx.javascript;

import android.content.Context;
import android.os.Environment;
import android.util.Log;

import org.apache.commons.io.IOUtils;
import org.cocos2dx.lib.Cocos2dxHelper;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;


/**
 * Created by gongzong on 2016/11/10.
 */

public class Utils {

    public static File stream2file(InputStream in) throws IOException {
        final File tempFile = File.createTempFile(Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + "bg", ".mp3");
        tempFile.deleteOnExit();
        try (FileOutputStream out = new FileOutputStream(tempFile)) {
            IOUtils.copy(in, out);
        }
        return tempFile;
    }

    public static void copyInputStreamToFile(InputStream in, File file) {
        try {
            OutputStream out = new FileOutputStream(file);
            byte[] buf = new byte[1024];
            int len;
            while ((len = in.read(buf)) > 0) {
                out.write(buf, 0, len);
            }
            out.close();
            in.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String getResPath(String gameName) {
        String gamePath = getObbPath() + "/" + gameName + "/";
        File file = new File(gamePath);
        if (!file.exists()) {
            file.mkdirs();
        }
        return file.getAbsolutePath();
    }

    public static String getObbPath() {
        String path = Environment.getExternalStorageDirectory().getAbsolutePath() + "/Android/obb/" + Cocos2dxHelper.getsPackageName();
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }
        return file.getAbsolutePath();
    }

    public static String getPrivateObbPath(Context context, String gameName) {
        return context.getDir("obb_" + gameName, context.MODE_PRIVATE).getAbsolutePath();
    }

}
