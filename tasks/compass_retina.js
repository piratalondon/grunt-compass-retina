/*
 * grunt-compass-retina
 * https://github.com/piratalondon/grunt-compass-retina
 *
 * Copyright (c) 2013 Anthony Hughes
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('compass_retina', 'Uses class-based system for referring to retina assets', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      rel_img_path: '',
    });

    var spriteSetupTemplate =  "$<%= map %>: sprite-map('<%= rel_img_path %>/*.png');\n$<%= map %>-2x: sprite-map('<%= rel_img_path %>-2x/*.png');";
    var spriteTemplate = 
".<%= img_name %> {" + 
" @include get-sprite($<%= map %>, $<%= map %>-2x, <%= img_name %>);" +
"}";

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // get all the images
      var sprites_dir = {};
      var scss = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else if (filepath.indexOf('2x') !== -1) {
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        var ext = path.extname(filepath);
        var map = path.dirname(filepath);
        var parent = grunt.util._.last(map.split(path.sep));
        var img_name = path.basename(filepath, ext);
        grunt.log.writeln('Reading SASS file at "' + f.dest + '"');
        if (!sprites_dir[parent]) {
          sprites_dir[parent] = {};
          sprites_dir[parent]['map'] = parent;
          sprites_dir[parent]['rel_img_path'] = options.rel_img_path + parent;
          sprites_dir[parent]['results'] = [];
        }

        // get info for an individual sprite
        sprites_dir[parent]['results'].push({map: parent, img_name: img_name});
        return true;
      });

      var output = '';
      var spriteClassTemplateCompiled = grunt.util._.template(spriteSetupTemplate);
      var spriteTemplateCompiled = grunt.util._.template(spriteTemplate);
      for(var parent in sprites_dir) {
        output += spriteClassTemplateCompiled(sprites_dir[parent]) + '\n';
        for (var i = sprites_dir[parent]['results'].length - 1; i >= 0; i--) {
          output += spriteTemplateCompiled(sprites_dir[parent]['results'][i]) + '\n';
        }    
      }

      // Write the destination file.
      grunt.file.write(f.dest, output);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};