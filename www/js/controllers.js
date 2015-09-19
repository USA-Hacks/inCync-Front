angular.module('cync.controllers', ['cync.services'])

.controller('NewCtrl', function($scope, $state, groups, remote) {
    $scope.group = {};
    $scope.group.name = '';
    $scope.inputValid = '';

    $scope.validate = function() {
        if ($scope.group.name !== '') {
            $scope.inputValid = remote.validate($scope.group.name) ? 'input-valid' : 'input-invalid';
        } else {
            $scope.inputValid = '';
        }
    };

    $scope.addGroup = function() {
        groups.addGroup($scope.group);
        console.log(groups.getGroups());
        $state.go('cync');
    };
})

.controller('CyncCtrl', function($scope, groups) {
    $scope.groups = groups.getGroups();
});
