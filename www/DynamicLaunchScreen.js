var exec = require('cordova/exec');

exports.restore = function (success, error) {
    exec(success, error, 'DynamicLaunchScreenPlugin', 'restore', []);
};
exports.set = function (src, success, error) {
    exec(success, error, 'DynamicLaunchScreenPlugin', 'set', [src]);
};