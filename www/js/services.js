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

    .factory('ProjectService', function ($q, $http, $localStorage,$state) {

        return {
            getProjects: function () {
                var dfd = $q.defer()

                var _target_url = 'http://ashish.staging.workinggrouplink.com/erapis/v2/projects.json?access_token='
                    + $localStorage.get('access_token', null)

                $http.get(_target_url).
                    success(function (data, status, headers, config) {
                        console.log(JSON.stringify(data), 'success')
                        dfd.resolve(data)
                    }),
                    error(function (data, status, headers, config) {
                        console.log(JSON.stringify(data), 'error')
                    });

                return dfd.promise
            },
            createProject: function(options) {
                console.log(JSON.stringify(options));
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
                        name: options.parameters.name,
                        billing_code: options.parameters.billing_code,
                        client_name: options.parameters.client_name
                    }
                }

                $http(req)
                    .success(function(data){
                        console.log('created', JSON.stringify(data))
                        alert("Project successfully created");
                        $state.go('app.add_project',{}, {reload:true})
                    })
                    .error(function(data){
                        console.log('Error', JSON.stringify(data))
                    });


                return dfd.promise

            },
            updateProject: function(options) {
                console.log(JSON.stringify(options));
                var dfd = $q.defer()


                var _target_url = 'http://ashish.staging.workinggrouplink.com/erapis/v2/' +
                    options.parameters.project_id + '/projects.json?access_token='
                    + $localStorage.get('access_token', null)

               var _params = {
                   name: options.parameters.name,
                   billing_code: options.parameters.billing_code,
                   client_name: options.parameters.client_name,
                   _method: 'PUT'
               }

                var req = {
                    method: 'POST',
                    url: _target_url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json'
                    },
                    data: _params
                }

                $http(req)
                    .success(function (data) {
                        console.log('updated', JSON.stringify(data))
                        alert("Project successfully updated");
                        $state.go('app.update_project', {}, {reload: true})
                    })
                    .error(function (data) {
                        console.log('Error', JSON.stringify(data))
                    });
        }


        }
    })

    .filter('checkmark', function() {
        return function(input) {
            console.log(input)
            //return input ? '\u2713' : '\u2718';
        };
    })

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////                 Organization Service                 /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    .factory('OrganizationService', function ($q,$state, $http, $localStorage) {

                return {
                    getOrganizations: function (project_id) {
                        var dfd = $q.defer()

                        var _target_url = 'http://ashish.staging.workinggrouplink.com/erapis/v2/organizations.json?access_token='
                            + $localStorage.get('access_token', null) + '&project_id=' + project_id

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


            createOrganization: function(options) {
                console.log(JSON.stringify(options));
                var dfd = $q.defer()

                var _target_url = 'http://ashish.staging.workinggrouplink.com/erapis/v2/organizations.json?access_token='
                    + $localStorage.get('access_token', null)


                var req = {
                    method: 'POST',
                    url: _target_url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    params: {
                        project_id: options.parameters.project_id,
                        name: options.parameters.name,
                        division: options.parameters.division,
                        street_1: options.parameters.street_1,
                        street_2: options.parameters.street_2,
                        city: options.parameters.city,
                        zip_code: options.parameters.zip_code,
                        country: options.parameters.country,
                        state: options.parameters.state,
                        office_phone: options.parameters.office_phone

                    }
                }

                $http(req)
                    .success(function(data){
                        console.log('created', JSON.stringify(data))
                        alert("Organization successfully created");
                        $state.go('app.add_organization',{}, {reload:true})
                    })
                    .error(function(data){
                        console.log('Error', JSON.stringify(data))
                    });


                return dfd.promise

            },
            updateOrganization: function(options) {
                console.log(JSON.stringify(options));
                var dfd = $q.defer()

                var _target_url = 'http://ashish.staging.workinggrouplink.com/erapis/v2/organizations.json?access_token='
                    + $localStorage.get('access_token', null)


                var req = {
                    method: 'PUT',
                    url: _target_url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    params: {
                        project_id: options.parameters.project_id,
                        name: options.parameters.name,
                        division: options.parameters.division,
                        street_1: options.parameters.street_1,
                        street_2: options.parameters.street_2,
                        city: options.parameters.city,
                        zip_code: options.parameters.zip_code,
                        country: options.parameters.country,
                        state: options.parameters.state,
                        office_phone: options.parameters.office_phone
                    }
                }

                $http(req)
                    .success(function (data) {
                        console.log('updated', JSON.stringify(data))
                        alert("Organization successfully updated");
                        $state.go('app.update_organization', {}, {reload: true})
                    })
                    .error(function (data) {
                        console.log('Error', JSON.stringify(data))
                    });
            }

        }
    })

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////   Contact Service  ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////

    .factory('ContactService', function ($q, $state,$http, $localStorage) {

        return {
            createContact: function (options) {
                console.log(JSON.stringify(options));
                var dfd = $q.defer()

                var _target_url = 'http://ashish.staging.workinggrouplink.com/erapis/v2/add-contacts.json?access_token='
                    + $localStorage.get('access_token', null)


                console.log(_target_url + '_target_url ')
                console.log('options.parameters()')
                console.log(JSON.stringify(options.parameters))

                var req = {
                    method: 'POST',
                    url: _target_url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    params: options.parameters
                }

                $http(req)
                    .success(function (data) {
                        console.log('created', JSON.stringify(data))
                        alert("Contact successfully created");
                        $state.go('app.add_contact', {}, {reload: true})
                    })
                    .error(function (data) {
                        console.log('Error RRR', JSON.stringify(data))
                    });


                return dfd.promise
            },
            updateContact: function(options) {
                console.log(JSON.stringify(options));
                var dfd = $q.defer()

                var contact_id = options.parameters.contact_id

                var _target_url = 'http://ashish.staging.workinggrouplink.com/erapis/v2' +
                     contact_id + '/contacts.json?access_token='
                    + $localStorage.get('access_token', null)


                var req = {
                    method: 'PUT',
                    url: _target_url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    params: options.parameters
                }

                $http(req)
                    .success(function (data) {
                        console.log('updated', JSON.stringify(data))
                        alert("Contact successfully updates");
                        $state.go('app.update_contact', {}, {reload: true})
                    })
                    .error(function (data) {
                        console.log('Error', JSON.stringify(data))
                    });
            }
        }
    })