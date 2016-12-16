
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'mini_inbox_app' is the name of our angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of dependencies which our inbox app requires
angular.module('mini_inbox_app', ['ionic'])


//this function runs on startup
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hides the keyboard by default 
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

/* configures angular router */

.config(function($stateProvider, $urlRouterProvider){
$stateProvider
    .state('login', {
    url: '/login',
    templateUrl: "app/login/login.html",
    controller: 'login-ctrl'
  })
   .state('fb-contacts', {
    url: '/fb-contacts',
    templateUrl: "app/contacts/fb-contacts.html",
    controller: 'fb-ctrl'
  })
   .state('gplus-contacts', {
    url: '/gplus-contacts',
    templateUrl: "app/contacts/gplus-contacts.html",
    controller: "gplus-ctrl"
  })
   .state('messaging', {
    url: '/messaging',
    templateUrl: "app/chat/messaging.html",
    controller: "messaging-ctrl"
  });

 $urlRouterProvider.otherwise('/login');
}).constant('login',true);
