const getPlanes = async() => {
  try {
      return (await fetch("/api/planes/")).json();
  } catch(error){
      console.log("error retrieving data");
  }
};

const showPlanes = async() => {
  const planes = await getPlanes();
  const planesDiv = document.getElementById("gallery");
  planesDiv.innerHTML = "";

  planes.forEach((plane)=>{
    const result = document.createElement("section");
    result.classList.add("one");
    result.setAttribute("id","result");
  
    const columns = document.createElement("div");
    columns.classList.add("columns");
    result.append(columns);
  
    const imgSection = document.createElement("section");
    imgSection.classList.add("three");
    imgSection.setAttribute("id","resimg");
    columns.append(imgSection);
  
    const img = document.createElement("img");
    img.src = "./images/" + plane.img;
    imgSection.append(img);
  
    const txtSection = document.createElement("section");
    txtSection.classList.add("two");
    txtSection.setAttribute("id","restxt");
    columns.append(txtSection);
  
    const al = document.createElement("p");
    al.innerHTML = "Airline: " + plane.airline;
    txtSection.append(al);
  
    const ac = document.createElement("p");
    ac.innerHTML = "Aircraft: " + plane.aircraft;
    txtSection.append(ac);
  
    const ali = document.createElement("p");
    ali.innerHTML = "Alliance: " + plane.alliance;
    txtSection.append(ali);
  
    const reg = document.createElement("p");
    reg.innerHTML = "Registration: " + plane.registration;
    txtSection.append(reg);
  
    const hr = document.createElement("hr");
    result.append(hr);
  
    const h4 = document.createElement("h4");
    h4.innerHTML = "Logged on <b>" + plane.date + "</b> by <b>" + plane.user + "</b";
    h4.classList.add("center");
    result.append(h4);

    planesDiv.append(result);

      result.onclick = (e) => {
          e.preventDefault();
          displayDetails(plane);
      };
  });
};

const displayDetails = (plane) => {
  openDialog("plane-details");

  const planeDetails = document.getElementById("plane-details");
  planeDetails.classList.add("columns");
  planeDetails.innerHTML = "";

  const dataColumn = document.createElement("div");
  dataColumn.classList.add("one");

  const dLink = document.createElement("a");
  dLink.innerHTML = "	&#9249;";
  dataColumn.append(dLink);
  dLink.id = "delete-link";

  const eLink = document.createElement("a");
  eLink.innerHTML = "&#9998;";
  dataColumn.append(eLink);
  eLink.id = "edit-link";

  const al = document.createElement("p");
  al.innerHTML = "Airline: " + plane.airline;
  dataColumn.append(al);

  const ac = document.createElement("p");
  ac.innerHTML = "Aircraft: " + plane.aircraft;
  dataColumn.append(ac);

  const ali = document.createElement("p");
  ali.innerHTML = "Alliance: " + plane.alliance;
  dataColumn.append(ali);

  const reg = document.createElement("p");
  reg.innerHTML = "Registration: " + plane.registration;
  dataColumn.append(reg);

  const date = document.createElement("p");
  date.innerHTML = "Seen at RDU on " + plane.date + " by " + plane.user;
  dataColumn.append(date);

  const hr = document.createElement("hr");
  hr.classList.add("detHR");
  dataColumn.append(hr);

  const notesLab = document.createElement("p");
  notesLab.innerHTML = "Notes from " + plane.user + ": ";
  dataColumn.append(notesLab);

  const notes = document.createElement("p");
  if (plane.notes == ""){
    notes.innerHTML = "User left no notes.";
  }
  else{
  notes.innerHTML = plane.notes;
  }
  dataColumn.append(notes);

  const imageColumn = document.createElement("div");
  imageColumn.classList.add("one");

  const image = document.createElement("img");
  image.src = "./images/" + plane.img;
  image.style.width = "90%";
  imageColumn.append(image);

  planeDetails.append(imageColumn);
  planeDetails.append(dataColumn);

  eLink.onclick = showPlaneForm;
  dLink.onclick = () => openWarn(plane);

  populateEditForm(plane);

};

const populateEditForm = (plane)=>{
  const form = document.getElementById("add-plane-form");
  form._id.value = plane._id;
  form.airline.value = plane.airline;
  form.aircraft.value = plane.aircraft;
  form.alliance.value = plane.alliance;
  form.registration.value = plane.registration;
  form.user.value = plane.user;
  form.date.value = plane.date;
  form.notes.value = plane.notes;
  document.getElementById("img-prev").src = "./images/" + plane.img;
};

const openDialog = (id) => {
  document.getElementById("dialog").style.display = "block";
  document.querySelectorAll("#dialog-details > *").forEach((item)=> {
      item.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

const openWarn = (plane) => {
  document.getElementById("warn").style.display = "block";
  document.getElementById("dialog").style.display = "none";
  const btn = document.getElementById("del-final");
  btn.onclick = () => deletePlane(plane);
}

const showPlaneForm = (e) => {
  openDialog("add-plane-form");
  console.log(e.target);
  if (e.target.getAttribute("id") != "edit-link") {
    resetForm();
  }
};

const resetForm = () => {
  const form = document.getElementById("add-plane-form");
  form.reset();
  form._id.value = "";
  document.getElementById("img-prev").src="";
};

const addEditPlane = async (e) => {
  e.preventDefault();
  const form = document.getElementById("add-plane-form");
  const formData = new FormData(form);
  let response;

  console.log(...formData);

  //add request
  if (form._id.value.trim() == "") {
    console.log("in post");
    response = await fetch("/api/planes", {
      method: "POST",
      body: formData,
    });
  } else {
    console.log("in put");
    response = await fetch(`/api/planes/${form._id.value}`, {
      method: "PUT",
      body: formData,
    });
  }

  //successfully got data from server
  if (response.status != 200) {
    console.log("Error adding / editing data");
  }

  await response.json();
  resetForm();
  document.getElementById("dialog").style.display = "none";
  showPlanes();
};

const deletePlane = async(plane) =>{
  document.getElementById('warn').style.display='none';
  let response = await fetch(`/api/planes/${plane._id}`,{
    method:"DELETE",
    headers:{
      "Content-Type":"application/json;charset=utf-8",
    },
  });

  if(response.status!= 200){
    console.log("Error deleting");
    return;
  }

  let result = await response.json();
  resetForm();
  showPlanes();
  document.getElementById("dialog").style.display = "none";
};

//on Load

showPlanes();
document.getElementById("add-plane-form").onsubmit = addEditPlane;
document.getElementById("add-link").onclick = showPlaneForm;

document.getElementById("img").onchange = (e) => {
  const prev = document.getElementById("img-prev");

  //they didn't pick an image
  if(!e.target.files.length){
      prev.src = "";
      return;
  }

  prev.src = URL.createObjectURL(e.target.files.item(0));
}