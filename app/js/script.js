// Responsive menu
var menu = document.getElementById("menu")
var menuIcon = document.getElementById("menu-icon")

document.addEventListener('click', e => {
  if(e.target.classList.contains('bar')){
    menu.classList.contains("activeMenu")
      ? menu.classList.remove("activeMenu")
      : menu.classList.add("activeMenu")

    menuIcon.classList.contains("open")
      ? menuIcon.classList.remove("open")
      : menuIcon.classList.add("open")
  } else {
    if(menu.classList.contains('activeMenu')) {
      menu.classList.remove('activeMenu')
      menuIcon.classList.remove("open")
    }
  }
})

// Remove responsive menu on window resize
$(window).on('resize', () => {
  var win = $(this);
  if (win.width() >= 940) {
    $('#menu').removeClass('activeMenu')
    menuIcon.classList.remove("open")
  }
})

// Content menu
$(document).ready(function() {
  $(".content-menu .java").addClass('selected')
  $(".info-box.java").addClass('active')
})

$(".content-menu li").click(function() {
  $(".content-menu li").removeClass("selected")
  $(this).addClass("selected")

  var str = $(this).attr('class')
  var subString = str.slice(0, -9);

  $(".info-container .info-box").removeClass('active');
  if ($(".info-box").hasClass(subString)) {
    $(".info-box." + subString).addClass('active');
  }
})
