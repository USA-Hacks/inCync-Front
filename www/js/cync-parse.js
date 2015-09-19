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

    var create_presentation = function(name, settings) {
      settings = settings || [];
      var dataPromise = $q.defer();

      var data = {
        name: name,
        settings: settings
      }

      $http({
        url: cyncAPI + "/create_presentation",
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

    var get_presentation = function(name)  {
        var dataPromise = $q.defer();

        var data = {
          name: name
      };

        $http({
          url: cyncAPI + "/get_presentation",
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

    var start_presentation = function(id)  {
        var dataPromise = $q.defer();

        var data = {
          id: id
        }

        $http({
          url: cyncAPI + "/start_presentation",
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
        validate: validate,
        create_presentation: create_presentation,
        get_presentation: get_presentation,
        start_presentation: start_presentation
    };
})
