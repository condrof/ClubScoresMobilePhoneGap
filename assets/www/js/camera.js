
var pictureSource; 
var destinationType; 

document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
	$(".flashMessage").hide(); 
	$.mobile.loading( 'show', {
		text: 'Processing Image',
		textVisible: true,
		theme: 'a',
		html: ""
	});
  console.log(imageData);
  $.post(
			baseURL + "/api/v2/images?auth_token=" + getToken(), 
				{ "imageData": imageData, "user_id":getUsername(), "matchId": getMatchId()  },
				function(data){
					document.location.href='#singleMatch';
					$(".flash").text(data.results)
					$(".flashMessage").show()	
					$.mobile.loading( 'hide');
				}, "json")
				 .error(function() { 
					 $(".flash").text("Image could not be added at this time")
					 $(".flashMessage").show(); 
					 $.mobile.loading( 'hide');
				 })
}

// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
	var image = document.getElementById('myImage');
    image.src = imageURI;
    
    $.post(
			baseURL + "/api/v2/images?auth_token=" + getToken(), 
				{ "key": getMatchId()+"/"+fileName, "user_id": getUsername(), "match_id": getMatchId()  },
				function(data){
					document.location.href='#singleMatch';
					$(".flash").text(data.results)
					$(".flashMessage").show()	
					$.mobile.loading( 'hide');
				}, "json")
				 .error(function() { 
					 $(".flash").text("Image could not be added at this time")
					 $(".flashMessage").show(); 
					 $.mobile.loading( 'hide');
				 })
}

// A button will call this function
//
function capturePhoto() {
	$(".flashMessage").hide(); 
  // Take picture using device camera and retrieve image as base64-encoded string
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
    destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function capturePhotoEdit() {
  // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
  navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
    destinationType: destinationType.DATA_URL });
}

// A button will call this function
//
function getPhoto() {
	// Retrieve image file location from specified source
	navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
    destinationType: destinationType.FILE_URI });
}

// Called if something bad happens.
// 
function onFail(message) {
  alert('Failed because: ' + message);
}
