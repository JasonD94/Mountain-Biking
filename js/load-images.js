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
var imgList = [];

$( document ).ready(function() {
  // 1-10-2018: The below code would only work if you run your own server.
  // It could work on my Digital Ocean dropplet, but I'm not looking to run
  // this page on there.
  
  /*
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
  */
  
  /* 
      So turns out GitHub Pages, which is how I host the majority of my web pages,
      doesn't let me access a directory like "img/album/" mentioned above. They do
      however have a REST API! So, let's use that instead.
      
      GitHub API  URL: https://api.github.com
      GitHub API Docs: https://developer.github.com/v3/
      
      jQuery.ajax can be used to GET the Contents of a directory 
      via the GitHub REST API: https://api.jquery.com/jquery.ajax/
  */
  
  // GET /repos/:owner/:repo/contents/:path
  var githubApiBaseUrl = "https://api.github.com";
  var githubRepo = "Mountain-Biking";
  var githubPath = "img/album/";
  var githubGetRequest = githubApiBaseUrl + "/repos/JasonD94/" + githubRepo + "/contents/" + githubPath;
  
  // API docs page for Getting Repository Contents: https://developer.github.com/v3/repos/contents/
  var request = $.ajax({
    
    // Example: https://api.github.com/repos/JasonD94/Mountain-Biking/contents/img/album/
    url: githubGetRequest,
    
    // Make sure to request API V3, just in case GitHub releases a future version 
    // which breaks this code. This also gets us JSON too.
    headers: { 
      "accept": "application/vnd.github.v3+json"
    },
    type: "GET"
  });
  
  /* 
      Once we get the results back, we can run through the Array of Objects we get
      back. It'll look something like:
      [
        {
          name: "something.jpg",
          path: "img/album/something.jpg"
          .. more data we can ignore ..
        },
        
        ... tons more file objects like above ...
      ]
      
      We will want to save a list of the paths.
  */
  request.done(function(data) {
    // Using for instead of foreach for performance
    // https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead
    for (var x = 0, len = data.length; x < len; x++)
    {
      var imgPath = data[x].path;
      
      // Using the img name to dynamically populate a description
      // Replace underscores (_'s) with spaces, and remove the file extension too (".jpg")
      var imgName = data[x].name;
      imgName = imgName.replace("_", " ").replace(".jpg", " "); 
      
      imgList.push( { "src": imgPath,
                      "srct": imgPath,
                      "title": imgName } );
    }
    
    // Debugging
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
});
