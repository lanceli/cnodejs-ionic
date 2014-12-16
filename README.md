# CNodejs Ionic app

> [https://cnodejs.org](http://cnodejs.org) hybird mobile application powered by [Ionic Framework](http://ionicframework.com) using AngularJS and Cordova. The development stage powered by [Ionic Framework generator](https://github.com/diegonetto/generator-ionic).


## Developing

If you'd like to run it locally, and modify something, you can do so by cloning this repo and running the following commands (assuming that you have Node, NPM, Ionic, Cordova, Grunt and Bower installed).

```
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

## Release History
See the [CHANGELOG](CHANGELOG.md).

## Contribute
You are welcome to contribute. 🎉

## License
[MIT](LICENSE)

