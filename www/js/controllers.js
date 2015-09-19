angular.module('cync.controllers', ['cync.services'])

.controller('NewCtrl', function($scope, $state, groups, remote) {
    $scope.group = {};
    $scope.group.name = '';

    $scope.validate = function() {
        return remote.validate($scope.group.name);
    };

    $scope.addGroup = function() {
        groups.addGroup($scope.group.name);
        console.log(groups.getGroups());
        //$state.go('cync', $scope.group.name);
    };
});
