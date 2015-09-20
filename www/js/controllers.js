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
                $state.go('cync.groups');
            });
        } else if ($scope.inputValid === 'input-invalid') {
            groups.joinGroup($scope.group.name, function() {
                $scope.group = {name: ''};
                $scope.inputValid = '';
                $scope.groups = groups.getGroups();
                $state.go('cync.groups');
            });
        }
    };
})

.controller('GroupsCtrl', function($scope, $state, $rootScope, groups, $window) {
    $scope.groups = groups.getGroups();

    $scope.$on('$ionicView.beforeEnter', function() {
        console.log(8)
        $scope.groups = groups.getGroups();
    });

    $scope.goto = function(group) {
        $rootScope.button = 'reply';
        $state.go('cync.group', {id: group.name});
    };

    $scope.delete = function(group) {
        groups.deleteGroup(group.name);
        $state.go($state.current, {}, {reload: true});
    }
})

.controller('CyncCtrl', function($scope, $state, groups, $rootScope) {
    $rootScope.button = 'add';

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

.controller('GroupCtrl', function($scope, $stateParams, $state, groups, incyncParse, $cordovaVibration) {
    $scope.group = {};
    $scope.settings = {};
    $scope.doneLoading = false;
    $scope.started = false;
    groups.getGroup($stateParams.id, function(group) {
        $scope.doneLoading = true;
        $scope.group = group;
    });

    $scope.gotoTimer = function() {
        $scope.started = true;
    };

    $scope.start = function() {
        console.log($scope.group)
        if ($scope.settings.count && $scope.settings.interval) {
            var arr = [];
            for (var i = 0; i < $scope.settings.count; ++i) {
                arr.push($scope.settings.interval * (i + 1));
            }
            arr.push($scope.settings.count * $scope.settings.interval);

            incyncParse.update_presentation($scope.group.objectId, arr).then(function() {

            });

            try {
                $cordovaVibration.vibrate(2500);
            } catch (e) {
                navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

                if (navigator.vibrate) {
                    navigator.vibrate(2500);
                } else {
                    alert('Vibration is not supported on this device');
                }
            }
        }
    }
});
