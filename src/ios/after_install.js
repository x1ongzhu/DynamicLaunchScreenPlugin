const fs = require("fs");
const path = require("path");
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

        const cdvFileTransfer = path.resolve(
            projectRoot,
            "platforms",
            "ios",
            "CordovaLib",
            "Classes",
            "Public",
            "CDVViewController.m"
        );
        if (!fs.existsSync(cdvFileTransfer)) {
            return;
        }
        let content = fs.readFileSync(cdvFileTransfer).toString();
        if (!/\/\/dynamicLaunchScreenMod/.test(content)) {
            let lines = content.split("\n");
            let index = lines.findIndex(
                (i) =>
                    i.trim() ===
                    "UIViewController* vc = [storyboard instantiateInitialViewController];"
            );
            if (index > -1) {
                lines[index] = `
        //dynamicLaunchScreenMod
        UIViewController* vc = [storyboard instantiateInitialViewController];
        NSString *filePath = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:@"splash.jpg"];
        
        if([[NSFileManager defaultManager] fileExistsAtPath:filePath]){
            UIImageView *img = [vc.view.subviews objectAtIndex:0];
            [img setImage:[[UIImage alloc] initWithContentsOfFile:filePath]];
        }`;
                fs.writeFileSync(cdvFileTransfer, lines.join("\n"));
            }
        }
    }
};
