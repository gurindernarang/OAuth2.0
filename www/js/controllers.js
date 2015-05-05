angular.module('starter.controllers', [])
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////   Signin Ctrl //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    .controller('NavigationCtrl', function ($scope, $state,OrganizationService) {
        $scope.add_project = function(){

            $state.go('app.add_project', {}, {reload: true})

        }

        $scope.getProjects = function() {
            $state.go('app.projects', {}, {reload: true})
        }
        $scope.getOrganizations = function(){
            $state.go('app.organizations', {project_id: 9}, {reload: true})
        }

        $scope.project_update = function() {

            $state.go('app.update_project', {}, {reload: true})
        }
        $scope.add_organization = function(){

            $state.go('app.add_organization', {}, {reload: true})

        }
        $scope.organization_update = function(){

            $state.go('app.update_organization',{},{reload: true})
        }
        $scope.add_contact = function(){

            $state.go('app.add_contact',{},{reload: true})
        }
        $scope.update_contact = function(){
               $state.go('app.update_contact',{},{reload: true})
        }
    })



    .controller('SigninCtrl', function ($scope, $state,$http, $q, $localStorage) {

        $scope.requestToken_view = false;
        $scope.accessToken_view = true;
        $scope.refreshtoken_view = true;
        $scope.logout_view = true;

        $scope.requestToken = $localStorage.get('RequestToken')
        console.log("Request token" , $scope.requestToken);
        if($scope.requestToken){
            $scope.requestToken_view = true;
            $scope.accessToken_view = false;
        }

        $scope.accessToken = $localStorage.get('access_token');

        if($scope.accessToken){
            $scope.requestToken_view = true;
            $scope.accessToken_view = true;
            $scope.refreshtoken_view = false;
            $scope.logout_view = false;
        }

        $scope.LogOut = function() {
            $localStorage.clear();
            $state.go('app.signin', {}, {reload: true})
        }


        $scope.requestToken = $localStorage.get('requestToken', false)
        $scope.accessToken = $localStorage.get('accessToken', false);

        var main_url = "http://ashish.staging.workinggrouplink.com"
        var clientId = "ccd00369add756d38a946494b934c4409535807cb9dad12cd8d393423ae48d9a";
        var clientSecret = "ebe355d1fe66b417aa71727935381e7320aafcd98ad9a510e49cd83a7fb00fc3";
        var appScope = ["public", "write"]
        var redirect_uri = 'https://localhost/callback'
        var url_auth = main_url + "/oauth/authorize";
        var url_auth_token = main_url + "/oauth/token";



        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

        $scope.login = function () {

            var deferred = $q.defer();
            var url_for_auth = url_auth + '?client_id=' + clientId +
                '&redirect_uri=' + redirect_uri +
                '&scope=' + appScope.join("+") +
                '&approval_prompt=force&response_type=code';

            if (window.cordova) {
                var cordovaMetadata = cordova.require("cordova/plugin_list").metadata;

                if (cordovaMetadata.hasOwnProperty("org.apache.cordova.inappbrowser") === true) {


                    var browserRef = window.open(url_for_auth, '_blank', 'location=yes,clearsessioncache=yes,clearcache=yes');

                    browserRef.addEventListener("loadstart", function (event) {

                        if ((event.url).indexOf("https://localhost/callback") === 0) {

                            var requestToken = (event.url).split("code=")[1];

                            $localStorage.set("RequestToken", requestToken);
                            browserRef.close();
                            alert('Successfully authorized , Please fetch your access token.');
                            $state.go('app.signin', {}, {reload: true})
                            $scope.requestToken = requestToken

                        }
                    });
                    browserRef.addEventListener('exit', function (event) {
                        deferred.reject("The sign in flow was canceled");
                    });
                } else {
                    deferred.reject("Could not find InAppBrowser plugin");
                }
            } else {
                deferred.reject("Cannot authenticate via a web browser");
            }
            return deferred.promise;
        }

        $scope.fetchAccessTokenNow = function() {

            console.log('-----')
            var deferred = $q.defer();
            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

            var requestToken = $localStorage.get("RequestToken", false);
            $localStorage.set("access_token", null);
            $localStorage.set("refresh_token", null);

            console.log('-----', requestToken, url_auth_token)

            if (requestToken) {
                $http({
                    method: "post", url: url_auth_token, data: "client_id=" + clientId
                    + "&client_secret=" + clientSecret + "&redirect_uri=https://localhost/callback"
                    + "&grant_type=authorization_code" + "&code=" + requestToken
                })
                    .success(function (data) {
                        console.log(JSON.stringify(data), 'success' )
                        $localStorage.set("access_token", data.access_token);
                        $localStorage.set("refresh_token", data.refresh_token);
                        $state.go('app.signin', {}, {reload: true})
                        deferred.resolve(data);

                    })
                    .error(function (data, status) {
                        console.log(JSON.stringify(data), 'error' )

                        deferred.reject("Problem authenticating");
                    })
            }
        }

        if (typeof String.prototype.startsWith != 'function') {
            String.prototype.startsWith = function (str) {
                return this.indexOf(str) == 0;
            };
        }
    })



    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////   Secure Ctrl //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    .controller('SecureController', function ($scope, $http) {

        $scope.accessToken = accessToken;

    })

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////   Settings Ctrl //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    .controller('SettingCtrl', function ($scope, $localStorage) {

        $scope.settings = {};

        $scope.saveInLocalStorage = function () {
            $localStorage.setObject("credentials", $scope.settings);
        }
    })
    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////   UpdateProject Ctrl       /////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////


    .controller('UpdateProjectController', function ($scope,ProjectService) {

        $scope.update_project = {};

        $scope.UpdateProject = function (){

            var parameters = {

                project_id: $scope.update_project.project_id,
                name: $scope.update_project.name,
                billing_code: $scope.update_project.billing_code,
                client_name: $scope.update_project.client_name
                //method: 'PATCH'
            }

            console.log("Para:",JSON.stringify(parameters))

            return ProjectService.updateProject({
                parameters: parameters,
                success: function (data) {

                    $scope.update_project = {};
                },
                error: function (data) {

                }
            })

        }
    })
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////   AddProject Ctrl ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////

    .controller('AddProjectController', function ($scope,ProjectService) {

        $scope.project_new = {};

        $scope.CreateProject = function (){

            var parameters = {
                name: $scope.project_new.name,
                billing_code: $scope.project_new.billing_code,
                client_name: $scope.project_new.client_name
            }

            console.log("Para:",JSON.stringify(parameters))

            return ProjectService.createProject({
                parameters: parameters,
                success: function (data) {

                    $scope.project_new = {};
                },
                error: function (data) {

                }
            })

        }
    })
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////  Project Ctrl   /////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    .controller('ProjectController', function ($scope, projects, ProjectService) {

        // Form data for the login modal
        console.log('projects')
        console.log(projects)
        $scope.projects = projects;

    })


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////LogOut controller/////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    .controller('TabCtrl', function ($scope,$localStorage) {
        $scope.view = $localStorage.get("access_token");

        console.log("Access token : ",$scope.view);
    })

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////   Organization Controller   /////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    .controller('OrganizationController', function ($scope, organizations) {
        console.log('organizations')
        console.log(organizations)
        $scope.organizations = organizations;

    })


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// AddOrganization Ctrl             ///////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    .controller('AddOrganizationController', function ($scope,OrganizationService) {

        $scope.add_org = {};

        $scope.CreateOrganization = function (){

            var parameters = {
                project_id: $scope.add_org.project_id,
                name: $scope.add_org.name,
                division: $scope.add_org.division,
                street_1: $scope.add_org.street_1,
                street_2: $scope.add_org.street_2,
                city: $scope.add_org.city,
                zip_code: $scope.add_org.zip_code,
                country: $scope.add_org.country,
                state: $scope.add_org.state,
                office_phone: $scope.add_org.office_phone

            }

            console.log("Para:",JSON.stringify(parameters))

            return OrganizationService.createOrganization({
                parameters: parameters,
                success: function (data) {

                    $scope.add_org = {};
                },
                error: function (data) {

                }
            })

        }
    })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////   UpdateOrganization Ctrl   ///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    .controller('UpdateOrganizationController', function ($scope,OrganizationService) {

        $scope.update_org = {};

        $scope.UpdateOrganization = function (){

            var parameters = {
                project_id: $scope.update_org.project_id,
                name: $scope.update_org.name,
                division: $scope.update_org.division,
                street_1: $scope.update_org.street_1,
                street_2: $scope.update_org.street_2,
                city: $scope.update_org.city,
                zip_code: $scope.update_org.zip_code,
                country: $scope.update_org.country,
                state: $scope.update_org.state,
                office_phone: $scope.update_org.office_phone

            }

            console.log("Para:",JSON.stringify(parameters))

            return OrganizationService.updateOrganization({
                parameters: parameters,
                success: function (data) {

                    $scope.update_org = {};
                },
                error: function (data) {

                }
            })

        }
    })

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Add Contact Ctrl //////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    .controller('AddContactController', function ($scope,ContactService) {

        $scope.contact = {
            assistant: {}
        };

        $scope.AddContact = function (){

            var _contact = $scope.contact
            var parameters = {
                project_id: _contact.project_id,
                organization_id: _contact.organization_id,
                contact: {
                    title: _contact.title,
                    first_name: _contact.first_name,
                    last_name: _contact.last_name,
                    email: _contact.email,
                    digest: _contact.digest,
                    office_phone: _contact.office_phone,
                    mobile_phone: _contact.mobile_phone,
                    home_phone: _contact.home_phone,
                    fax_phone: _contact.fax_phone
                },
                assistant: {
                    email: _contact.assistant.email,
                    first_name: _contact.assistant.first_name,
                    last_name: _contact.assistant.last_name,
                    office_phone: _contact.assistant.office_phone,
                    mobile_phone: _contact.assistant.mobile_phone

                }
            }

            console.log("Para:",JSON.stringify(parameters))

            return ContactService.createContact({
                parameters: parameters,
                success: function (data) {

                    $scope.contact= {};
                },
                error: function (data) {

                }
            })

        }
    })

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////   Update Contact Controller    /////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    .controller('UpdateContactController', function ($scope,ContactService) {

        $scope.contact_update = {
            assistant: {}
        };

        $scope.AddContact = function (){

            var _contact_update = $scope.contact_update
            var parameters = {
                    contact_id: _contact_update.contact_id,
                    title: _contact_update.title,
                    first_name: _contact_update.first_name,
                    last_name: _contact_update.last_name,
                    digest: _contact_update.digest,
                    office_phone: _contact_update.office_phone,
                    mobile_phone: _contact_update.mobile_phone,
                    home_phone: _contact_update.home_phone,
                    fax_phone: _contact_update.fax_phone,
                assistant: {
                    email: _contact_update.assistant.email,
                    first_name: _contact_update.assistant.first_name,
                    last_name: _contact_update.assistant.last_name,
                    office_phone: _contact_update.assistant.office_phone,
                    mobile_phone: _contact_update.assistant.mobile_phone

                }
            }
            console.log("Para:",JSON.stringify(parameters))

            return ContactService.updateContact({
                parameters: parameters,
                success: function (data) {
                    $scope.contact_update= {};
                },
                error: function (data){
                }
            })
        }
    })