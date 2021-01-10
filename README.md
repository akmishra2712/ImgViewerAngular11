#Angular 11 based Image Viewer.

angular 10+ image-viewer based on [iv-viewer](https://github.com/s-yadav/iv-viewer)

Steps:

#1. Add "@types/iv-viewer": "^2.0.0", & "iv-viewer": "^2.0.1" in Package.json

#2. Add "allowedCommonJsDependencies": ["iv-viewer"] in the build options of Angular.json file.

#3 Import iv-viewer css file in main styles.scss file.
@import "~iv-viewer/dist/iv-viewer.min.css";
