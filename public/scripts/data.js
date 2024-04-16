const getPlanes = async() => {
  try {
      return (await fetch("/api/planes/")).json();
  } catch(error){
      console.log("error retrieving data");
  }
};

const showPlanes = async() => {
  const planes = await getPlanes();
  const planesDiv = document.getElementById("resultscont");
  planesDiv.innerHTML = "";

  planes.forEach((plane)=>{

    document.getElementById("resultscont").append(getPlaneSection(plane));

  });
};
  
  const getPlaneSection = (plane) => {
    const result = document.createElement("section");
    result.classList.add("one");
    result.setAttribute("id","result");
    result.onclick = () => openModal(plane);
  
    const columns = document.createElement("div");
    columns.classList.add("columns");
    result.append(columns);
  
    const imgSection = document.createElement("section");
    imgSection.classList.add("one");
    imgSection.setAttribute("id","resimg");
    columns.append(imgSection);
  
    const img = document.createElement("img");
    img.src = "./images/" + plane.main_image;
    imgSection.append(img);
  
    const txtSection = document.createElement("section");
    txtSection.classList.add("one");
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
    h4.innerHTML = "Logged on " + plane.date + " by " + plane.user;
    result.append(h4);
  
    return result;
  }
  
  const openModal = (plane) => {
    const modal = document.getElementById("myModal");
    const modalContent = document.getElementById("modal-content");
    
    modalContent.innerHTML = "";
  
    const closeBtn = document.getElementsByClassName("close")[0];
    closeBtn.onclick = () => modal.style.display = "none";
  
    modal.style.display = "block";
  
    const columnsContainer = document.createElement("div");
    columnsContainer.classList.add("columns");
  
    const dataColumn = document.createElement("div");
    dataColumn.classList.add("one");
  
    const flightParagraph = document.createElement("p");
      flightParagraph.innerHTML = "Flight Data:";
      plane.flight.forEach(flightSegment => {
          const flightSegmentLine = document.createElement("p");
          flightSegmentLine.innerHTML = flightSegment;
          flightParagraph.appendChild(flightSegmentLine);
      });
      dataColumn.appendChild(flightParagraph);
  
    const date = document.createElement("p");
    date.innerHTML = "Seen at RDU on " + plane.date + " by " + plane.user;
    dataColumn.append(date);
  
    const imageColumn = document.createElement("div");
    imageColumn.classList.add("one");
  
    const image = document.createElement("img");
    image.src = "./images/" + plane.main_image;
    image.style.width = "90%";
    imageColumn.append(image);
  
    columnsContainer.append(dataColumn);
    columnsContainer.append(imageColumn);
  
    modalContent.append(columnsContainer);
  }

showPlanes();