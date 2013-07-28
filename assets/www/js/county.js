function singleCounty(county){
	document.location.href = "#singleCounty"
	$.mobile.loading( 'show', {
		text: 'Loading Matches for ' + county,
		textVisible: true,
		theme: 'a',
		html: ""
	});
	ga_storage._trackPageview('/index', 'single county');
	var node = document.getElementById("singleCountyList").innerHTML=''
		$("#singleCountyHeader").text(county)
		$.getJSON(baseURL + "/api/v2/counties/" + county,
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
							   list += "<li><a href='#' data-prefetch onclick='goToSingleMatch(" + field[i].id + ");'>" + match + "<br />Venue: " + field[i].venue + "<br />Throw In: "+ field[i].time + "<br />Status: " + status + "</a></li>"
						    }
				          });
					    $("#singleCountyList").append( list ).listview("refresh");
				}
		})
		.complete(function(){ 
			$( "#options" ).panel( "close" );
			document.location.href = "#singleCounty"
			$.mobile.loading( 'hide')
		} )
}

$('#countiesPage').live('pageshow', function () { ga_storage._trackPageview('/index', 'counties'); });

