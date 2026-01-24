const fs = require("fs");

console.log("Syncing version from app.json...\n");

try {
	const appConfig = JSON.parse(fs.readFileSync("app.json", "utf8"));
	const version = appConfig.expo.version;

	console.log(`Target version: ${version}`);

	// Update package.json
	const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
	const oldPackageVersion = packageJson.version;
	packageJson.version = version;
	fs.writeFileSync("package.json", JSON.stringify(packageJson, null, "\t") + "\n");
	console.log(`Updated package.json: ${oldPackageVersion} -> ${version}`);

	// Update Android build.gradle
	const buildGradlePath = "android/app/build.gradle";
	if (fs.existsSync(buildGradlePath)) {
		let buildGradle = fs.readFileSync(buildGradlePath, "utf8");
		const currentVersionMatch = buildGradle.match(/versionName\s+"([^"]*)"/);
		const oldAndroidVersion = currentVersionMatch ? currentVersionMatch[1] : "unknown";

		buildGradle = buildGradle.replace(/versionName\s+"[^"]*"/, `versionName "${version}"`);
		fs.writeFileSync(buildGradlePath, buildGradle);
		console.log(`Updated android/app/build.gradle: ${oldAndroidVersion} -> ${version}`);
	} else {
		console.log("android/app/build.gradle not found (run build first)");
	}

	console.log("\nVersion sync complete!");
} catch (error) {
	console.error("Error syncing version:", error.message);
	process.exit(1);
}
