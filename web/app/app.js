(function() {
    'use strict';

    angular.module('app', [
        'ui.bootstrap',
        'ui.select',
        'ngRoute',
        'ngSanitize',
        'app.services',
        'app.shared',
        'cgPrompt',
        'LocalStorageModule',
        'oc.lazyLoad',
        'angular-clipboard',
        'ngFileSaver',
        'flowchart'
    ])
    .config(['$routeProvider', '$ocLazyLoadProvider', 'localStorageServiceProvider', 'NodeTemplatePathProvider', function($routeProvider, $ocLazyLoadProvider, localStorageServiceProvider, NodeTemplatePathProvider) {
        localStorageServiceProvider.setStorageType('localStorage');

        NodeTemplatePathProvider.setTemplatePath("app/designer/node.html");

        $routeProvider
            .when('/', {
                templateUrl: 'app/designer/designer.html',
                controller: 'DesignerCtrl',
                controllerAs: 'vm',
                resolve: {
                    module_types: ['RuleEngineService', function (RuleEngineService) {
                        return RuleEngineService.getModuleTypes();
                    }],
                    flowinfo: ['StorageService', 'FlowService', function (StorageService, FlowService) {
                        return StorageService.getServiceConfiguration().then(function () {
                            return {
                                currentFlowId:  FlowService.getCurrentFlowId(),
                                currentFlow:  FlowService.getCurrentFlow(),
                                flowIds: FlowService.getFlowIds()
                            }
                        })
                    }],
                }
            })
            .when('/error', {
                templateUrl: 'app/error/error.html'
            })
           .otherwise({
                redirectTo: '/'
            });

            $ocLazyLoadProvider.config({
                serie: true,
                modules: [{
                    name: 'codemirror',
                    files: [
                        'vendor/cm/lib/codemirror.css',
                        'vendor/cm/lib/codemirror.js',
                        'vendor/cm/theme/rubyblue.css',
                        'vendor/cm/addon/edit/matchbrackets.js',
                        'vendor/cm/addon/edit/closebrackets.js',
                        'vendor/cm/mode/javascript/javascript.js',
                        'vendor/cm/addon/hint/show-hint.js',
                        'vendor/cm/addon/hint/show-hint.css',
                        'vendor/cm/addon/dialog/dialog.js',
                        'vendor/cm/addon/dialog/dialog.css',
                        'vendor/cm/addon/tern/tern.js',
                        'vendor/cm/addon/tern/tern.css',
                        'vendor/cm/addon/tern/tern-libs.js'
                    ],
                    serie: true
                }]
            });
    }])
    .run(['$rootScope', '$location', function($rootScope, $location) {

            $rootScope.$on('$routeChangeError', function (evt, current, previous, rejection) {
                $location.path('/error');
            });
    }])
})();