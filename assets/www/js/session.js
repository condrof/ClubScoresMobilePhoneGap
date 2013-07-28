function checkLogin(){
	if(	window.localStorage.getItem("username") != null){
		$(".loginButton").hide();
		$(".logoutButton").show()
		$(".addScoreButton").show();
		$(".addImage").show();
		$(".loggedIn").show();
		$(".panelUser").text("Welcome " + getUsername() + " to the Live Gaelic scores app powered by ClubScores")		
    } else {
		$(".loginButton").show();
		$(".logoutButton").hide();
		$(".addScoreButton").hide();
		$(".addImage").hide();
		$(".loggedIn").hide()		
	}
	$(".panelList").listview("refresh");
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
	ga_storage._trackPageview('/index', 'register');
	username = $("#regUsername").val()
	email = $("#regEmail").val()
	password = $("#regPassword").val()
	confirmPassword = $("#regConfirmPassword").val()
	if(username === "" || email === "" || password === "" || confirmPassword === ""){
		$(".flash").text("Fields cannot be empty")
		$(".flashMessage").show() 
		$.mobile.loading( 'hide')
		return false;
	} else if(password !== confirmPassword){
		$(".flash").text("Password must match Password Confirmation")
		$(".flashMessage").show() 
		$.mobile.loading( 'hide')
		return false;
	} else if(password.length < 6){
		$(".flash").text("Password must be at least 6 characters long")
		$(".flashMessage").show() 
		$.mobile.loading( 'hide')
		return false;
	}
	$.ajax({
            type:"POST",
            beforeSend: function (request)
            {
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            },
            url: baseURL + "/api/v2/users",
            data: { "username": username, "email" : email, "password": password, "password_confirmation" : confirmPassword },
            success: function(data) {
           		window.localStorage.setItem("username", username);
			    window.localStorage.setItem("token", data.results.token);
			    window.localStorage.setItem("loggedIn", true);
				checkLogin()
				document.location.href='#match';
				$.mobile.loading( 'hide')
				$(".flash").text("Registered Successfully")
				$(".flashMessage").show()
            },
            error: function(data){
            	$.mobile.loading( 'hide')
            	$(".flash").text("Registered failed. Username/email is already taken")
				$(".flashMessage").show()           
            }
        });
	checkLogin();
	$.mobile.loading( 'hide')
}

function login(){
	$.mobile.loading( 'show', {
			text: 'Logging In',
			textVisible: true,
			theme: 'a',
			html: ""
		});
	ga_storage._trackPageview('/index', 'login');
	username = $("#username").val()
	password = $("#password").val()
	$.post(
		baseURL + "/api/v2/tokens", 
			{ "username": username, "password": password },
			function(data){
				if(typeof data.token != 'undefined') {
				    window.localStorage.setItem("username", username);
				    window.localStorage.setItem("token", data.token);
				    window.localStorage.setItem("loggedIn", true);
				    checkLogin()
					document.location.href='#match';
					$.mobile.loading( 'hide')
					$(".flash").text("Logged In Successfully")
					$(".flashMessage").show()
				}
				
				
			}, "json")
			 .error(function() { 
				 $.mobile.loading( 'hide'); 
				 $(".flash").text("Incorrect Username or Password")
				$(".flashMessage").show(); 
			 })
			 checkLogin();
	//setInterval(function(){checkLogin() },250)
}

function logout(){
	$.mobile.loading( 'show', {
		text: 'Signing Out',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	ga_storage._trackPageview('/index', 'logout');
	$.ajax({
	    url: baseURL + "/api/v2/tokens/" + window.localStorage.getItem("token"),
	    type: 'DELETE',
	    success: function(result) {
	    	window.localStorage.clear();
	    	document.location.href='#match';
	    	checkLogin();
	    	$.mobile.loading( 'hide'); 
	    	$(".flash").text("Logged Out Successfully")
			$(".flashMessage").show()
	    },
		error: function(result){
			$.mobile.loading( 'hide'); 
			$(".flash").text("Could not log you out at this time")
			$(".flashMessage").show()
		}
	});

	window.localStorage.clear();
	
	checkLogin();
}