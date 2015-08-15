angular.module('starter.controllers', [])

.controller('SigninCtrl', function($scope, Project) {

})
.controller('SignupCtrl', function($scope, Project) {

})

.controller('DashCtrl', function($scope, Project) {

  var projetos = Project.all();

  $scope.projetos = projetos;
})

.controller('ProjectDetailCtrl', function($scope, $stateParams, Project) {
  $scope.project = Project.get($stateParams.id);
})

.controller('ProjectAppointmentCtrl', function($scope, $stateParams, Project, Appointment) {
  $scope.appointment = {};
  $scope.today = moment().format("LLLL");
  $scope.project = Project.get($stateParams.id);

  var appointment = $scope.appointment;

  $scope.checkin = function() {
    appointment.checkin = moment().format("HH:mm:ss");
    //send to api
  };

  $scope.breakin = function() {
    appointment.breakin = moment().format("HH:mm:ss");
    //send to api
  };

  $scope.breakout = function() {
    appointment.breakout = moment().format("HH:mm:ss");
    //send to api
  };

  $scope.checkout = function() {
    appointment.checkout = moment().format("HH:mm:ss");
    //send to api
  };
})

.controller('AppointmentsCtrl', function($scope) {
  var getDaysInMonth = function(month,year) {
    // Here January is 1 based
    //Day 0 is the last day in the previous month
    
   return new Date(year, month, 0).getDate();
  };

  var today = new Date();
  var total = getDaysInMonth(today.getMonth(), today.getFullYear());
  var schedule = [];

  for (var i = total; i > 0; i--) {
    console.log(i);
    schedule.push(i);
  };

  $scope.days = schedule;

  // get from api the month appointments of the user
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
