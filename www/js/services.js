angular.module('starter.services', [])

.factory('UserService', function($q, PocketPointingConstants) {
  var storage = PocketPointingConstants.LOCAL_STORAGE;

  return {
    getLogged: function() {
      if (localStorage.getItem(storage)) {
        return JSON.parse(localStorage.getItem(storage));
      } else {
        return null;
      }
    },
    setLogged: function(user) {
      localStorage.setItem(storage, JSON.stringify(user));
      return $q(function(resolve, reject) {
        resolve(user);
      });
    }
  }
})

.factory('ErrorService', function() {
  return {
    buildGeneric: function(message, code) {
      code = code || 400;
      message = message || "Erro interno";
      var error = {
        data: {
          reason: message,
          code: code
        }
      };

      return error;
    }
  }
})

.factory('Project', function($http, PocketPointingConstants, $q, ErrorService) {

  return {
    all: function() {
      var endpoint = PocketPointingConstants.HOST + "/publications/api/projects";
      return $http({method: "GET", url: endpoint, responseType: "json"});
    },
    allFromUser: function(companyId) {
      if (!companyId) {
        return $q(function(resolve, reject) {
          var err = ErrorService.buildGeneric("É necessário estar cacastrado em uma empresa válida.");
          reject(err);
        });
      }
      var endpoint = PocketPointingConstants.HOST + "/api/company/" + companyId +  "/projects";
      return $http({method: "GET", url: endpoint, responseType: "json"});
    },
    get: function(projectId) {
      var endpoint = PocketPointingConstants.HOST + "/api/projects/" + projectId;
      return $http({method: "GET", url: endpoint, responseType: "json"});
    },
    setCurrentProjectInSession: function(project) {
      var name = project._id;
      localStorage.setItem(name, JSON.stringify(project));
    },
    getCurrentProjectInSession: function(projectId) {
      return JSON.parse(localStorage.getItem(projectId));
    }
  };
})

.factory('LoginService', function($http, PocketPointingConstants) {
  return {
    doLogin: function(login) {
      var endpoint = PocketPointingConstants.HOST + "/api/users/login";
      return $http({method: "POST", url: endpoint, responseType: "json", data: login});
    }
  };
})

.factory('Appointment', function($http, UserService, PocketPointingConstants) {
  var user = UserService.getLogged();

  return {
    all: function() {
      return projects;
    },
    add: function(appointment) {
      var endpoint = PocketPointingConstants.HOST + "/api/appointments/add";
      return $http({method: "POST", data: appointment, url: endpoint, responseType: "json"});
    },
    update: function(appointment) {
      var endpoint = PocketPointingConstants.HOST + "/api/appointments/update";
      return $http({method: "POST", data: appointment, url: endpoint, responseType: "json"});
    },
    remove: function(chat) {
      projects.splice(projects.indexOf(chat), 1);
    },
    get: function(projectId) {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === parseInt(projectId)) {
          return projects[i];
        }
      }
      return null;
    }
  };
})

.factory('Utils', function($ionicPopup) {
  var showAlert = function(message, title) {
   var alertPopup = $ionicPopup.alert({
     title: title || 'Ooops!',
     template: message || 'Erro interno'
   });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
  };

  return {
    showAlert: showAlert
  };
})
