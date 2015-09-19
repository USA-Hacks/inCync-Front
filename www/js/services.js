angular.module('cync.services', ['cync.parse'])

.factory('groups', function(incyncParse) {
    var getGroups = function() {
        var groups = JSON.parse(window.localStorage['groups'] || '[]');
        return groups;
    };

    var addGroup = function(groupName, callback) {
        var groups = getGroups();
        incyncParse.create_presentation(groupName).then(function(data) {
            groups.push({name: groupName, id: data.result});
            window.localStorage['groups'] = JSON.stringify(groups);
            if (callback) callback(data.result);
        });
    };

    var deleteGroup = function(groupName) {
        var groups = getGroups().filter(function(group) {
            return group.name !== groupName;
        });

        window.localStorage['groups'] = JSON.stringify(groups);
        return groups;
    };

    var getGroup = function(id) {
        return getGroups().filter(function(group) {
            return group.id === id;
        })[0];
    }

    return {
        getGroups: getGroups,
        addGroup: addGroup,
        deleteGroup: deleteGroup,
        getGroup: getGroup
    };
});
