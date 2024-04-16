const submitNewPlane = (e) => {
    e.preventDefault(); //don't refresh the page
    
    const form = e.target;
    const date = form.elements["date"].value;
    const airline = form.elements["airline"].value;
    const aircraft = form.elements["aircraft"].value;
    const alliance = form.elements["alliance"].value;
    const reg = form.elements["reg"].value;
    const name = form.elements["name"].value;
    /*Flight Data*/
    const orig = form.elements["orig"].value;
    const dest = form.elements["dest"].value;
    const hrs = form.elements["hrs"].value;
    const mins = form.elements["mins"].value;

    const conf = document.getElementById("form-sub");
    conf.classList.remove("hide");

    setTimeout(function() {
        conf.classList.add("hide");
    }, 2000);

    const infoParagraph = document.createElement("p");
    infoParagraph.textContent = "Plane " + reg + " logged with date " + date + ", type " + aircraft + ", alliance " + alliance + ", and airline " + airline + " by " + name;
    form.appendChild(infoParagraph);
    const flightData = document.createElement("p");
    flightData.textContent = "Flight Origin: " + orig + ", Destination: " + dest + ", Hours: " + hrs + ", Minutes: " + mins;
    form.appendChild(flightData);

}

document.getElementById("new-plane").onsubmit = submitNewPlane;