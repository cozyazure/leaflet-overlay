(() => {
    'use strict';
    angular.module('leaflet-overlay')
        .controller('homeCtrl', ["$scope", "$log", "leafletData", "leafletBoundsHelpers", 'Upload', 'apiSvc', '$q', function($scope, $log, leafletData, leafletBoundsHelpers, Upload, apiSvc, $q) {
            let originalZoomLevel = 14;
            let currentUser = "traverseAI"; // be here until user module / session is up
            $scope.currentEditingMarker = {
                id: 0,
                lat: 0,
                lng: 0
            }
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
                if ($scope.currentEditingMarker.id === 0) {
                    //proceed only when nobody else is editing
                    $scope.currentEditingMarker.id = marker.id;
                    $scope.currentEditingMarker.lat = marker.lat;
                    $scope.currentEditingMarker.lng = marker.lng;
                    marker.draggable = true;
                } else {
                    //show message that current editing
                }

            }
            $scope.saveEditedMarker = (marker) => {
                apiSvc.updateMarkerGeoCoordById(marker).then((response) => {
                    marker.draggable = false;
                    $scope.currentEditingMarker.id = 0;
                    $scope.currentEditingMarker.lat = 0;
                    $scope.currentEditingMarker.lng = 0;
                }, (error) => { $log(error) })

            }
            $scope.discardEditedMarker = (marker) => {
                marker.draggable = false;
                marker.lat = $scope.currentEditingMarker.lat;
                marker.lng = $scope.currentEditingMarker.lng;
                $scope.currentEditingMarker.id = 0;
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
                        apiSvc.uploadMarker(newMarker).then((response) => {
                            var newmarker = response.data;
                            newmarker.draggable = true;
                            $scope.markers.push(newmarker);
                            $scope.markers.sort(function(a, b) { return a.id - b.id });
                            $scope.currentEditingMarker.id = newmarker.id;
                            $scope.currentEditingMarker.lat = newmarker.lat;
                            $scope.currentEditingMarker.lng = newmarker.lng;
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
                $scope.markers.sort(function(a, b) { return a.id - b.id });
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