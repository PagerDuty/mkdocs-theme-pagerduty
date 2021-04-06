// Rather than downloading every single slide, try to be nice to users and lazy load the images
// instead. This will only work if they have JavaScript enabled of course. The site should still
// function correctly for those without JavaScript.

// Returns true if *any* part of an element is in view on the page.
function inView(el)
{
  if (el instanceof jQuery) { el = el[0]; }

  var r, html;
  if ( !el || 1 !== el.nodeType ) { return false; }
  html = document.documentElement;
  r = el.getBoundingClientRect();

  return ( !!r
    && r.bottom >= 0
    && r.right >= 0
    && r.top <= html.clientHeight
    && r.left <= html.clientWidth
  );
}

// TODO: Implement this without jQuery? No need to load a 100k library for this.
// Meh, we have massive images, a 100k JS file is nothing by comparison. Not worth the effort.
$(function()
{
  // Add event handler to fade in images once they're loaded so it's not so jarring.
  // Transition is controlled via CSS classes "hidden" and "loaded".
  $("article img").one("load", function()
  {
    $(this).parent().removeClass("hidden").addClass("loaded");
  });

  // Loop over every image/slide in the article.
  $("article img").each(function()
  {
    // If the image is already loaded (i.e. was cached in browser), show it immediately.
    if (this.complete)
    {
      $(this).addClass("loaded");
    }
    // If the image hasn't already loaded.
    else
    {
      // Add CSS class to hide the image from view while loading.
      $(this).parent().addClass("hidden");

      // Remove the "src" attribute on images to stop them loading over the network. Keep the value
      // in "data-src" so we can retrieve it later.
      $(this).attr("data-src", $(this).attr("src")).removeAttr("src");
    }
  });

  // As page scrolls/resizes, check for images within viewable area.
  $(window).on("scroll resize load", function()
  {
    $("article img").each(function()
    {
      // If it's in view, and hasn't been triggered to load yet.
      if (inView($(this)) && !$(this).attr("src"))
      {
        $(this).attr("src", $(this).attr("data-src")); // Swap back into "src" to load the image.
      }
    });
  });

  // If user wants to go to next/previous slide, add some helpers for that to give a slideshow.
  $(document).on("keydown", function(e) {
    // If no slideshow active, then nothing to do
    if ($("article input[type=checkbox]:checked").length == 0)
    {
      $("article").removeClass("slideshow");
      return;
    }

    // If ESC, quit.
    if (e.keyCode == 27)
    {
      $("article input[type=checkbox]:checked").prop("checked", false);
      $("article").removeClass("slideshow");
      return;
    }

    // If a left/right arrow was pressed...
    if (e.keyCode == 37 || e.keyCode == 39)
    {
      // Put us into slideshow mode. (This changes some of the CSS transitions/animations)
      $("article").addClass("slideshow");

      // Identify the current slide.
      slide_id = parseInt($("article input[type=checkbox]:checked").attr("id"));

      // Determine new slide ID based on if it's left/right arrow.
      if (e.keyCode == 37)
      {
        if (slide_id <= 1) { return; } // Nothing to do if at start
        new_slide_id = slide_id - 1;
      }
      if (e.keyCode == 39)
      {
        total = $("article input[type=checkbox]").length;
        if (slide_id >= total) { return; } // Nothing to do if at end.
        new_slide_id = slide_id + 1;
      }

      // Hide the current slide.
      $("input#" + ("" + slide_id).padStart(3, '0')).prop("checked", false);

      // Show the new one.
      $("input#" + ("" + new_slide_id).padStart(3, '0')).prop("checked", true);

      // Make sure to mark it as not hidden, and force the image to load too.
      $("input#" + ("" + new_slide_id).padStart(3, '0') + " + label").removeClass("hidden");
      $("input#" + ("" + new_slide_id).padStart(3, '0') + " + label img").attr("src", $("input#" + ("" + new_slide_id).padStart(3, '0') + " + label img").attr("data-src"));
    }
  })
});
