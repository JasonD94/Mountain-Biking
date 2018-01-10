/*
    Jason Downing - Software Developer
    Contact: jason@downing.io
    
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    Anyone may freely use this code. Just don't sue me if it breaks stuff.
    Created: Jan 9, 2018
    
    This JS file loads all images in the /img/album/ directory into the 
    nanogallery2
*/

// Get a list of all images in /img/album/
var imgDir = "img/album/";
var imgList = [];

$( document ).ready(function() {
  // For every photo we find, add an <a href> for each image, with it's path set.
  $.ajax({
    // Need to set async to false so we can actually load the list of images into nanogallery2.
    // https://stackoverflow.com/questions/13971769/how-to-make-jquery-ajax-request-synchronous
    async: false,
    url : imgDir,
    success: function (data) {
      $(data).find("a").attr("href", function (i, imgName) {
        if( imgName.match(/\.(jpe?g|png|gif)$/) ) { 
          var imgPath = imgDir + imgName;
          imgList.push( { "src": imgPath,
                          "srct": imgPath,
                          "title" : "Mountain Biking" } );
        } 
      });
    }
  });
  
  console.log(imgList);
  
  // According to this page, we need to provide JSON for the items.
  // https://nanogallery2.nanostudio.org/quickstart.html
  $("#nanogallery2").nanogallery2({
    // Gallery Settings
    thumbnailHeight:  200,
    thumbnailWidth:   200,
    items: imgList
  });
  
});
