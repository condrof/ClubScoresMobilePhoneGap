function setupScore() {
	 pageChange()
	 var url= baseURL + "/api/matches/" + matchId
	 $.getJSON(
		url,
		function(matchData) {
			var score1=matchData.results.score1.split("-")
			var score2=matchData.results.score2.split("-")
			$("label[for='team1goals']").text(matchData.results.team1 + " Goals");
			$("label[for='team1points']").text(matchData.results.team1 + " Points");
			$("label[for='team2goals']").text(matchData.results.team2 + " Goals");
			$("label[for='team2points']").text(matchData.results.team2 + " Points");
			$("#team1goals").val(score1[0])
			$("#team1points").val(score1[1])
			$("#team2goals").val(score2[0])
			$("#team2points").val(score2[1])

	}).complete(function(){ $.mobile.loading( 'hide')} )
}
	 
function scoreSubmit(){
	var team1goals = $("#team1goals").val()
	var team1points = $("#team1points").val()
	var team2goals = $("#team2goals").val()
	var team2points = $("#team2points").val()
	
	var data = { "user_name": username, "match_id": matchId, "team1goals" : team1goals, "team1points" : team1points, "team2goals" : team2goals, "team2points" :team2points }
	
	$.post(
		baseURL + "/api/scores?auth_token=" + user.token, 
			{ "score" : { "user_name": username, "match_id": matchId, "team1goals" : team1goals, "team1points" : team1points, "team2goals" : team2goals, "team2points" :team2points } },
			function(data){
				if(data.result == 'success') {
					document.location.href='#singlematch';
					alert("Score was successfully added")
					singleMatch()
				}
			}, "json")
			.error( function() { alert("Score could not be added at this time") } )
			//.complete( function() { singleMatch() } )
}
 
$('#addScore').live('pageshow', function () { setupScore(); $("#addScoreForm").validate(); });
