// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ngMaterial', 'ionic', 'ionic.service.core', 'cync.controllers', 'cync.services', 'cync.parse', 'pubnub.angular.service'])

.run(function($ionicPlatform, PubNub) {
  PubNub.init({
    publish_key:'pub-c-5f5b4359-bec5-4bb4-a396-db7ccb6282ce',
    subscribe_key:'sub-c-8495b6b2-5f09-11e5-a028-0619f8945a4f'
  })
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $mdThemingProvider, $mdIconProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('cync', {
      url: '/cync',
      templateUrl: 'templates/cync.html',
      controller: 'CyncCtrl'
  })

  .state('cync.group', {
      url: '/group/:id',
      views: {
          'outerContent': {
              templateUrl: 'templates/group.html',
              controller: 'GroupCtrl'
          }
      }
  })

  .state('cync.group.timer', {
      url: '/timer',
      views: {
          'innerContent': {
              templateUrl: 'templates/timer.html'
          }
      }
  })

  .state('cync.new', {
     url: '/new',
     views: {
         'outerContent': {
             templateUrl: 'templates/new.html',
             controller: 'NewCtrl'
         }
     }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/cync');

  $mdThemingProvider.theme('default').primaryPalette('blue-grey').accentPalette('deep-purple');

  $mdIconProvider
      .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
      .defaultIconSet('img/icons/sets/core-icons.svg', 24);
});
