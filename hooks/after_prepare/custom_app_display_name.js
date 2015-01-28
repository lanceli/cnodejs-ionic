#!/usr/bin/env node

// Custom app display name
// v1.0

var fs = require('fs');
var path = require('path');
var xml2js = require('xml2js'),
    parser = new xml2js.Parser();
var configMap = {};

var rootdir = process.argv[2];

function replace_string_in_file(filename, to_replace, replace_with) {
    console.log('Replace', to_replace, 'to', replace_with, 'in', filename);
    var data = fs.readFileSync(filename, 'utf8');

    var result = data.replace(to_replace, replace_with);
    fs.writeFileSync(filename, result, 'utf8');
}

if (rootdir) {

  // go through each of the platform directories that have been added
  var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

  fs.readFile(path.join(rootdir, 'config.xml'), function (err, data) {
    parser.parseString(data, function (err, result) {
      var name = result.widget.name.shift();
      configMap.name = name._;
      configMap.display = name.$.display;

      for(var x=0; x<platforms.length; x++) {
        try {
          var platform = platforms[x].trim().toLowerCase();
          var indexPath;

          if(platform == 'android') {
            replace_string_in_file('platforms/android/res/values/strings.xml', configMap.name, configMap.display);
          } else if(platform == 'ios') {
            replace_string_in_file('platforms/ios/' + configMap.name + '/' + configMap.name + '-Info.plist', '${PRODUCT_NAME}', configMap.display);
          }

        } catch(e) {
          process.stdout.write(e);
        }
      }
    });
  });

}
