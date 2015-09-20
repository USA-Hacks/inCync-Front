angular.module('cync.controllers', ['ionic', 'cync.services', 'cync.parse'])

.controller('NewCtrl', function($scope, $state, groups, incyncParse, $ionicHistory) {
    $scope.group = {};
    $scope.group.name = '';
    $scope.inputValid = '';

    $scope.validate = function() {
        if ($scope.group.name !== '') {
            $scope.inputValid = '';
            incyncParse.validate($scope.group.name).then(
              function(data) {
                $scope.inputValid = data.result ? 'input-invalid' : 'input-valid';
              },
              function(error) {
                $scope.inputValid = 'input-error';
              }
            )
        } else {
          $scope.inputValid = '';
        }
    };

    $scope.addGroup = function() {
        if ($scope.inputValid === 'input-valid') {
            groups.addGroup($scope.group.name, function(id) {
                $scope.group = {name: ''};
                $scope.inputValid = '';
                $scope.groups = groups.getGroups();
                $scope.fabAction();
            });
        } else if ($scope.inputValid === 'input-invalid') {
            groups.joinGroup($scope.group.name, function() {
                $scope.group = {name: ''};
                $scope.inputValid = '';
                $scope.groups = groups.getGroups();
                $scope.fabAction();
            });
        }
    };
})

.controller('GroupsCtrl', function($scope, $state, $rootScope) {
    console.log($scope.groups);
    $scope.goto = function(id) {
        $rootScope.button = 'reply';
        $state.go('cync.group', {id: id});
    }
})

.controller('CyncCtrl', function($scope, $state, groups, $rootScope) {
    $rootScope.button = 'add';
    $scope.groups = groups.getGroups();

    $scope.fabAction = function() {
        if ($rootScope.button === 'add') {
            $rootScope.button = 'reply';
            $state.go('cync.new');
        } else {
            $rootScope.button = 'add';
            $scope.groups = groups.getGroups();
            $state.go('cync.groups');
        }
    };
})

.controller('GroupCtrl', function($scope, $stateParams, $state, groups) {
    $scope.group = {};
    $scope.doneLoading = false;
    groups.getGroup($stateParams.id, function(group) {
        $scope.doneLoading = true;
        $scope.group = group;
    });

    $scope.gotoTimer = function() {
        $state.go('.timer');
    }
});
