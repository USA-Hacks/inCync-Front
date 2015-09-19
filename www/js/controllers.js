angular.module('cync.controllers', ['cync.services', 'cync.parse'])

.controller('NewCtrl', function($scope, $state, groups, remote, incyncParse) {
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
                $scope.inputValid = 'input-invalid';
              }
            )
        } else {
          $scope.inputValid = '';
        }
    };

    $scope.addGroup = function() {
        if ($scope.inputValid === 'input-valid') {
            groups.addGroup($scope.group);
            $state.group = {name: ''};
            $state.go('cync');
        }
    };
})

.controller('CyncCtrl', function($scope, $state, groups) {
    $scope.groups = groups.getGroups();
    $scope.addGroup = function() {
        $state.go('new');
    };

    $scope.goto = function(name) {
        $state.go('group', {name: name});
    }
})

.controller('GroupCtrl', function($scope, $stateParams, groups) {
    console.log($stateParams.name);
    $scope.group = groups.getGroup($stateParams.name);
});
