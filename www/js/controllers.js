angular.module('cync.controllers', ['cync.services', 'cync.parse'])

.controller('NewCtrl', function($scope, $state, groups, incyncParse) {
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
            groups.addGroup($scope.group.name, function(id) {
                $state.go('group', {id: id});
            });
        }
    };
})

.controller('CyncCtrl', function($scope, $state, groups) {
    $scope.groups = groups.getGroups();
    $scope.addGroup = function() {
        $state.go('new');
    };

    $scope.goto = function(id) {
        $state.go('group', {id: id});
    }
})

.controller('GroupCtrl', function($scope, $stateParams, groups) {
    $scope.group = groups.getGroup($stateParams.id);
});
