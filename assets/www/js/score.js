function setupScore() {
	$.mobile.loading( 'show', {
		text: 'Loading',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	 var url= baseURL + "/api/v2/matches/" + matchId
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

	}).success(function(){
		document.location.href="#addScore"
		pageChange()
		$.mobile.loading( 'hide')
	} )
}
	 
function scoreSubmit(){
	var team1goals = $("#team1goals").val()
	var team1points = $("#team1points").val()
	var team2goals = $("#team2goals").val()
	var team2points = $("#team2points").val()
	
	$("#addScoreForm").validate();
	if ($("#addScoreForm").valid()){
		$.mobile.loading( 'show', {
			text: 'Adding Score',
			textVisible: true,
			theme: 'a',
			html: ""
		});
		var data = {"score":{ "user_name": getUsername(), "match_id": matchId, "team1goals" : team1goals, "team1points" : team1points, "team2goals" : team2goals, "team2points" : team2points }}
		var url = baseURL + "/api/v2/scores?auth_token=" + getToken()
		$.post( url, data, 
				function(data){
					if(data.result == 'success') {
					document.location.href='#singlematch';
					$(".flash").text("Score was added successfully")
					$(".flashMessage").show()
					$.mobile.loading( 'hide')
					singleMatch()
					}
			}, "json")
			.error( function() { 
				$(".flash").text("Score could not be added at this time")
				$(".flashMessage").show()
				$.mobile.loading( 'hide')
			} )
	}
}
 
$('#addScore').live('pageshow', function () { 
	setupScore();
	$("#addScoreForm").validate();
	ga_storage._trackPageview('/index', 'add score');
});
