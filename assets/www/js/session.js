function checkLogin(){
	if(	window.localStorage.getItem("username") != null){
		$(".loginButton").hide()
		$(".logoutButton").show()
		$(".addScoreButton").show()
		$(".page").find("[data-role=footer]").load("shared/footerLoggedIn.html", function(){
            $(".footerdiv").find("[data-role=navbar]").navbar();
        });
    } else {
		$(".loginButton").show();
		$(".logoutButton").hide();
		$(".addScoreButton").hide();
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

function register(){
	$.mobile.loading( 'hide')
	$("#register").validate()
	username = $("#regUsername").val()
	email = $("#regEmail").val()
	password = $("#regPassword").val()
	confirmPassword = $("#regConfirmPassword").val()
	$.ajax({
            type:"POST",
            beforeSend: function (request)
            {
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            },
            url: baseURL + "/api/users",
            data: { "username": username, "email" : email, "password": password, "password_confirmation" : confirmPassword },
            success: function(data) {
           		window.localStorage.setItem("username", username);
			    window.localStorage.setItem("token", data.results.token);
			    window.localStorage.setItem("loggedIn", true);
            	user.username = username
				user.token = data.results.token
				user.loggedin = true
				checkLogin()
				document.location.href='#match';
				alert("Registered successfully")
            },
            error: function(data){
            	alert("User could not be created at this time. Email address or username might already be registered")
            }
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
				    window.localStorage.setItem("username", username);
				    window.localStorage.setItem("token", data.token);
				    window.localStorage.setItem("loggedIn", true);
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

function logout(){
	$.ajax({
	    url: baseURL + "/api/tokens/" + window.localStorage.getItem("token"),
	    type: 'DELETE',
	    success: function(result) {
	    	window.localStorage.clear();
	    	document.location.href='#match';
	    	checkLogin();
	    	alert("Logged Out Successfully")
	    },
		error: function(result){
			alert("Could not log you out at this time.")
		}
	});
	
	user.username = ""
	user.token = ""
	user.loggedin = false
	window.localStorage.clear();
	
//	document.location.href='#match';
	checkLogin();
//	alert("Logged Out Successfully")
}