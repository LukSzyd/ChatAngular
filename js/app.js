	// this url is responsible for binding our requests to xmpp and vice versa. bosh service url can be found in openfire admin console
	var BOSH_SERVICE = 'http://lukasz-asus/http-bind/';  

	var connection   = null;           // The main Strophe connection object.
	var XMPP_DOMAIN  = 'lukasz-asus'; // Domain we are going to be connected to.
	var xmpp_user    = 'admin';     // xmpp user name


	$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;
	connection.xmlInput = xmlInput;

    $('#connect').bind('click', function () {
	var button = $('#connect').get(0);
	if (button.value == 'connect') {
	    button.value = 'disconnect';
		//logowanie jako $('#jid').get(0).value+'@'+XMPP_DOMAIN - > ZALOGOWANY użytkownik
		//logowanie jako $('#jid').get(0).value- > bez domeny NIEZALOGOWANY użytkownik
	    connection.connect($('#jid').get(0).value+'@'+XMPP_DOMAIN, $('#pass').get(0).value, onConnect);
	} else {
	    button.value = 'connect';
	    connection.disconnect();
	}
    });
});
	function onConnect(status)
	{
			// THESE STATUS CODES ARE SELF EXPLANATORY
		if (status == Strophe.Status.CONNECTING) {

		} else if (status == Strophe.Status.CONNFAIL) {

		} else if (status == Strophe.Status.DISCONNECTING) {
			
		} else if (status == Strophe.Status.DISCONNECTED) {
			
		} else if (status == Strophe.Status.CONNECTED) {
			
			// We add a listener that will catch the opposite user's msgs
			connection.addHandler(onMsgReceive, null, 'message'); 		
			// We send online presense to the server. (pub sub concept)
			connection.send($pres().tree());	
		}

	}
	function xmlInput(data)
	{
		try{
			if(data.firstElementChild.getAttribute('from')!= null && data.firstElementChild.getAttribute('to')!=null){//wykluczamy systemowe komuniakty
			console.log('RECV', data);
			$( "body" ).append("<p>" + data.firstChild.textContent + "</p>");
			}
		} catch(ex){
			console.log("Komunikat systemowy: " + ex)
		}
		
		
	}
	
	function rawInput(data)
	{
		//console.log('RECV', data);
	}

	function rawOutput(data)
	{
	   // console.log('SENT', data);
	}
	function sendMsg()//funkcja pozwala na wyslanie wiadomosci
	{
		var txtMsg = $('#txtMsg ').val();
		var toUser = $('#toUser ').val() + '@lukasz-asus';
			  var uniqueID = connection.getUniqueId(Math.random()); // Unique ID to tract the message.
		// Next we build a XMPP message box similar to this:
		// <message id='4092:MBM:Example:1'
		//          to='f8a62b10-d7a9-4818-9f35-28d67696958b@anon.example'
		//          from='7fc4c2ef-dcf7-4433-8efa-8a6555633ab6@anon.example/a70ece01'>
		//          <body>Hey there.</body>
		// </message>
		// $msg is a helper function. .c() sets the element name, .t() the content.
		// See documentation of Strophe for more info.
		var reqChannelsItems = $msg({"id":uniqueID, "to":toUser})
								   .c("body").t(txtMsg);
		// And we send the created Message
		connection.send(reqChannelsItems.tree()); 
			// ON THE OPPOSITE SIDE  onMEssageRecieve() function will be  triggered

		// HERE DO WHAT YOU WANT AFTER SENDING THE MSg

	}

	function onMsgReceive(stanza)//funkcja odbiera wiadomosc. ale tylko jedna na sesje??
	{ 
	  console.log(stanza); // check this msg data and do what you want
	 
	}