
(function(){

  'use-strict';

  angular.module('mini_inbox_app')
	.controller('login-ctrl', ['$state', '$q', 'UserService', '$ionicLoading', loginController]);

  function loginController($scope, $state, $q, UserService, $ionicLoading){

      
    
 /* this function handles facebook login success  */
  var fbLoginSuccess = function(response) {
    
    /* case: no authentication reponse was returned from facebook */
    if (!response.authResponse){
      fbLoginError("Cannot complete authentication, no reponse was returned!");
      return;
    }

    var authResponse = response.authResponse;

    /* case: response was successfully returned from facebook 
    * this function returns a promise */   
     
    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      
      /* to resolve the promise, in case of a positive response:
      * a call to UserService is instantiated
      * persisting user info to our miniInboxApp database */
      
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      
      $ionicLoading.hide();
      $state.go('fb-contacts');
    }, function(fail){
      /* case: failure to get profile info from facebook */
      console.log('MiniInboxApp failed to get facebook profile info', fail);
    });
  };
  /* endof: facebook login success */

  /* if facebook login fails, this function is executed */
  
  var fbLoginError = function(error){
    console.log('MiniInboxApp failed to login via facebook!', error);
    $ionicLoading.hide();
  };

  /* this function gets user info from facebook API */ 
  
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				console.log(response);
        info.resolve(response);
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  /* This method is executed when the user press the "Login with facebook" button */
  
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
        console.log('attempting to sign user in via fb');
      if(success.status === 'connected'){
        /* case: The user is logged in to MiniInboxApp  
         * response.authResponse supplies
         * the user's ID, a valid access token, a signed request, 
         * and exipration date for access token and signed request
          */
        console.log('getLoginStatus', success.status);

    		// Check if we have our user saved
    		var user = UserService.getUser('facebook');

    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});

						$state.go('fb-contacts');
					}, function(fail){
						// Fail get profile info
						console.log('profile info fail', fail);
					});
				}else{
					$state.go('fb-contacts');
				}
      } else {
        
        /* case: user could not connect to facebook */

				console.log('getLoginStatus', success.status);

				$ionicLoading.show({
          template: 'Logging in...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
       facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'], fbLoginSuccess, fbLoginError);
      }
    });
  };






       
     
        
    }
  
    })();
    
    
    
    
  
    