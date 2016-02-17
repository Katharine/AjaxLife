/* eslint
  no-empty-label: 0,
  space-before-keywords: 0,
  space-after-keywords: 0,
  space-return-throw-case: 0
*/
module.exports = function gruntConfig(grunt) {
  module.require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    eslint: {
      options: {
        configFile: '.eslintrc',
      },
      Gruntfile: [
        'Gruntfile.js',
      ],
      client: [
        'server/client/AjaxLife.js',
        'server/client/AjaxLife.*.js',
        '!server/client/AjaxLife.Libs.js',
      ],
    },
    watch: {
      Gruntfile: {
        files: [
          'Gruntfile.js',
        ],
        tasks: [
          'eslint:Gruntfile',
        ],
      },
      client: {
        files: '<%= eslint.client %>',
        tasks: [
          'eslint:client',
        ],
      },
    },
  });

  grunt.registerTask('default', [
    'eslint:Gruntfile',
    'eslint:client',
  ]);
};
