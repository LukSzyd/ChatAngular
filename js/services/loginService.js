"use strict";

chatApp.service('LoginService', function () {
    var BOSH_SERVICE = 'http://192.168.0.11/http-bind/';  

	var connection = null;         // The main Strophe connection object.
	//var XMPP_DOMAIN  = 'lukasz-asus'; // Domain we are going to be connected to.
    var XMPP_DOMAIN  = '192.168.0.11'; // Domain we are going to be connected to.
	var xmpp_user    = 'admin';     // xmpp user name
    
    
    connection = new Strophe.Connection(BOSH_SERVICE);
    this.connection = connection;//wymagane aby komunikowac sie pomiedzy serwisami
	connection.xmlInput = xmlInput;
    connection.xmlOutput = xmlOutput;
    
    this.connect = function (username, pass) {
         connection.connect(username+'@'+XMPP_DOMAIN, pass, onConnect);
    };
    
    this.disconnect = function () {
         connection.disconnect();
    };
    
    function onConnect (status)
	{
			// THESE STATUS CODES ARE SELF EXPLANATORY
		if (status == Strophe.Status.CONNECTING) {
		} else if (status == Strophe.Status.CONNFAIL) {
		} else if (status == Strophe.Status.DISCONNECTING) {	
		} else if (status == Strophe.Status.DISCONNECTED) {
			console.log("disconnected !!!");
		} else if (status == Strophe.Status.CONNECTED) {
			console.log("connected !!!");
			connection.send($pres().tree());  
		}
	}
    
    function xmlInput (data)//odczyt wiadomosci z openfire
	{
		try {
			if(data.firstElementChild.getAttribute('from') !== null && data.firstElementChild.getAttribute ('to') != null && data.firstChild.nodeName !== 'presence') {//wykluczamy systemowe komuniakty
			console.log('RECV', data);
              $("#chatContent").append('<div class="newMessageFrom alert alert-info" role="info"><p>'+data.firstChild.textContent + '</p><p class="getTime">'+getTime()+'</p></div>');//dodanie dymku z wiadomoscia
              document.getElementById('chatContent').scrollTop = document.getElementById('chatContent').scrollHeight;//widoczna zawsze ostatnia wiadomosc bez scrollowania
                
			}
		} catch(ex){
			console.log ("Komunikat systemowy: " + ex)
		}
	}
    
    function xmlOutput (data)//odczyt wiadomosci wyslanych od siebie
	{
		try{
			if(data.firstElementChild.getAttribute('to')!=null && data.firstChild.nodeName !== 'presence'){//wykluczamy systemowe komuniakty
			console.log('RECV', data);
              $("#chatContent").append('<div class="newMessageTo alert alert-success" role="alert"><p>'+data.firstChild.textContent + '</p><p class="getTime">'+getTime()+'</p></div>');//dodanie dymku z wiadomoscia
              document.getElementById('chatContent').scrollTop = document.getElementById('chatContent').scrollHeight;//widoczna zawsze ostatnia wiadomosc bez scrollowania
			}
		} catch (ex){
			console.log("Komunikat systemowy: " + ex)
		}
	}
    function getTime (){
        return new Date().toTimeString().split(" ")[0];
    }
    
});


chatApp.service ('SendMsgService',['LoginService', function(LoginService){
    this.sendMsg = function (toUserDirect)//funkcja pozwala na wyslanie wiadomosci
	{
        var connection = LoginService.connection;//pobranie obiektu CONNECTION z servicu LoginService
        
		var txtMsg = $('#txtMsg').val();
		var toUser = toUserDirect.username + '@lukasz-asus';
		var uniqueID = connection.getUniqueId(Math.random()); // Unique ID to tract the message.
		var reqChannelsItems = $msg({"id":uniqueID, "to":toUser})
								   .c("body").t(txtMsg);
		// And we send the created Message
		connection.send(reqChannelsItems.tree()); 
	}
}]);

