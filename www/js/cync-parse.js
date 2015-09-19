angular.module('cync.parse', [])

.factory('incyncParse', function($q, $http) {
    var cyncAPI = "https://api.parse.com/1/functions";
    var cyncHeaders = {
      'Content-Type': 'application/json',
      'X-Parse-Application-Id': 'w2xsWBBHSdJg7UkZAyA0We19GMbV9rMPKwnRBYv6',
      'X-Parse-REST-API-Key': 'GWZTomC5WNZwDFgYAZAyXvex2ECtE3u9hjzT0F1W'
    };

    var validate = function(name)  {
        var dataPromise = $q.defer();

        var data = {
          name: name
        }

        $http({
          url: cyncAPI + "/validate",
          method: "POST",
          data: JSON.stringify(data),
          headers: cyncHeaders
        })
        .success(function (data, status, headers, config) {
           dataPromise.resolve(data);
        })
        .error(function (data, status, headers, config) {
           dataPromise.reject();
        });
        return dataPromise.promise;
    };

    return {
        validate: validate
    };
})
