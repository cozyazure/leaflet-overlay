(() => {
    'use strict';
    angular.module('leaflet-overlay')
        .controller('homeCtrl', ["$scope", "$log", "leafletData", "leafletBoundsHelpers", 'Upload', 'apiSvc', '$q', function($scope, $log, leafletData, leafletBoundsHelpers, Upload, apiSvc, $q) {
            let originalZoomLevel = 14;
            let currentUser = "traverseAI"; // be here until user module / session is up
            $scope.currentEditingMarkerId = 0;
            angular.extend($scope, {
                center: {
                    lat: 52.52,
                    lng: 13.40,
                    zoom: originalZoomLevel
                },
                markers: [],
                layers: {
                    baselayers: {
                        googleTerrain: {
                            name: 'Google Terrain',
                            layerType: 'TERRAIN',
                            type: 'google'
                        },
                        googleHybrid: {
                            name: 'Google Hybrid',
                            layerType: 'HYBRID',
                            type: 'google'
                        },
                        googleRoadmap: {
                            name: 'Google Streets',
                            layerType: 'ROADMAP',
                            type: 'google'
                        }
                    }
                }
            });
            $scope.showGeoCoord = (lat, lng) => {
                return lat.toFixed(3) + ', ' + lng.toFixed(3)
            }
            $scope.toggleMarker = (marker) => {
                //negate everything;
                marker.opacity ? marker.opacity = 0 : marker.opacity = 1;
            }

            $scope.editMarker = (marker) => {
                if ($scope.currentEditingMarkerId===0) {
                    //proceed only when nobody else is editing
                    $scope.currentEditingMarkerId = marker.id;
                    marker.draggable = true;
                }else{
                    //show message that current editing
                }

            }
            $scope.saveEditedMarker = (marker) => {
                marker.draggable = false;
                $scope.currentEditingMarkerId = 0;
            }

            $scope.$watch("center.zoom", (zoom) => {
                var zoomindex = zoom - originalZoomLevel;
                angular.forEach($scope.markers, (marker) => {
                    marker.icon.iconSize.forEach((latlong, index) => {
                        //google maps scales twice for evey zoom
                        //http://gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to
                        marker.icon.iconSize[index] = marker.icon.oriIconSize[index] * Math.pow(2, zoomindex);
                    })
                })
            });

            $scope.uploadFiles = (file, errFiles) => {
                $scope.f = file;
                $scope.errFile = errFiles && errFiles[0];
                if (file) {
                    $q.all([
                        Upload.imageDimensions(file),
                        Upload.base64DataUrl(file)
                    ]).then(function(responses) {
                        var dimension = responses[0];
                        var dataurl = responses[1];
                        var newMarker = ConstructMarker(currentUser, file.name, $scope.center.lat, $scope.center.lng, dimension, dataurl);

                        //upload marker to database;
                        apiSvc.uploadMarkers(newMarker).then((response) => {
                            var newmarker = response.data;
                            newmarker.draggable =true;
                            $scope.markers.push(newmarker);
                            $scope.currentEditingMarkerId = newmarker.id;
                        }, (error) => {
                            console.log('error', error);
                        });
                    }, function(error) {
                        $log.error;
                    })

                }
            }
            apiSvc.getMarkersByUser(currentUser).then((response) => {
                $scope.markers = response.data;
            });

        }])
})();


function ConstructMarker(ownerName, filename, lat, lng, dimension, dataurl) {
    return {
        owner: ownerName,
        imagename: filename,
        opacity: 1,
        lat: lat,
        lng: lng,
        icon: {
            type: 'div',
            iconSize: [dimension.width, dimension.height],
            oriIconSize: [dimension.width, dimension.height],
            popupAnchor: [0, 0],
            html: '<img src="' + dataurl + '" style="width:100%;"/>',
        },
        draggable: false,
        isonline: true,
        iconangle: 0,
        sharewith: []
    }
}