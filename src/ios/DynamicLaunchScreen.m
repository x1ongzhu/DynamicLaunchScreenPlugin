/********* DynamicLaunchScreen.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import <LLDynamicLaunchScreen/LLDynamicLaunchScreen.h>

@interface DynamicLaunchScreen : CDVPlugin {
    
}
@property (nonatomic, assign) BOOL sdkAvailable;
@end

@implementation DynamicLaunchScreen

- (void)pluginInitialize
{
}

- (void) set:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        NSString *directory = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
        NSString *filePath = [directory stringByAppendingPathComponent:@"splash.jpg"];
        [self getImageFromURLAndSaveItToLocalData:@"splash.jpg" fileURL:[command.arguments objectAtIndex:0] inDirectory:directory];

        [LLDynamicLaunchScreen replaceVerticalLaunchImage:[UIImage imageWithContentsOfFile:filePath]];
        [LLDynamicLaunchScreen replaceHorizontalLaunchImage:[UIImage imageWithContentsOfFile:filePath]];
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
    }];
}

- (void) restore:(CDVInvokedUrlCommand*)command
{
    [self.commandDelegate runInBackground:^{
        [LLDynamicLaunchScreen restoreAsBefore];
        NSString *filePath = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:@"splash.jpg"];
        if([[NSFileManager defaultManager] fileExistsAtPath:filePath]){
            NSError *error;
            BOOL success = [[NSFileManager defaultManager] removeItemAtPath:filePath error:&error];
            if (!success) {
                NSLog(@"Error removing file at path: %@", error.localizedDescription);
            }
        }
        [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
    }];
}

-(void) getImageFromURLAndSaveItToLocalData:(NSString *)imageName fileURL:(NSString *)fileURL inDirectory:(NSString *)directoryPath {
    NSData * data = [NSData dataWithContentsOfURL:[NSURL URLWithString:fileURL]];

    NSError *error = nil;
    [data writeToFile:[directoryPath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@", imageName]] options:NSAtomicWrite error:&error];

    if (error) {
        NSLog(@"Error Writing File : %@",error);
    }else{
        NSLog(@"Image %@ Saved SuccessFully",imageName);
    }
}
@end
