"use strict";

chatApp.controller('chatCtrl', function($scope, $http, LoginService, SendMsgService, Contacts) {
    $scope.button_login = "connect";
    $scope.contacts = Contacts;
    $scope.connect = function(){
        if ($scope.button_login == 'connect') {
            $scope.button_login = 'disconnect';
            LoginService.connect($scope.jid, $scope.pass);//logowanie
            $scope.getUsers();
        } else {
            $scope.button_login = 'connect';
            LoginService.disconnect();//wylogowanie
        }
        
    }
    $scope.sendMsg = function(keyEvent){
            if(keyEvent.which === 13){
              if(typeof $scope.selectedName !== "undefined"){
                    SendMsgService.sendMsg($scope.selectedName);//wyslij wiadomosc
                    $('#txtMsg').val("");
                } else {
                    alert("Wybierz usera!");
                }
            }
    }
    
    var users = {};
    $scope.users = [];
//    $scope.users = [//domyslna pierwszta wartosc dla selected list
//        {
//          username: 'Wybierz'
//        }
//    ];
    //$scope.selectedName = $scope.users[0]; // defaltowa wartosc <select>
    
    /* REST API OPENFIRE: http://lukasz-asus/plugins/restapi/v1/sessions lista uzytkownikow online*/
    $scope.getUsers = function() {
        var root = 'http://192.168.0.11/plugins/restapi/v1/';
        $http.defaults.headers.common['Authorization'] = "test";
        $http.defaults.headers.common['Accept'] = "application/json";
        $http.get(root + 'users').then(function (response) {
                
            for(var i=0; i < response.data.user.length-1; i++){
                users.username = response.data.user[i].username;
                $scope.users.push(users);
                $scope.checkOnline(users.username);
                users = {};
            }
        });
    }
    
    $scope.checkOnline = function(userName) {
        try{
                var root = 'http://192.168.0.11/plugins/restapi/v1/sessions/';
                $http.defaults.headers.common['Authorization'] = "test";
                $http.defaults.headers.common['Accept'] = "application/json";
                $http.get(root + userName).then(function (response) {
                        //dodac if sprawdzajacy czy mamy dobra opdowiedz
                        if(typeof response.data.session !== "undefined"){
                          console.log("UserName: " + response.data.session.username + ", Status: " + response.data.session.presenceStatus);  
                        }
                });
            } catch(ex){
                alert(ex);
            }
        }
        
    
    $scope.selectUsers = function(user) {
        $scope.selectedName = user;//wybranie usera z listy <li>
    }
});