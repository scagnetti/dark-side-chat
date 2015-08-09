Messages = new Mongo.Collection('messages');
 
// This code only runs on the client
if (Meteor.isClient) {

  angular.module('chat',['angular-meteor', 'ngMaterial', 'ui.router']);
 
  angular.module('chat').controller('RegistrationCtrl', ['$scope', '$state',
    function($scope, $state){

      $scope.extract = function(s){
        return s.substring(0,s.indexOf('.'));
      };

      $scope.images = ['boba.png','c3po.png','chewbacca.png', 'emperor.png',
      'han.png', 'leia.png', 'luke.png', 'obi.png', 'r2d2.png', 'storm.png', 'vader.png', 'yoda.png'];

      $scope.options = $scope.images.map(function (img) { return {n: $scope.extract(img), v: img}; });

      $scope.register = function() {
        Accounts.createUser({
          username: $scope.username,
          password: $scope.password,
          profile: {avatar: $scope.avatar}
        }, function(error){
            if(error){
                console.log(error.reason);
                $scope.failure = true;
                $scope.reason = error.reason;
            } else {
                $state.go('chat')
            }
        });
      };
  }]);

  angular.module('chat').controller('LoginCtrl', ['$scope', '$state',
    function($scope, $state){

      $scope.login = function() {
        Meteor.loginWithPassword($scope.username, $scope.password, function(error){
          if(error){
            console.log(error.reason);
            $scope.failure = true;
            $scope.username = '';
            $scope.password = '';
          } else {
            $state.go('chat');
          }
        });
      };
  }]);

  angular.module('chat').controller('LogoutCtrl', ['$scope',
    function($scope){
      Meteor.logout();
  }]);

  angular.module('chat').controller('ChatCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {
 
      $scope.messages = $meteor.collection( function() {
        return Messages.find({}, { sort: { createdAt: -1 } })
      });

      $scope.addMessage = function (newMsg) {
        $scope.messages.push( {
          text: newMsg,
          createdAt: new Date(),
          owner: Meteor.userId(),
          username: Meteor.user().username,
          avatar: Meteor.user().profile['avatar']
        });
      };

      $scope.isMe = function (msg) {
        console.log(Meteor.userId());
        return msg.owner === Meteor.userId();
      }
    }]);

  angular.module('chat').run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireUser promise is rejected
      // and redirect the user back to the main page
      if (error === "AUTH_REQUIRED") {
        $state.go('login');
      }
    });
  }]);

  angular.module('chat').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){

      $locationProvider.html5Mode(true);

      $stateProvider
        .state('chat', {
          url: '/chat',
          templateUrl: 'chat.ng.html',
          controller: 'ChatCtrl',
          resolve: {
            "currentUser": ["$meteor", function($meteor){
              return $meteor.requireUser();
            }]
          }
        })
        .state('register', {
          url: '/register',
          templateUrl: 'registration.ng.html',
          controller: 'RegistrationCtrl'
        })
        .state('login', {
          url: '/login',
          templateUrl: 'login.ng.html',
          controller: 'LoginCtrl'
        })
        .state('logout', {
          url: '/logout',
          templateUrl: 'logout.ng.html',
          controller: 'LogoutCtrl'
        });

        $urlRouterProvider.otherwise('/login');
  }]);

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
