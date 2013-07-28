function search(){
	$.mobile.loading( 'show', {
		text: 'Loading',
		textVisible: true,
		theme: 'a',
		html: ""
	});
	var node = document.getElementById("searchResults").innerHTML=''
		$.getJSON(baseURL + "/api/v2/matches/search_matches/" + $('#searchbasic').val() ,
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
					    $("#searchResults").append( list ).listview("refresh");
				}
		})
		.error(function(){
			$(".flash").text("Matches could not be retrieved at this time")
			$(".flashMessage").show()
			$.mobile.loading( 'hide');
		})
		.complete(function(){ 
			document.location.href = "#searchPage"
			$.mobile.loading( 'hide')
		} )
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
						$(".flash").text("Match was successfully added");
						$(".flashMessage").show()
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

$('#searchPage').live('pageshow', function () { ga_storage._trackPageview('/index', 'search'); });
