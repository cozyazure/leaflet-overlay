(() => {
    "use stict";
    angular.module("leaflet-overlay")
        .config([
            "$stateProvider", "$urlRouterProvider", "$locationProvider", ($stateProvider, $urlRouterProvider, $locationProvider) => {
                $locationProvider.html5Mode(true);
                $urlRouterProvider.otherwise("/");
                $urlRouterProvider.when("/", "/home");
                $stateProvider.state('main', {
                        url: '/',
                        templateUrl: "app/main/main.html",
                    })
                    .state('main.home', {
                        url: 'home',
                        templateUrl: "app/main/home/home.html",
                        controller: "homeCtrl"
                    })
            }
        ]);
})();