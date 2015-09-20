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
                $scope.fabAction()
            });
        } else if ($scope.inputValid === 'input-invalid') {
            groups.joinGroup($scope.group.name, function() {
                $scope.group = {name: ''};
                $scope.inputValid = '';
                $scope.groups = groups.getGroups();
                $state.go('cync');
            });
        }
    };
})

.controller('CyncCtrl', function($scope, $state, groups) {
    $scope.button = 'add';
    $scope.groups = groups.getGroups();

    $scope.fabAction = function() {
        if ($scope.button === 'add') {
            $scope.button = 'reply';
            $state.go('.new');
        } else {
            $scope.button = 'add';
            $scope.groups = groups.getGroups();
            $state.go('cync');
        }
    };

    $scope.goto = function(id) {
        $scope.button = 'reply';
        $state.go('.group', {id: id});
    }


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
