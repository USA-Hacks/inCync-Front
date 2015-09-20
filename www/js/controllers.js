angular.module('cync.controllers', ['ionic', 'cync.services', 'cync.parse'])

.controller('NewCtrl', function($scope, $state, groups, incyncParse, $ionicHistory, $rootScope) {
    $scope.group = {};
    $scope.group.name = '';
    $scope.inputValid = '';
    $rootScope.button = 'reply';

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

.controller('GroupsCtrl', function($scope, $state, $rootScope, groups, $window, PubNub) {
    $scope.groups = groups.getGroups();
    $rootScope.button = 'add';

    if (!$scope.groups || $scope.groups.length === 0) {
        $state.go('cync.new');
    }

    if (window.subscribed) {
        window.subscribed.forEach(function(group) {
            console.log('leaving ' + group.name);
            PubNub.ngUnsubscribe({channel: group.objectId});
        });
        window.subscribed = undefined;
    }

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

    $scope.goHome = function() {
        $state.go('cync.groups');
    };

    $scope.goNew = function() {
        $state.go('cync.new');
    }

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

.controller('GroupCtrl', function($rootScope, $scope, $stateParams, $state, groups, incyncParse, $cordovaVibration, PubNub) {
    $rootScope.button = 'reply';
    $scope.group = {};
    $scope.settings = {};
    $scope.doneLoading = false;
    $scope.started = false;
    groups.getGroup($stateParams.id, function(group) {
        $scope.doneLoading = true;
        $scope.group = group;
        $scope.clock = 0;
        console.log(group);
        $scope.settings.interval = group.settings.join(', ');
        //$scope.$apply();

        console.log('subscribing to ' + $scope.group.name);
        window.subscribed = window.subscribed || [];
        window.subscribed.push($scope.group);
        PubNub.ngSubscribe({ channel: $scope.group.objectId })
        $rootScope.$on(PubNub.ngMsgEv($scope.group.objectId), function(event, payload) {
            console.log(payload.message.type);
            $scope.started = true;
            $scope.$apply();
            if (payload.message.type === 'vibrate') {
                try {
                    $cordovaVibration.vibrate(750);
                } catch (e) {
                    console.log('vibrating!');
                    window.navigator.vibrate(750);
                }
            } else if (payload.message.type === 'start') {
                $scope.clock = $scope.group.clock;

                new Timer({
                    ontick: function() {
                        --$scope.clock;
                        $scope.$apply();
                    }
                }).start($scope.group.clock + 1);
            }
        });
    });

    $scope.deleteTime = function(time) {
      var index = $scope.group.settings.indexOf(time);
      if (index > -1) {
          $scope.group.settings.splice(index, 1);
      }
    }

    $scope.addTime = function() {
      var time = (parseInt($scope.settings.mins || '0') * 60) + parseInt($scope.settings.secs || '0');
      var index = $scope.group.settings.indexOf(time);
      if(index === -1) {
        $scope.group.settings.push(time);
      }
    }

    $scope.save = function(callback) {
        $scope.group.clock = parseInt($scope.group.settings[$scope.group.settings.length - 1]);
        incyncParse.update_presentation($scope.group.objectId, $scope.group.settings).then(function() {
            if (callback) callback();
        });
    };

    $scope.start = function() {
        $scope.save(function() {
            incyncParse.start_presentation($scope.group.objectId);
        });
    };
});
