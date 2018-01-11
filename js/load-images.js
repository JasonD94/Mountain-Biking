/*
    Jason Downing - Software Developer
    Contact: jason@downing.io
    
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    Anyone may freely use this code. Just don't sue me if it breaks stuff.
    Created: Jan 9, 2018
    
    This JS file loads all images in the /img/album/ directory into the 
    nanogallery2
    
    ** Useful URLs **
    GitHub API Docs:    https://developer.github.com/v3/
    jQuery.ajax() Docs: https://api.jquery.com/jquery.ajax/
    nanogallery2 Docs:  https://nanogallery2.nanostudio.org/quickstart.html
*/

// List of image paths for displaying in the nanogallery2 image gallery
var imgList = [];

// GitHub API End Point URL / Path
var githubApiVersion = "application/vnd.github.v3+json";
var githubApiBaseUrl = "https://api.github.com";
var githubRepo = "Mountain-Biking";
var githubPath = "img/album/";
var githubBranch = "gh-pages";

$( document ).ready(function() {
  
  /* 
      So turns out GitHub Pages, which is how I host the majority of my web pages,
      doesn't let me access a directory like "img/album/" mentioned above. 
      They do however have a REST API! So, let's use that instead.
     
      jQuery.ajax can be used to GET the Contents of a directory via the GitHub REST API.
  */
  
  // GET /repos/:owner/:repo/contents/:path
  var githubGetRequest = githubApiBaseUrl + "/repos/JasonD94/" + githubRepo + "/contents/" + githubPath;
  
  // API docs page for Getting Repository Contents: https://developer.github.com/v3/repos/contents/
  var request = $.ajax({
    
    // Example: https://api.github.com/repos/JasonD94/Mountain-Biking/contents/img/album/
    url: githubGetRequest,
    
    // Need to provide the branch so we pull from gh-pages and NOT master
    data: {"ref": githubBranch},
    
    // Make sure to request API V3, just in case GitHub releases a future version 
    // which breaks this code. This also gets us JSON too.
    headers: { "accept": githubApiVersion },
    type: "GET"
  });
  
  /* 
      Once we get the results back, we can run through the Array of Objects we get back. 
      It'll look something like:
      [
        {
          name: "something.jpg",
          path: "img/album/something.jpg"
          .. more data we can ignore ..
        },
        
        ... tons more file objects like above ...
      ]
  */
  request.done(function(data) {
    // Using for instead of foreach for performance
    // https://coderwall.com/p/kvzbpa/don-t-use-array-foreach-use-for-instead
    for (var x = 0, len = data.length; x < len; x++)
    {
      var imgPath = data[x].path;
      
      // Using the img name to dynamically populate a description
      // Replace underscores (_'s) with spaces, and remove the file extension too (".jpg")
      // And I like slashes instead of dashes so let's replace those too!
      var imgName = data[x].name;
      imgName = imgName.replace("_", " ").replace("-", "/").replace(".jpg", " "); 
      
      imgList.push( { "src": imgPath,
                      "srct": imgPath,
                      "title": imgName } );
    }
    
    // Debugging
    console.log(imgList);
  
    $("#nanogallery2").nanogallery2({
      
      // Gallery Settings
      thumbnailHeight:  200,
      thumbnailWidth:   200,
      items: imgList            // This is a JSON object with imgPaths / Names
    });
  });
});
