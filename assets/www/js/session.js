var user = "";
var user.name = "";
var user.token = "";

function tester(string){
	alert(string + " func1")
	$.post(baseUrl + "/api/tokens", { "username": username, "password": password },
			function(data){
				alert(data.token)
				alert(date.message)
				if(typeof data.token != "undefined"){
					user.username = username
					user.token = data.token
					alert("Username is: " + username)
				}
			}, "json");
}
/*
function login(username, password){
	alert('hello')
	$.post(baseUrl + "/api/tokens", { "username": username, "password": password },
		function(data){
			alert(data.token)
			alert(date.message)
			if(typeof data.token != "undefined"){
				user.username = username
				user.token = data.token
				alert("Username is: " + username)
			}
		}, "json");
}

function logout(){
	user = ""
	user.name = ""
	user.token = ""
}
*/