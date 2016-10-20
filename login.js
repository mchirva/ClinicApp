angular.module('login',[])
        .config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }])
        .controller('checkLogin',function($scope,$http,$window,$filter){
            $scope.submitForm = function(){
                $http({
                method :'POST',
                url:'http://52.89.68.106:8080/api/login',
                data:$.param({
                	username: $scope.user.username, 
                	password: $scope.user.password
            	}),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                .then(function successCallback(response) {
                	if(!response.data.error) {
                        console.log(response.data);
                        var token=response.data.data.token;
                        console.log(token);
                        if(response.data.data.user.role=="Admin" || response.data.data.user.role=="admin"){
                            localStorage.setItem('token',token);
                            localStorage.setItem('loggedIn', true);
                            window.location.href = "HomePage.html";
                        }
                    }
                    else{
                        localStorage.setItem('loggedIn', false);
                        var div = document.createElement('div');
                        div.innerHTML = "<div><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Invalid User Credentials! </strong>Please try again. </div>";
                        div.setAttribute('class', 'alert alert-warning'); 
                        document.body.appendChild(div);
                    }

                }, function errorCallback(response) {
                    $window.alert('Nope!');
                });
                       
           }
        });
			
			