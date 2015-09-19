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
                console.log(data);
                $scope.inputValid = data.result ? 'input-invalid' : 'input-valid';
              },
              function(error) {
                $scope.inputValid = '';
              }
            )
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
