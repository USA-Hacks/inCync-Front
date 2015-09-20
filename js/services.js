angular.module('cync.services', ['cync.parse'])

.factory('groups', function(incyncParse, PubNub) {
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

    var joinGroup = function(groupName, callback) {
        var groups = getGroups();
        var res = groups.filter(function(g) { return g.name === groupName });
        if (res.length !== 0 && callback) {
            callback()
        } else {
            incyncParse.get_presentation(groupName).then(function(data) {
                data = JSON.parse(data.result);
                var res = groups.filter(function(g) { return g.name === groupName });

                if (res.length === 0) {
                    groups.push({name: data.name, id: data.objectId});
                    window.localStorage['groups'] = JSON.stringify(groups);
                }

                if (callback) callback();
            });
        }
    }

    var deleteGroup = function(groupName) {
        var groups = getGroups().filter(function(group) {
            return group.name !== groupName;
        });

        window.localStorage['groups'] = JSON.stringify(groups);
    };

    var getGroup = function(id, callback) {
        incyncParse.get_presentation(id).then(function(data) {
            var res = JSON.parse(data.result);
            res.clock = res.settings.slice(-1)[0];
            var groups = getGroups();

            if (callback) callback(res);
        }, function(e) { console.log("OMG", e); });
    }

    return {
        getGroups: getGroups,
        addGroup: addGroup,
        deleteGroup: deleteGroup,
        getGroup: getGroup,
        joinGroup: joinGroup
    };
});
