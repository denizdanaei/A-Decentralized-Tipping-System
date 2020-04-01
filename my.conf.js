// Karma configuration
// Generated on Wed Apr 01 2020 09:27:51 GMT+0200 (Midden-Europese zomertijd)

module.exports = function(config) {
  config.set({
    files: [
      'tipping.js',
      'my_ripple_experiment/transaction.js',
      'jasmine-standalone-3.5.0/spec/*.js'
    ],

    frameworks: ['jasmine'],

    // coverage reporter generates the coverage
    reporters: ['progress', 'coverage'],
 
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'tipping.js': ['coverage']
    },

    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-chrome-launcher'
    ],


    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
 
    // optionally, configure the reporter

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    }
  });
};
