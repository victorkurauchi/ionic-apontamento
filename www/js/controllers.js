angular.module('starter.controllers', [])

.controller('SigninCtrl', function($scope, LoginService, $state, Utils, UserService) {
  $scope.login = {};

  $scope.doLogin = function(login) {
    Utils.displayLoading();
    if (login.email && login.password) {
      login.password = CryptoJS.MD5(login.password).toString();
      LoginService.doLogin(login)
      .then(function(result) {
        UserService.setLogged(result.data)
        .then(function(logged) {
          Utils.hideLoading();
          $scope.login = {};
          $state.go('tab.dash');
        });
      }, function(error) {
        Utils.hideLoading();
        Utils.showAlert(error.data.reason);
      });
    }
  }
})

.controller('SignupCtrl', function($scope, Project) {

})

.controller('DashCtrl', function($scope, Project, $stateParams, UserService, $state, Utils, $timeout) {
  var user = UserService.getLogged();

  if (! user ) {
    $state.go('signin');
  } else {
    Utils.displayLoading();
    Project.allFromUser(user.companyId)
    .then(function(result) {
      Utils.hideLoading();
      $timeout(function() {
        $scope.projetos = result.data.projects;
      });
    }, function(error) {
      Utils.hideLoading();
      Utils.showAlert(error.data.reason);
    });
  }
})

.controller('ProjectDetailCtrl', function($scope, $stateParams, Project) {
  Project.get($stateParams.id)
  .then(function(result) {
    var _project = result.data;
    if (_project) {
      $scope.project = _project;
      Project.setCurrentProjectInSession(_project);
    }
  }, function(error) {
    Utils.showAlert(error.data.reason);
  });
})

.controller('ProjectAppointmentCtrl', function($scope, $stateParams, Project, Appointment, UserService, Utils, $state, $timeout) {
  $scope.appointment = {};
  $scope.today = moment().format("LLLL");

  var user = UserService.getLogged();
  var data = {};
  var project;
  var day = new Date().getDate();

  if (! user || ! user._id) {
    $state.go('signin');
  } else {
    Project.get($stateParams.id)
    .then(function(result) {

      // google sugests using $timeout instead $apply()
      $timeout(function() {
        $scope.project = result.data;

        project = $scope.project;
        data.projectId = project._id;
        data.projectName = project.name;
        data.companyId = project.companyId;

        // if the user already registered any appointment for today, we need to handle the checkboxes
        Appointment.getFromCurrentDay(user._id, day, data.projectId)
        .then(function(result) {
          if (result.data) {
            handleFields(result.data);
          }
        }, function(error) {
          Utils.showAlert(error.data.reason);
        })
      });
    }, function(error) {
      Utils.showAlert(error.data.reason);
    });
  }

  function handleFields(appointment) {
    var appoint = $scope.appointment;
    for (var x in appointment) {
      var element = appointment[x];
      if (moment(element).isValid()) {
        element = new Date(element);
        element = moment(element).format("HH:mm:ss");
      }
      appoint[x] = element;
    }
  }

  $scope.checkin = function() {
    if (! user) {
      Utils.showAlert("Você precisa estar logado para prosseguir :)");
    } else {
      data.checkin = new Date();
      data.userId = user._id;
      $scope.appointment.userId = data.userId;

      Appointment.add(data)
      .then(function(result){
        $scope.appointment.checkin = moment().format("HH:mm:ss");
        $scope.appointment._id = result.data._id;
      }, function(error) {
        console.log(error);
        Utils.showAlert("Serviço indisponível, tente em instantes. ");
      });
    }
  };

  $scope.breakin = function() {
    if (! $scope.appointment.userId) {
      Utils.showAlert("Você precisa estar logado para prosseguir :)");
      return;
    }

    if (! $scope.appointment._id) {
      Utils.showAlert("Seu apontamento não foi gerado corretamente. É necessário um id");
    } else {
      var info = {};
      info.breakin = new Date();
      info.userId = $scope.appointment.userId;
      info._id = $scope.appointment._id;

      Appointment.update(info)
      .then(function(result){
        console.log(result);
        if (! result.data.updated) {
          Utils.showAlert("Não foi possível atualizar seu breakin");
        } else {
          $scope.appointment.breakin = moment().format("HH:mm:ss");
        }
      }, function(error) {
        Utils.showAlert("Serviço indisponível, tente em instantes. ");
      });
    }
  };

  $scope.breakout = function() {
    if (! $scope.appointment.userId) {
      Utils.showAlert("Você precisa estar logado para prosseguir :)");
      return;
    }

    if (! $scope.appointment._id) {
      Utils.showAlert("Seu apontamento não foi gerado corretamente. É necessário um id");
    } else {
      var info = {};
      info.breakout = new Date();
      info.userId = $scope.appointment.userId;
      info._id = $scope.appointment._id;

      Appointment.update(info)
      .then(function(result){
        if (! result.data.updated) {
          Utils.showAlert("Não foi possível atualizar seu breakin");
        } else {
          $scope.appointment.breakout = moment().format("HH:mm:ss");
        }
      }, function(error) {
        Utils.showAlert("Serviço indisponível, tente em instantes. ");
      });
    }
  };

  $scope.checkout = function() {
    if (! $scope.appointment.userId) {
      Utils.showAlert("Você precisa estar logado para prosseguir :)");
      return;
    }

    if (! $scope.appointment._id) {
      Utils.showAlert("Seu apontamento não foi gerado corretamente. É necessário um id");
    } else {
      var info = {};
      info.checkout = new Date();
      info.userId = $scope.appointment.userId;
      info._id = $scope.appointment._id;

      Appointment.update(info)
      .then(function(result){
        if (! result.data.updated) {
          Utils.showAlert("Não foi possível atualizar seu breakin");
        } else {
          $scope.appointment.checkout = moment().format("HH:mm:ss");
        }
      }, function(error) {
        Utils.showAlert("Serviço indisponível, tente em instantes. ");
      });
    }
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
    schedule.push(i);
  };

  $scope.days = schedule;

  // get from api the month appointments of the user
})

.controller('AccountCtrl', function($scope, UserService, $state) {
  var user = UserService.getLogged();
  if (! user) {
    $state.go('signin');
  } else {
    $scope.user = user;
  }

  $scope.logout = function() {
    UserService.destroy();
    $state.go('signin');
  };
});
