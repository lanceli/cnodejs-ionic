# CNodejs Ionic app

> [https://cnodejs.org](http://cnodejs.org) hybird mobile application powered by [Ionic Framework](http://ionicframework.com) using AngularJS and Cordova. The development stage powered by [Ionic Framework generator](https://github.com/diegonetto/generator-ionic).


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

