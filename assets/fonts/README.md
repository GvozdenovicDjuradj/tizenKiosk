<!-- HOW TO: ADD A NEW FONT -->

- Download the required `***.ttf` file
- move it to the folder, "/asses/fonts"
- run the following command to get the `Full name` value of the font which is stored within the .ttf binary content
  `for file in "$arg"*.ttf; do fc-scan --format "%{fullname}\n" $file; done`, another method would be to install the font on your laptop and check the properties
- using the name output for your corresponding file, go ahead and rename the `.ttf` file using the `fullname` value
- following this go to `theme/fonts.ts` file and add for the key stored on the backend the correct linked font in the `assets/fonts/` folder (see example)
- once this is done, you can run the `react-native link` command in the root folder, this will `link` any new fonts added with the android and ios codebase

why this?
iOS and Android both handle fonts differently.
iOS is using the `fullname` of the font store in binary, Android is using the filename.
To avoid doing platform specific condition the easiest way it's to rename the `.ttf` file with the fullname.

STORED IN DB	FONTS NAME
Georgia	        Georgia
Times	        Times New Roman Cyr
Palatino	    Palatino Linotype 
Arial	        Arial
Gadget	        Gadget
cursive	        Comic Sans MS
Impact	        Impact
Tahoma	        Tahoma
Helvetica	    Helvetica
Verdana	        Verdana
Courier	        Courier
Monaco	        Monaco
