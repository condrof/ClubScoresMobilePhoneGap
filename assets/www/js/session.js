function checkLogin(){
	if(user.loggedin){
		$(".loginButton").hide()
		$(".logoutButton").show()
		$(".page").find("[data-role=footer]").load("shared/footerLoggedIn.html", function(){
            $(".footerdiv").find("[data-role=navbar]").navbar();
        });
    } else {
		$(".loginButton").show();
		$(".logoutButton").hide();
		$(".page").find("[data-role=footer]").load("shared/footerLoggedOut.html", function(){
            $(".footerdiv").find("[data-role=navbar]").navbar();
        });
	}
}

function pageChange(){
	$.mobile.loading( 'show', {
		text: 'Loading',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	
	
}

function login(){
	$.mobile.loading( 'hide')
	username = $("#username").val()
	password = $("#password").val()
	$.post(
		baseURL + "/api/tokens", 
			{ "username": username, "password": password },
			function(data){
				if(typeof data.token != 'undefined') {
					user.username = username
					user.token = data.token
					user.loggedin = true
					checkLogin()
					document.location.href='#match';
					alert("Logged in successfully")
				}
				
				
			}, "json")
			 .error(function() { alert("Incorrect Username Or Password"); })
	//setInterval(function(){checkLogin() },250)
}

function logout(token){
	$.ajax({
	    url: baseURL + "/api/tokens/" + user.token,
	    type: 'DELETE',
	    success: function(result) {
	    	document.location.href='#match';
	    	checkLogin();
	    	alert("Logged Out Successfully")
	    },
		error: function(result){
			alert("error")
		}
	});
	
	user.username = ""
	user.token = ""
	user.loggedin = false

//	document.location.href='#match';
	checkLogin();
//	alert("Logged Out Successfully")
}