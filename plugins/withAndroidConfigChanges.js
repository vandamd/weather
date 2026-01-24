const { withAndroidManifest } = require("expo/config-plugins");

module.exports = function withAndroidConfigChanges(config) {
  return withAndroidManifest(config, (config) => {
    const mainActivity =
      config.modResults.manifest.application[0].activity.find(
        (activity) => activity.$["android:name"] === ".MainActivity"
      );

    if (mainActivity) {
      mainActivity.$["android:configChanges"] =
        "keyboard|keyboardHidden|orientation|screenSize|screenLayout|uiMode|density|fontScale|smallestScreenSize";
    }

    return config;
  });
};
