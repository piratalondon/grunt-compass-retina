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
      // punctuation: '.',
      // separator: ', '
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      console.log(f.src);

      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        var ext = path.extname(filepath);
        console.log(path.basename(filepath, ext));
        grunt.log.writeln('Reading SASS file at "' + f.dest + '"');
        return grunt.file.read(f.dest);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
