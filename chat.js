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
        return Messages.find({}, { sort: { createdAt: 1 } })
      });

      $scope.addMessage = function (newMsg) {
        $scope.messages.push( {
          text: newMsg,
          createdAt: new Date(),
          owner: Meteor.userId(),
          username: Meteor.user().username
        });
      };

      $scope.isMe = function (task) {
        console.log(Meteor.userId());
        return task.owner === Meteor.userId();
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

    if (Messages.find().count() === 0) {

      var fake_messages = [
        {'text': 'Come to the dark side!', createdAt: new Date(), owner: 'Cgc56SntriLN4GLFG', username: 'Vader'},
        {'text': 'Whats the frequency', createdAt: new Date(), owner: 'r76kZTopyp2HPpcpw', username: 'sca'},
        {'text': 'I have been waiting for you!', createdAt: new Date(), owner: 'Cgc56SntriLN4GLFG', username: 'Vader'}
      ];

      for (var i = 0; i < fake_messages.length; i++)
        Messages.insert(fake_messages[i]);

    }

  });
}
