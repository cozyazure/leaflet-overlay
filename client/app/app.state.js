(() => {
    "use stict";
    angular.module("leaflet-overlay")
        .config([
            "$stateProvider", "$urlRouterProvider", "$locationProvider", ($stateProvider, $urlRouterProvider, $locationProvider) => {
                $locationProvider.html5Mode(true);
                $urlRouterProvider.otherwise("/");
                $stateProvider.state('main', {
                        url: '/',
                        templateUrl: "app/main/main.html",
                        controllerAs: "mainCtrl"
                    })
            }
        ]);
})();
//# sourceMappingURL=app.state.js.map