angular.module('starter.controllers', [])
    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////   Signin Ctrl //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////
    .controller('SigninCtrl', function ($scope, $http, $q, $localStorage, $state,
                                        menuItemsService, $authorizationService) {

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

        $scope.menuItems = menuItemsService.menuList($authorizationService.isLoggedIn())

        $scope.settingsView = function () {
            $state.go('app.settings', {}, {reload: true});
        }
        $scope.projects = function () {
            $state.go('app.projects', {}, {reload: true});
        }
        $scope.projectNew = function () {
            $state.go('app.project_new', {}, {reload: true});
        }
        $scope.organizationList = function () {
            $state.go('app.project_new', {}, {reload: true});
        }
        $scope.LogOut = function() {
            $localStorage.clear();
            $state.go('app.signin', {}, {reload: true})
        }

        console.log("Access Token : ", $scope.accessToken)

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


                    var browserRef = window.open(url_for_auth, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');

                    browserRef.addEventListener("loadstart", function (event) {

                        if ((event.url).indexOf("https://localhost/callback") === 0) {

                            var requestToken = (event.url).split("code=")[1];

                            $localStorage.set("RequestToken", requestToken);
                            browserRef.close();
                            alert('Successfully authorized, Please fetch your access token.')
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
    ///////////////////////////////////////////   Api Ctrl /////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    .controller('ApiCtrl', function ($scope, $state) {

        $scope.getProjects = function() {
            console.log('----')
            $state.go('app.projects', {}, {reload: true})
        }

        $scope.getOrganizations = function(){
            $state.go('app.organizations', {project_id: 9}, {reload: true})
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

    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////   Secure Ctrl //////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////

    .controller('ProjectController', function ($scope, projects, ProjectService) {

        // Form data for the login modal
        console.log('projects')
        console.log(projects)
        $scope.projects = projects;


        $scope.project_new = {};

        $scope.CreateProject = function (){

            var parameters = {
                name: $scope.project_new.name,
                billing_code: $scope.project_new.billing_code,
                client_name: $scope.project_new.client_name
            }

            console.log("Parameters:",JSON.stringify(parameters))

            return ProjectService.createProject(parameters);

        }
    })


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// Organization controller //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    .controller('OrganizationController', function ($scope, organizations) {

        // Form data for the login modal
        console.log('organizations')

        console.log(organizations)

        $scope.organizations = organizations;

    })

