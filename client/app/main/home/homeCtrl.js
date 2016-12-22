(() => {
    'use strict';
    angular.module('leaflet-overlay')
        .controller('homeCtrl', ["$scope", "$log", "leafletData", "leafletBoundsHelpers", 'Upload', function($scope, $log, leafletData, leafletBoundsHelpers, Upload) {
            let originalZoomLevel = 14;
            angular.extend($scope, {
                center: {
                    lat: 52.52,
                    lng: 13.40,
                    zoom: originalZoomLevel
                },
                markers: {
                    m1: {
                        name: "Back to the Basics",
                        opacity: 1,
                        lat: 52.52,
                        lng: 13.37,
                        focus: false,
                        icon: {
                            type: 'div',
                            iconSize: [500, 335],
                            oriIconSize: [500, 335],
                            popupAnchor: [0, 0],
                            html: '<img src="image/test.jpg" style="width:100%;"/>',
                        },
                        draggable: true,
                        online: true,
                        iconAngle: 0,
                    },
                    m2: {
                        name: "Cyclopean",
                        opacity: 1,
                        lat: 52.52,
                        lng: 13.43,
                        focus: false,
                        icon: {
                            type: 'div',
                            iconSize: [500, 250],
                            oriIconSize: [500, 250],
                            popupAnchor: [0, 0],
                            html: '<img src="image/test2.jpg" style="width:100%;"/>',
                        },
                        draggable: true,
                        online: true,
                        iconAngle: 0,
                    },
                },
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
            $scope.showGeoCoord = function(lat, lng) {
                return lat.toFixed(3) + ', ' + lng.toFixed(3)
            }

            $scope.toggleMarker = function(marker) {
                //negate everything;
                marker.draggable = !marker.draggable;
                marker.opacity ? marker.opacity = 0 : marker.opacity = 1;
            }

            $scope.$watch("center.zoom", function(zoom) {
                var zoomindex = zoom - originalZoomLevel;
                angular.forEach($scope.markers, (marker) => {
                    marker.icon.iconSize.forEach((latlong, index) => {
                        //google maps scales twice for evey zoom
                        //http://gis.stackexchange.com/questions/7430/what-ratio-scales-do-google-maps-zoom-levels-correspond-to
                        marker.icon.iconSize[index] = marker.icon.oriIconSize[index] * Math.pow(2, zoomindex);
                    })
                })
            });

            $scope.uploadFiles = function(file, errFiles) {
                $scope.f = file;
                $scope.errFile = errFiles && errFiles[0];
                if (file) {
                    file.upload = Upload.upload({
                        url: '/api/upload',
                        data: { file: file }
                    });

                    file.upload.then(function(response) {
                        console.log('response.data',response.data);
                        file.result = response.data;
                    }, function(response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }, function(evt) {
                        file.progress = Math.min(100, parseInt(100.0 *
                            evt.loaded / evt.total));
                    });
                }
            }
        }])
})();