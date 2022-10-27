const fs = require("fs");
const path = require("path");
const https = require("https");
module.exports = function (context) {
    if (
        context.opts.plugin &&
        context.opts.plugin.id === "cordova-plugin-dynamic-launch-screen"
    ) {
        const projectRoot = context.opts.projectRoot;

        const cordovaCommon = context.requireCordovaModule("cordova-common");
        const { ConfigParser } = cordovaCommon;
        const appConfig = new ConfigParser(
            path.resolve(projectRoot, "config.xml")
        );

        let projectName = appConfig.name();

        const packageName =
            appConfig.android_packageName() || appConfig.packageName();
        const file = path.resolve(
            projectRoot,
            "platforms",
            "android",
            "app",
            "src",
            "main",
            "java",
            "cn",
            "drew",
            "DynamicLaunchScreen.java"
        );
        fs.writeFileSync(
            file,
            fs
                .readFileSync(file)
                .toString()
                .replaceAll("${packageName}", packageName)
        );

        const file1 = path.resolve(
            projectRoot,
            "platforms",
            "android",
            "app",
            "src",
            "main",
            "java",
            "org",
            "apache",
            "cordova",
            "splashscreen",
            "SplashScreen.java"
        );
        if (fs.existsSync(file1)) {
            let s = fs.readFileSync(file1).toString();
            if (!/\/\/dynamicLaunchScreenMod/.test(s)) {
                s = s.replace(
                    "splashImageView.setImageResource(drawableId);",
                    `
                //dynamicLaunchScreenMod
                File file = new File(cordova.getContext().getFilesDir(), "splash.jpg");
                if (file.exists()) {
                    splashImageView.setImageBitmap(BitmapFactory.decodeFile(file.getPath()));
                } else {
                    splashImageView.setImageResource(drawableId);
                }`
                );
                let i = s.indexOf("public class SplashScreen");
                s = s.slice(0, i) + "import java.io.File;" + s.slice(i);
            }
        }
    }
};
