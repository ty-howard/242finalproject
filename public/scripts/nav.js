const togNav = () => {
    const tri = document.getElementById("triangle");
    const nav = document.getElementById("nav-items");
    nav.classList.toggle("hide");
    if(nav.classList.contains("hide")){
        console.log("has hide");
        triangle.classList.add("down");
        triangle.classList.remove("up");
    }
    else {
        console.log("no hide");
        triangle.classList.add("up");
        triangle.classList.remove("down");
    }
  };
  
  document.getElementById("triangle").onclick = togNav;