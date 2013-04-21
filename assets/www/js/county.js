function singleCounty(county){
	pageChange()
	var node = document.getElementById("singleCountyList").innerHTML=''
		$.getJSON(
				baseURL + '/api/counties/' + county,
				function(jsonData) {
				   var list=""
				   document.getElementById("singleCountyHeader").innerHTML = jsonData.county.name
				   for(i=0; i<jsonData.results.length; i++){
					   matchId = jsonData.results[i].id
					   var match = jsonData.results[i].team1 + " " + jsonData.results[i].score1 + " " + jsonData.results[i].team2 + " " + jsonData.results[i].score2
					   list += "<li><h3><a href='#' data-prefetch onclick='goToSingleMatch(" + jsonData.results[i].id + ");'>" + match + "</h3>" + jsonData.results[i].date + "; Competition: " + jsonData.results[i].competition + "</a></li>"
				
				   }
	               $("#singleCountyList").append( list ).listview("refresh");
	              
		})
		.error(function(){ alert("ERROR. Could not retrieve information at this time") } )
		.complete(function(){ $.mobile.loading( 'hide') } )
}

//$('#singleCounty').live('pageshow', function () { pageChange() });

