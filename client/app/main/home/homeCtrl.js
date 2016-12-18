(() => {
    'use strict';
    angular.module('leaflet-overlay')
        .controller('homeCtrl', ["$scope", "$log", "leafletData", "leafletBoundsHelpers", function($scope, $log, leafletData, leafletBoundsHelpers) {
            $scope.currentMarker = {
                lat: 52.52,
                lng: 13.40,
                focus: false,
                icon: {
                    type: 'div',
                    iconSize: [500, 335],
                    popupAnchor: [0, 0],
                    html: '<img src="image/test.jpg" style="width:100%;"/>',
                },
                draggable: true,
                iconAngle: 0,
            }
            angular.extend($scope, {
                berlin: {
                    lat: 52.52,
                    lng: 13.40,
                    zoom: 14
                },
                markers: {
                    m1: $scope.currentMarker
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

        }])
})();