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
}

function goToSingleMatch(id){
	assignMatchId(id)
	pageChange()
	document.location.href='#singlematch'
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
}



$('#match').live('pageshow', function () { getData();  });
$('#singlematch').live('pageshow', function () { singleMatch();  });
$('#login').live('pageshow', function () { pageChange();  });
