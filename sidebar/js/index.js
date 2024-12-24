document
  .getElementById("mobile-menu-toggle")
  .addEventListener("click", function () {
    const mobileNav = document.getElementById("mobile-nav");
    mobileNav.classList.toggle("mobile-active");

    // Toggle between the two versions (we can customize this condition as needed)
    if (window.innerWidth <= 768) {
      mobileNav.classList.toggle("right-to-left");
    }
  });


  function checkScreen(){
    const sideBar = document.getElementById("sidebar");
    const showSidebar = document.getElementById("showSidebar");
    const hideSidebar = document.getElementById("hideSidebar");
    const toggleIcons = document.getElementById("toggleIcons");
    const content = document.getElementById('content')
    

    if (window.matchMedia("(max-width: 768.98px)").matches) {
      sideBar.classList.add('active')
      showSidebar.style.display = "none"
      hideSidebar.style.display = "none"
      toggleIcons.style.display = "none"
      content.style.width = "94%"
    } else {
      showSidebar.style.display = "block";
      hideSidebar.style.display = "block";
      toggleIcons.style.display = "block";
    }
  }

  checkScreen();

  window.addEventListener('resize', checkScreen)