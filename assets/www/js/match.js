var matchId = 0;
var team1 = "";
var team2 = "";

user = new Object()
user.username = ""
user.token =  ""
	user.loggedin = false

function login(){
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
					document.location.href='#match';
					alert("Logged in successfully")
				}
				
				
			}, "json")
			 .error(function() { alert("Incorrect Username Or Password"); })
}

function logout(){
	user.username = ""
	user.token = ""
	user.loggedin = false
	document.location.href='#match';
	checkLogin();
	alert("Logged Out Successfully")
}

function getUsername(){
	return user.username
}
function getToken(){
	return user.token
}

function pageChange(){
	$.mobile.loading( 'show', {
		text: 'Loading',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	 setInterval(function(){$.mobile.loading( 'hide')},2000);
	 checkLogin();
}

function checkLogin(){
	if(user.loggedin){
		$("#loginButton").hide()
		$("#logoutButton").show()
		$('[data-role=page]').live('pageshow', function (event, ui) {
            $("#" + event.target.id).find("[data-role=footer]").load("shared/footerLoggedIn.html", function(){
                $("#" + event.target.id).find("[data-role=navbar]").navbar();
            });
        });
	} else {
		$("#loginButton").show();
		$("#logoutButton").hide();
		$('[data-role=page]').live('pageshow', function (event, ui) {
            $("#" + event.target.id).find("[data-role=footer]").load("shared/footerLoggedOut.html", function(){
                $("#" + event.target.id).find("[data-role=navbar]").navbar();
            });
        });
	}
}

function getData(){
	pageChange();
	
	var node = document.getElementById("matchlist").innerHTML=''

	$.getJSON(
			baseURL + '/api/matches',
			function(jsonData) {
			   var list=""
			   for(i=0; i<jsonData.results.length; i++){
				   matchId = jsonData.results[i].id
				   var match = jsonData.results[i].county + ":" + jsonData.results[i].team1 + " " + jsonData.results[i].score1 + " " + jsonData.results[i].team2 + " " + jsonData.results[i].score2
				   list += "<li><a href='#singlematch' onclick='assignMatchId(" + jsonData.results[i].id + ");'>" + match + "</a></li>"
			}
               $("#matchlist").append( list ).listview("refresh");
              
	})
}

function assignMatchId(id){
	matchId = id;
}


function singleMatch(){
	pageChange();

	$.getJSON(
			baseURL + '/api/matches/' + matchId,
			function(jsonData) {
				team1 = jsonData.results.team1
				team2 = jsonData.results.team2
				document.getElementById("singleMatchTeam1").innerHTML = jsonData.results.team1 + " " + jsonData.results.score1,
				document.getElementById("singleMatchTeam2").innerHTML = jsonData.results.team2 + " " + jsonData.results.score2			   	
	})
	
	var url = baseURL + '/api/scores/' + matchId
	var list=""
	var node = document.getElementById("singleMatchList").innerHTML=''
			
	$.getJSON(
			url,
			function(scoresData) {
			   for(i=0; i<scoresData.results.length; i++){
				   var match = team1 + " " + scoresData.results[i].team1goals + "-" +  scoresData.results[i].team1points + ": " + " " + scoresData.results[i].team2goals + "-" +  scoresData.results[i].team2points + " " + team2 
				   list += "<li>" + match + "</li>"
			}
			var node = $("#singleMatchList").innerHTML=''
				
            $("#singleMatchList").append( list ).listview("refresh");
              
	})
}



$('#match').live('pageshow', function () { getData();  });
$('#singlematch').live('pageshow', function () { singleMatch();  });
$('#login').live('pageshow', function () { pageChange();  });
