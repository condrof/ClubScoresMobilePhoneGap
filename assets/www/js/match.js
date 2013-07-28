function getUsername(){
	return window.localStorage.getItem("username")
}
function getToken(){
	return window.localStorage.getItem("token")
}

function getMatchId(){
	return window.localStorage.getItem("matchId")
}

function getData(){
	$.mobile.loading( 'show', {
		text: 'Loading',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	checkLogin()
	getList("matches", "Recent Matches")
}

function getList(url, heading){
	var node = document.getElementById("matchlist").innerHTML=''
		$("#matchHeader").text(heading)
		$.getJSON(baseURL + "/api/v2/" + url,
			function(jsonData) {
				if(jsonData.result === "error"){
					$(".flash").text(jsonData.results.message)
					$(".flashMessage").show()
				} else {
				    var list=""
				    	$.each(jsonData.results, function(i, field){
				    		var date = new Date(i)
							var showDate = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear()
							list += "<li data-theme='a' data-role='list-divider' role='heading'><h1>" + showDate + "</h1></li>"
				            for(i=0; i<field.length; i++){
							   matchId = field[i].id
							   var status = field[i].finished ? "Full Time" : "Latest"
							   var match = field[i].team1 + " " + field[i].score1 + "<br />" + field[i].team2 + " " + field[i].score2
							   list += "<li><a href='#' data-prefetch onclick='goToSingleMatch(" + field[i].id + ");'>" + match + "<br />Venue: " + field[i].venue + "<br />County: " + field[i].county + "<br />Throw In: "+ field[i].time + "<br />Status: " + status + "</a></li>"
						    }
				          });
					    $("#matchlist").append( list ).listview("refresh");
				}
		})
		.error(function(){
			alert("Server not responding. Please try again");
		})
		.complete(function(){ 
			document.location.href = "#match"
			$.mobile.loading( 'hide')
		} )
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
	ga_storage._trackPageview('/index', 'Single Match Page');
	if(getUsername != null){
		$(".scoreLinks").show()
	} else {
		$(".scoreLinks").hide()
	}
	window.localStorage.setItem("matchId", matchId);
	$.getJSON(
			baseURL + '/api/v2/matches/' + matchId,
			function(jsonData) {
				team1 = jsonData.results.team1
				team2 = jsonData.results.team2
				venue = jsonData.results.venue
				time = jsonData.results.time
				date = jsonData.results.date
				competition = jsonData.results.competition
				finished = jsonData.results.finished
				if(finished){
					$(".addScoreButton").hide()
					$(".addImageButton").show()
				} else {
					$(".addScoreButton").show()
					$(".addImageButton").hide()
				}
				document.getElementById("singleMatchTeam1").innerHTML = jsonData.results.team1 + " " + jsonData.results.score1
				document.getElementById("singleMatchTeam2").innerHTML = jsonData.results.team2 + " " + jsonData.results.score2			   	
				document.getElementById("singleMatchTime").innerHTML = "Time: " + time
				document.getElementById("singleMatchVenue").innerHTML = "Venue: " + venue
				document.getElementById("singleMatchDate").innerHTML = "Date: " + date	
				document.getElementById("singleMatchCompetition").innerHTML = "Competition: " + competition	
				document.getElementById("singleMatchStatus").innerHTML = finished ? "Status: Full Time" : "Status: Latest"	
	})
	
	var url = baseURL + '/api/v2/scores/' + matchId
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

function setupListener(){
	$(":jqmData(role='page')").bind("pagecreate", function () {
		var panel = $('#options').clone();
	    $(this).prepend(panel);
	    $(this).trigger('refresh');
	});
	$(":jqmData(role='page')").bind("pageshow", function () {
		$(".flashMessage").hide();
	});
	$('#match').bind('pageshow', function () {
		getData() 
		ga_storage._trackPageview('/index', 'home Page');
	});
}

$(document).bind("mobileinit", function () {
	$.event.special.swipe.horizontalDistanceThreshold = Math.min($(document).width() / 2, 160);  
    });
$( document ).on( "swiperight", function() {
	$('.options').panel( "open" );
});



