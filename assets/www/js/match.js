function getUsername(){
	return window.localStorage.getItem("username")
}
function getToken(){
	return window.localStorage.getItem("token")
}

function getData(){
	checkLogin();
	
	var node = document.getElementById("matchlist").innerHTML=''

	$.getJSON(
			baseURL + '/api/matches',
			function(jsonData) {
			   var list=""
			   for(i=0; i<jsonData.results.length; i++){
				   matchId = jsonData.results[i].id
				   var match = jsonData.results[i].team1 + " " + jsonData.results[i].score1 + " " + jsonData.results[i].team2 + " " + jsonData.results[i].score2
				   list += "<li><h3><a href='#' data-prefetch onclick='goToSingleMatch(" + jsonData.results[i].id + ");'>" + match + "</h3>" + jsonData.results[i].county + "; " + jsonData.results[i].date + "</a></li>"
			}
               $("#matchlist").append( list ).listview("refresh");
              
	})
	.complete(function(){ $.mobile.loading( 'hide')} )
}

function goToSingleMatch(id){
	$.mobile.loading( 'show', {
		text: 'Loading',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	assignMatchId(id)
	document.location.href='#singlematch'
	singleMatch()
}

function assignMatchId(id){
	matchId = id;
}


function singleMatch(){
	if(getUsername != null){
		$(".scoreLinks").show()
	} else {
		$(".scoreLinks").hide()
	}
	
	$.getJSON(
			baseURL + '/api/matches/' + matchId,
			function(jsonData) {
				team1 = jsonData.results.team1
				team2 = jsonData.results.team2
				venue = jsonData.results.venue
				time = jsonData.results.time
				date = jsonData.results.date
				document.getElementById("singleMatchTeam1").innerHTML = jsonData.results.team1 + " " + jsonData.results.score1,
				document.getElementById("singleMatchTeam2").innerHTML = jsonData.results.team2 + " " + jsonData.results.score2			   	
				document.getElementById("singleMatchTime").innerHTML = "Time: " + time
				document.getElementById("singleMatchVenue").innerHTML = "Venue: " + venue
				document.getElementById("singleMatchDate").innerHTML = "Date: " + date				   	
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
	var venue = $("#addMatchVenue").val()
	var competition = $("#addMatchCompetition").val()
	var day = $("#select-choice-day").val()
	var month = $("#select-choice-month").val()
	var year = $("#select-choice-year").val()
	var hour = $("#addMatchHour").val()
	var minute = $("#addMatchMinutes").val()
	var time = hour + ":" + minute
	var county = $("#addMatchCounty").val()
	
	$("#addMatchForm").validate()
	
	if($("#addMatchForm").valid()){
		$.mobile.loading( 'show', {
			text: 'Creating Match',
			textVisible: true,
			theme: 'a',
			html: ""
		});
		$( ".addMatchSubmit" ).addClass('ui-disabled');
		$.post(
			baseURL + "/api/matches?auth_token=" + getToken(), 
				{ "match" : { "user_id": getUsername(), "team1" : team1, "team2" : team2, "date(1i)" : year, "date(2i)" : month, "date(3i)" : day, "time" : time, "venue" : venue, "competition" : competition, "county_id" : county }, "auth_token" : getToken() },
				function(data){
					console.log(data)
					if(data.result == 'success') {
						goToSingleMatch(data.results.id)
						//document.location.href='#match';
						$.mobile.loading( 'hide')
						alert("Match was successfully added")
						$( ".addMatchSubmit" ).removeClass('ui-disabled');
						//getData()
					}
				}, "json")
				.error( function(data) { 
					$.mobile.loading( 'hide')
					alert("Match could not be added at this time") 
					$( ".addMatchSubmit" ).removeClass('ui-disabled');
			} )
				//.complete( function() { singleMatch() } )
		}
}
 
//$('#addScore').live('pageshow', function () { setupScore(); $("#addScoreForm").validate(); });


