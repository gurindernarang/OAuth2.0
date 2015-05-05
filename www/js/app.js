// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html"
            })

            .state('app.settings', {
                url: "/settings",
                views: {
                    'menuContent': {
                        templateUrl: "templates/settings.html",
                        controller: 'SettingCtrl'
                    }
                }
            })


            .state('app.signin', {
                cache:false,
                url: '/signin',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/signin.html',
                        controller: 'SigninCtrl'
                    }
                }
            })

            .state('app.projects', {
                url: '/projects',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/projects.html',
                        controller: 'ProjectController'
                    }
                },
                resolve: {
                    projects: function(ProjectService) {
                        return ProjectService.getProjects()
                    }
                }
            })

            .state('app.add_project', {
                cache:false,
                url: '/add_project',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/add_project.html',
                        controller: 'AddProjectController'
                    }
                }
            })

            .state('app.update_project', {
                cache:false,
                url: '/update_project',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/update_project.html',
                        controller: 'UpdateProjectController'
                    }
                }
            })

            .state('app.organizations', {
                url: '/organizations',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/organizations.html',
                        controller: 'OrganizationController'
                    }
                },
                resolve: {
                    organizations: function($stateParams,OrganizationService) {
                        return OrganizationService.getOrganizations($stateParams.project_id)

                    }
                }
            })

            .state('app.add_organization', {
                cache:false,
                url: '/add_organization',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/add_organization.html',
                        controller: 'AddOrganizationController'
                    },
                    resolve: {
                        organizations: function($stateParams,OrganizationService) {
                            return OrganizationService.getOrganizations($stateParams.project_id)

                        }
                    }
                }
            })

            .state('app.update_organization', {
                cache:false,
                url: '/update_organization',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/update_organization.html',
                        controller: 'UpdateOrganizationController'
                    }
                }
            })

            .state('app.add_contact', {
                cache:false,
                url: '/add_contact',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/add_contact.html',
                        controller: 'AddContactController'
                    }
                }
            })

            .state('app.update_contact', {
                cache:false,
                url: '/update_contact',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/update_contact.html',
                        controller: 'UpdateContactController'
                    }
                }
            });



        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/signin');
    });


