Messages = new Mongo.Collection('messages');
 
// This code only runs on the client
if (Meteor.isClient) {
 
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  angular.module('chat',['angular-meteor', 'ngMaterial']);
 
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
          username: Meteor.user().username
        });
      };

      $scope.isMe = function (msg) {
        console.log(Meteor.userId());
        return msg.owner === Meteor.userId();
      }
 
    }]);

  angular.module('chat').config(themeIcons);

  function themeIcons ($mdIconProvider) {
    $mdIconProvider
      .iconSet("social", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg")
      .iconSet("action", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg")
      .iconSet("communication", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg")
      .iconSet("content", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg")
      .iconSet("toggle", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg")
      .iconSet("navigation", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg")
      .iconSet("image", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg");

      // there are more icon sprites available, check out the material-design-icons page
    };
  }

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
