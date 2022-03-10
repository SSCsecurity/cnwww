
// A $( document ).ready() block.
jQuery( document ).ready(function() {

	var sections = jQuery('section')
  , nav = jQuery('#navbar')
  , nav_height = nav.outerHeight();

jQuery(window).on('scroll', function () {
  var cur_pos = jQuery(this).scrollTop();
  
  sections.each(function() {
    var top = jQuery(this).offset().top - nav_height, //178
        bottom = top + jQuery(this).outerHeight();
    
    if (cur_pos >= top && cur_pos <= bottom) {
      nav.find('a').removeClass('active');
      sections.removeClass('active');
      
      jQuery(this).addClass('active');
      nav.find('a[href="#'+jQuery(this).attr('id')+'"]').addClass('active');
    }
  });
});

nav.find('a.portal-submenu-item').on('click', function () {
  var el = jQuery(this)
    , id = el.attr('href');
  
  jQuery('html, body').animate({
    scrollTop: jQuery(id).offset().top - 175
  }, 500);
  
  return false;
});



window.onscroll = function() {myFunction()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop-145;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}
    
});

