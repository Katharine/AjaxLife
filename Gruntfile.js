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
        'client/AjaxLife.js',
        'client/AjaxLife.Constants.js',
        'client/AjaxLife.Friends.js',
        'client/AjaxLife.Groups.js',
        'client/AjaxLife.InstantMessage.js',
        'client/AjaxLife.Inventory.js',
        'client/AjaxLife.InventoryProperties.js',
        'client/AjaxLife.Keyboard.js',
        'client/AjaxLife.LSL.js',
        'client/AjaxLife.Map.js',
        'client/AjaxLife.Media.js',
        'client/AjaxLife.MiniMap.js',
        'client/AjaxLife.NameCache.js',
        'client/AjaxLife.Network.js',
        'client/AjaxLife.NewSearch.js',
        'client/AjaxLife.Notecard.js',
        'client/AjaxLife.Parcel.js',
        'client/AjaxLife.Profile.js',
        'client/AjaxLife.ScriptDialog.js',
        'client/AjaxLife.Search.js',
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
        files: [
          'client/AjaxLife.js',
          'client/AjaxLife.Constants.js',
          'client/AjaxLife.Friends.js',
          'client/AjaxLife.Groups.js',
          'client/AjaxLife.InstantMessage.js',
          'client/AjaxLife.Inventory.js',
          'client/AjaxLife.InventoryProperties.js',
          'client/AjaxLife.Keyboard.js',
          'client/AjaxLife.LSL.js',
          'client/AjaxLife.Map.js',
          'client/AjaxLife.Media.js',
          'client/AjaxLife.MiniMap.js',
          'client/AjaxLife.NameCache.js',
          'client/AjaxLife.Network.js',
          'client/AjaxLife.NewSearch.js',
          'client/AjaxLife.Notecard.js',
          'client/AjaxLife.Parcel.js',
          'client/AjaxLife.Profile.js',
          'client/AjaxLife.ScriptDialog.js',
          'client/AjaxLife.Search.js',
        ],
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
