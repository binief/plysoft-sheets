'use strict';

var CLIENT_ID = '829845470301-qgo6iv8oqmuamfubplctrvb3n3rlorha.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCsJvwYbBybv7P-pHBy9FTL1eII4gVOS1I';
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SCOPES = "https://www.googleapis.com/auth/drive.file";

app.factory('GapiService', [
    '$http',
    '$q',
    '$httpParamSerializer',
    '$rootScope',
    function($http, $q, $httpParamSerializer, $rootScope) {
        var self = {
            handleClientLoad: function() {
               return gapi.load('client:auth2', self.initClient);
            },
            initClient: function() {
                
                
                gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES
                }).then(function() {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(self.updateSigninStatus);

                    // Handle the initial sign-in state.
                    self.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                    
                    
                    //authorizeButton.onclick = handleAuthClick;
                    //signoutButton.onclick = handleSignoutClick;
                });
                
            },
            updateSigninStatus: function(isSignedIn) {
                
                
                if(!isSignedIn){
                    console.log("Not Logged in");
                    self.handleAuthClick();
                }else{
                    console.log("Logged in");
                    $rootScope.$broadcast("googleLoginEvent",isSignedIn);
                }
                
                
                /* if (isSignedIn) {
                     authorizeButton.style.display = 'none';
                     signoutButton.style.display = 'block';
                     listMajors();
                 }
                 else {
                     authorizeButton.style.display = 'block';
                     signoutButton.style.display = 'none';
                 }*/
            },
            handleAuthClick: function(event) {
                gapi.auth2.getAuthInstance().signIn();
            }
        }
        return self;
    }
]);
