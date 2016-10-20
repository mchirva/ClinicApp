angular.module('homepage',[])
        .controller('getPatients',function($scope,$http,$window,$filter){
            window.setTimeout(function () {
                $(".alert-success").fadeTo(500, 0).slideUp(500, function () {
                    $(this).remove();
                });
                $(".alert-warning").fadeTo(500, 0).slideUp(500, function () {
                    $(this).remove();
                });
            }, 5000);
            $(document).ready(function() {
                console.log(localStorage.getItem('loggedIn'));
                if(localStorage.getItem('loggedIn') == 'true'){
                    console.log('Came in!');
                    GoBack();
                    $('#goBack').click(function() {
                        GoBack();
                    });
                    $('#goHome').click(function() {
                        GoBack();
                    });
                    $('#logout').click(function() {
                        localStorage.setItem('loggedIn', false);
                        window.location.href = "Login.html";
                    });
                }
                else{
                    localStorage.setItem('loggedIn', false);
                    window.location.href = "Login.html";
                }
            });

            function GoBack() {
                var token=localStorage.getItem('token');
                    document.getElementById('patientTableDiv').style.display = "block";
                    document.getElementById('responseTableDiv').style.display = "none";
                    document.getElementById('scoresTableDiv').style.display = "none";
                    var token=localStorage.getItem('token');
                    console.log(token);
                    $http({
                        method :'POST',
                        url:'http://52.89.68.106:8080/api/getPatients',
                        data:$.param({
                            token:token                            
                        }),
                        headers:{'Content-Type':'application/x-www-form-urlencoded'}
                        })
                        .then(function successCallback(response) {
                            $scope.patients = response.data.data;
                        }, function errorCallback(response) {
                            $window.alert(response.status);
                        });
                
            }

            $scope.submitForm = function(){
                var token=localStorage.getItem('token');
                $http({
                method :'POST',
                url:'http://52.89.68.106:8080/api/createUser',
                data:$.param({
                    token:token,
                    name:$scope.user.name,
                    username: $scope.user.username, 
                    password: $scope.user.password,
                    gender: $scope.user.gender,
                }),
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                .then(function successCallback(response) {
                    $scope.user="";
                    var div = document.createElement('div');
                    div.innerHTML = "<div><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Success! </strong>The patient has been added to the database.</div>";
                    div.setAttribute('class', 'alert alert-success'); 
                    document.body.appendChild(div);

                }, function errorCallback(response) {
                    var div = document.createElement('div');
                    div.innerHTML = "<div><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Error! </strong>Please try after sometime. </div>";
                    div.setAttribute('class', 'alert alert-warning'); 
                    document.body.appendChild(div);
                });
            }

            $scope.viewResponses = function(index){
                var token=localStorage.getItem('token');
                document.getElementById('responseTableDiv').style.display = "block";
                document.getElementById('patientTableDiv').style.display = "none";
                document.getElementById('scoresTableDiv').style.display = "none";
                url='http://52.89.68.106:8080/api/getResult/' + $scope.patients[index].Id;
                var token=localStorage.getItem('token');
                $http({
                    method :'POST',
                    url:url,
                    data:$.param({
                        token:token                            
                    }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                .then(function successCallback(response) {
                    $scope.responses=response.data;
                }, function errorCallback(response) {
                    var div = document.createElement('div');
                    div.innerHTML = "<div><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>No responses for this user! </div>";
                    div.setAttribute('class', 'alert alert-warning'); 
                    document.body.appendChild(div);
                });
            }

            $scope.viewScore = function(index){
                document.getElementById('patientTableDiv').style.display = "none";
                document.getElementById('responseTableDiv').style.display = "none";
                document.getElementById('scoresTableDiv').style.display = "block";
                var token=localStorage.getItem('token');
                url='http://52.89.68.106:8080/api/calculateScore/' + $scope.patients[index].Id;
                $http({
                    method :'POST',
                    url:url,
                    data:$.param({
                        token:token                            
                    }),
                    headers:{'Content-Type':'application/x-www-form-urlencoded'}
                })
                .then(function successCallback(response) {
                    $scope.scores=(JSON.stringify(response.data)).slice(1,-1).split(',');
                    for (var i = 0, len = $scope.scores.length; i < len; i++) {
                      $scope.scores[i]=$scope.scores[i].split(':');
                      $scope.scores[i][0] = ($scope.scores[i][0]).slice(1,-1);
                    }
                }, function errorCallback(response) {
                    var div = document.createElement('div');
                    div.innerHTML = "<div><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>No score for this user! </div>";
                    div.setAttribute('class', 'alert alert-warning'); 
                    document.body.appendChild(div);
                });
            }

        });
			
			