function getUsername(){
	return user.username
}
function getToken(){
	return user.token
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
				   list += "<li><a href='#' data-prefetch onclick='goToSingleMatch(" + jsonData.results[i].id + ");'>" + match + "</a></li>"
			}
               $("#matchlist").append( list ).listview("refresh");
              
	})
	.complete(function(){ $.mobile.loading( 'hide')} )
}

function goToSingleMatch(id){
	assignMatchId(id)
	document.location.href='#singlematch'
	singleMatch()
}

function assignMatchId(id){
	matchId = id;
}


function singleMatch(){
	pageChange();
	if(user.loggedin){
		$(".scoreLinks").show()
	} else {
		$(".scoreLinks").hide()
	}
	
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
	.complete(function(){ $.mobile.loading( 'hide')} )
}

function addMatch(){
	var team1 = $("#addMatchTeam1").val()
	var team2 = $("#addMatchTeam2").val()
	var venue = $("#venue").val()
	var competition = $("#competition").val()
	var day = $("#select-choice-day").val()
	var month = $("#select-choice-month").val()
	var year = $("#select-choice-year").val()
	var hour = $("#addMatchHour").val()
	var minute = $("#addMatchMinutes").val()
	var time = hour + ":" + minute
	var county = $("#addMatchCounty").val()
	
	
	var data = { "user_id": user.username, "team1" : team1, "team2" : team2, "date(1i)" : year, "date(2i)" : month, "date(3i)" : day, "time" : time, "venue" : venue, "competition" : competition, "county_id" : "1" }
	
	$.post(
		baseURL + "/api/matches?auth_token=" + user.token, 
			{ "match" : { "user_id": user.username, "team1" : team1, "team2" : team2, "date(1i)" : year, "date(2i)" : month, "date(3i)" : day, "time" : time, "venue" : venue, "competition" : competition, "county_id" : county }, "auth_token" : user.token },
			function(data){
				if(data.result == 'success') {
					document.location.href='#match';
					alert("Match was successfully added")
					getData()
				}
			}, "json")
			.error( function() { alert("Match could not be added at this time") } )
			//.complete( function() { singleMatch() } )
}
 
//$('#addScore').live('pageshow', function () { setupScore(); $("#addScoreForm").validate(); });


