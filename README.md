# CNodejs Ionic app

> [https://cnodejs.org](http://cnodejs.org) hybird mobile application powered by [Ionic Framework](http://ionicframework.com) using AngularJS and Cordova. The development stage powered by [Ionic Framework generator](https://github.com/diegonetto/generator-ionic).

[![Download on the app store](https://devimages.apple.com.edgekey.net/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg)](https://itunes.apple.com/cn/app/id954734793)

## Developing

If you'd like to run it locally, and modify something, you can do so by cloning this repo and running the following commands (assuming that you have Node, NPM, Ionic, Cordova, Grunt and Bower installed).

```bash
# Clone and Install dependencies
$ git clone git://github.com/lanceli/cnodejs-ionic.git
$ npm install
$ bower install

# Config api url on development mode
# At line 54 in Gruntfile.js
$ vim Gruntfile.js

# Start the server on localhost:8010 on development mode
# Watches for changes, automatically recompiles files and refreshes the browser
$ grunt serve 

# Start the server on production mode
$ grunt serve:compress

# Add platform target
$ grunt platform:add:ios
$ grunt platform:add:android

# Run on platform target on development mode
$ grunt run:ios
$ grunt run:android

# Run on platform target on production mode
$ grunt build:ios
$ ionic run ios
$ grunt build:android
$ ionic run android
```

Need more detail? Please chekout [Ionic Framework](http://ionicframework.com) and [Ionic Framework generator](https://github.com/diegonetto/generator-ionic).

### Question
if you have some problem with window system, please follow the blow step may help you fixed it.
```js
grunt-contrib-compass/node_modules/tmp/lib/tmp.js:261
        throw err;
      ^
     Error: cannot read property 'stdout' of undefined
    at compile
```

see issue: [Run grunt serve error](https://github.com/lanceli/cnodejs-ionic/issues/11)

* Make sure you have installed [Ruby](http://rubyinstaller.org/downloads/) tools 
* After you install ruby, use gem to install sass and compass(in cmd):
> 1. gem install sass
> 2. gem install compass

* use npm to install modules(in cmd), choose one to install:
> 1. npm install cordova ionic
> 2. npm install -g cordova ionic

After install all the modules, you may face the child_process error. This is a windows system bug. you can fixed it like this:
```js
grunt-contrib-compass/node_modules/tmp/lib/tmp.js:261
        throw err;
      ^
     Error: spawn ENOENT
    at errnoException (child_process.js:1001:11) 
   at Process.ChildProcess._handle.onexit (child_process.js:802:34)
```
A solution would be to replace spawn by win-spawn:

1. npm install win-spawn
2. Replace the line in the Gruntfile.js:
```js
replace child_process to win-spawn
var spawn = require('child_process').spawn;
to
var spawn = require('win-spawn');
```

more information about this defect,please see:
 
* [child_process error solution1](https://cnodejs.org/topic/54b4db04edf686411e1b9d7f#54b51ac3edf686411e1b9dcf)
* [child_process error solution2](https://github.com/diegonetto/generator-ionic/issues/15#issuecomment-38075095)

have try, it should work now.

### Cross-Origin
When you run it locally in browser, CORS is a problem.

**Disable web security of chrome**

```
open -a /Applications/Google\ Chrome.app --args --disable-web-security --allow-file-access-from-files
``` 
OR **Allow cross origin access in nginx**

```
add_header Access-Control-Allow-Origin *;
```
Checkout this: [How do I add Access-Control-Allow-Origin in NGINX?](http://serverfault.com/questions/162429/how-do-i-add-access-control-allow-origin-in-nginx/)

## Release History
See the [CHANGELOG](CHANGELOG.md).

## Contribute
You are welcome to contribute. 🎉

## License
[MIT](LICENSE)

