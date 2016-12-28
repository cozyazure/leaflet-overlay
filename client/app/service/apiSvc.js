(() => {
    'use strict';
    angular.module('leaflet-overlay')
        .service('apiSvc', ['$http', function($http) {
            return {
                uploadMarker: function (marker) {
                    return $http.post('/api/uploadMarker', marker);
                },
                getMarkersByUser: function (currentuser) {
                    return $http.get('/api/getMarkersByUser/' + currentuser)
                },
                updateMarkerGeoCoordById:function(marker){
                     return $http.put('/api/updateMarkerGeoCoordById/',{
                         id:marker.id,
                         lat: marker.lat,
                         lng:marker.lng
                     })
                }
            }
        }])
})();