angular.module('starter.services', [])
    /////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////                    Local storage service                   /////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////
    .factory('$localStorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            clear: function () {
                $window.localStorage.clear();

            }
        }
    }])


///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////               Project service                 ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

    .factory('ProjectService', function ($q, $http, $localStorage) {

        return {
            getProjects: function () {
                var dfd = $q.defer()

                var _target_url = 'http://ashish.staging.workinggrouplink.com/erapis/v2/projects.json?access_token='
                    + $localStorage.get('access_token', null)

                $http.get(_target_url).
                    success(function (data, status, headers, config) {
                        console.log(JSON.stringify(data), 'success')
                        dfd.resolve(data)
                    }).
                    error(function (data, status, headers, config) {
                        console.log(JSON.stringify(data), 'error')
                    });

                return dfd.promise
            },
            createProject: function(options) {
                var dfd = $q.defer()

                var _target_url = 'http://ashish.staging.workinggrouplink.com/erapis/v2/projects.json?access_token='
                    + $localStorage.get('access_token', null)


                var req = {
                    method: 'POST',
                    url: _target_url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    params: {
                        name: options.name,
                        billing_code: options.billing_code,
                        client_name: options.client_name
                    }
                }

                $http(req)
                    .success(function(data){
                        console.log('created', JSON.stringify(data))
                        alert("Project successfully created");
                        $state.go(app.project_new, {}, {reload:true})
                    })
                    .error(function(data){
                        console.log('Error', JSON.stringify(data))
                    });


                return dfd.promise

            }
        }


    }).filter('checkmark', function() {
        return function(input) {
            console.log(input)
            //return input ? '\u2713' : '\u2718';
        };
    })

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////                 Organization Service                 /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    .factory('OrganizationService', function ($http) {
        var service = {
            organizations: function (project_id) {
                console.log('OPTIONS1');
                console.log(options.auth_token);
                console.log(project_id)

                var _target_url = 'http://ashish.staging.workinggrouplink.com/erapis/v2/organizations.json?access_token='
                    + options.auth_token + '&project_id=' + project_id
                console.log(_target_url)

                $http.get(_target_url).
                    success(function (data, status, headers, config) {
                        console.log(JSON.stringify(data), 'success')
                    }).
                    error(function (data, status, headers, config) {
                        console.log(JSON.stringify(data), 'error')
                    });

            }
        };
        return service;
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////                  Authorization Service                      ///////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////
    .factory('$authorizationService', function ($localStorage) {
        return {
            isLoggedIn: function () {
                var accessToken = $localStorage.get('access_token')
                console.log("Access Token : ",accessToken);
                /*var logged_in = !(angular.equals(accessToken,''))
                return logged_in*/
                if(accessToken){
                    return true;
                }
                else{
                    return false;
                }
            }
        };
    })


    //////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////                      Menu Service                         /////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////
    .factory('menuItemsService', function ($localStorage) {
        return {
            menuList: function (loggedin) {
                var items = []
                console.log('logged-in ' + loggedin + 'in menuItemsService')
                if (loggedin) {
                        items = [
                            {
                                label: 'Settings',
                                action: 'settingsView()'
                            },
                            {
                                label: 'Projects',
                                action: 'projects()'
                            },
                            {
                                label: 'New Project',
                                action: 'projectNew()'
                            },
                            {
                                label: 'Organizations',
                                action: 'organizationList()'
                            },
                            {
                                label: 'Log Out',
                                action: 'LogOut()'
                            }
                        ]
                } else {
                    items = [
                        {
                            label: 'Sign In',
                            action: 'SignIn()'
                        }
                    ]
                }
                return items
            }
        }
    })