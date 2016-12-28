(() => {
    'use strict';
    angular.module('leaflet-overlay')
        .service('apiSvc', ['$http', function($http) {
            return {
                uploadMarkers: function (marker) {
                    return $http.post('/api/uploadMarkers', marker);
                },
                getMarkersByUser: function (currentuser) {
                    return $http.get('/api/getMarkersByUser/' + currentuser)
                }
            }
        }])
})();