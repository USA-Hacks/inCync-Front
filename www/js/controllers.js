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
                $state.go('cync');
            });
        } else if ($scope.inputValid === 'input-invalid') {
            groups.joinGroup($scope.group.name, function() {
                $scope.group = {name: ''};
                $scope.inputValid = '';
                $state.go('cync');
            });
        }
    };
})

.controller('CyncCtrl', function($scope, $state, groups) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.groups = groups.getGroups();
    });

    $scope.addGroup = function() {
        $state.go('new');
    };

    $scope.goto = function(id) {
        $state.go('group', {id: id});
    }
})

.controller('GroupCtrl', function($scope, $stateParams, groups) {
    $scope.group = {};
    groups.getGroup($stateParams.id, function(group) {
        $scope.group = group;
    });
});
