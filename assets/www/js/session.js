function checkLogin(){
	if(	window.localStorage.getItem("username") != null){
		$(".loginButton").hide()
		$(".logoutButton").show()
		$(".addScoreButton").show()
		$(".loggedIn").show()
		$(".page").find("[data-role=footer]").load("shared/footerLoggedIn.html", function(){
            $(".footerdiv").find("[data-role=navbar]").navbar();
        });
    } else {
		$(".loginButton").show();
		$(".logoutButton").hide();
		$(".addScoreButton").hide();
		$(".loggedIn").hide()
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
	$.mobile.loading( 'show', {
			text: 'Registering',
			textVisible: true,
			theme: 'a',
			html: ""
		});
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
				$.mobile.loading( 'hide')
				alert("Registered successfully")
            },
            error: function(data){
            	$.mobile.loading( 'hide')
            	alert("User could not be created at this time. Email address or username might already be registered")
            }
        });

}

function login(){
	$.mobile.loading( 'show', {
			text: 'Logging In',
			textVisible: true,
			theme: 'a',
			html: ""
		});
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
					$.mobile.loading( 'hide')
					alert("Logged in successfully")
				}
				
				
			}, "json")
			 .error(function() { $.mobile.loading( 'hide'); alert("Incorrect Username Or Password"); })
	//setInterval(function(){checkLogin() },250)
}

function logout(){
	$.mobile.loading( 'show', {
		text: 'Signing Out',
		textVisible: true,
		theme: 'a',
		html: ""
	});
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
	
	checkLogin();
}