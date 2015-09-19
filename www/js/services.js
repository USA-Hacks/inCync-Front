angular.module('cync.services', [])

.factory('groups', function() {
    var getGroups = function() {
        var groups = JSON.parse(window.localStorage['groups'] || '[]');
        return groups;
    };

    var addGroup = function(groupName) {
        var groups = getGroups();
        groups.push(groupName);
        window.localStorage['groups'] = JSON.stringify(groups);
        return groups;
    };

    var deleteGroup = function(groupName) {
        var groups = getGroups().filter(function(group) {
            return group !== groupName;
        });

        window.localStorage['groups'] = JSON.stringify(groups);
        return groups;
    };

    return {
        getGroups: getGroups,
        addGroup: addGroup,
        deleteGroup: deleteGroup
    };
})

.factory('remote', function() {
    var validate = function(groupName) {
        return groupName[0] !== x;
    };

    return {
        validate: validate
    };
})
