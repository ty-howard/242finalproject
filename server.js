const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

let planes = [
  {
      "_id": "1",
      "airline": "jetBlue Airways",
      "aircraft": "Airbus A320-200",
      "alliance": "None",
      "registration": "N624JB",
      "user": "Admin",
      "date": "2/12/24",
      "flight": ["Origin: Raleigh/Durham, NC (RDU)", "Destination: Fort Lauderdale, FL (FLL)", "Duration: 2 hours 8 minutes"],
      "main_image": "n624jb.jpeg"
  },
  {
      "_id": "2",
      "airline": "United Airlines",
      "aircraft": "Airbus A320-200",
      "alliance": "Star Alliance",
      "registration": "N446UA",
      "user": "Admin",
      "date": "2/11/24",
      "flight": ["Origin: Chicago, IL (ORD)", "Desination: Raleigh/Durham, NC (RDU)", "Duration: 2 hours 15 minutes"],
      "main_image": "n446ua.jpeg"
  },
  {
      "_id": "3",
      "airline": "American Airlines",
      "aircraft": "Embraer E175-LR",
      "alliance": "OneWorld",
      "registration": "N111HQ",
      "user": "Admin",
      "date": "2/11/24",
      "flight": ["Origin: Raleigh/Durham, NC (RDU)", "Destination: New York NY (JFK)", "Duration: 1 hour 31 minutes"],
      "main_image": "n111hq.jpeg"
  },
  {
      "_id": "4",
      "airline": "American Airlines",
      "aircraft": "Boeing 777-200",
      "alliance": "OneWorld",
      "registration": "N762AN",
      "user": "Admin",
      "date": "2/11/24",
      "flight": ["Origin: London, England (LHR)", "Destination: Raleigh/Durham, NC (RDU)", "Duration: 8 hours 42 minutes"],
      "main_image": "n762an.jpeg"
  },
  {
      "_id": "5",
      "airline": "Breeze Airways",
      "aircraft": "Airbus A220-300",
      "alliance": "None",
      "registration": "N218BZ",
      "user": "Admin",
      "date": "2/11/24",
      "flight": ["Origin: Raleigh/Durham, NC (RDU)", "Destination: Providence, RI (PVD)", "Duration: 1 hour 53 minutes"],
      "main_image": "n218bz.jpeg"
  },
  {
      "_id": "6",
      "airline": "Delta Air Lines",
      "aircraft": "Boeing 757-200",
      "alliance": "SkyTeam",
      "registration": "N821DX",
      "user": "Admin",
      "date": "3/14/24",
      "flight": ["Origin: Atlanta, GA (ATL)", "Destination: Raleigh/Durham, NC (RDU)", "Duration: 1 hour 30 minutes"],
      "main_image": "n821dx.jpeg"
  },
  {
      "_id": "7",
      "airline": "Southwest Airlines",
      "aircraft": "Boeing 737-700",
      "alliance": "None",
      "registration": "N926WN",
      "user": "Admin",
      "date": "3/14/24",
      "flight": ["Origin: Dallas, TX (DAL)", "Destination: Raleigh/Durham, NC (RDU)", "Duration: 2 hours 32 minutes"],
      "main_image": "n926wn.jpeg"
  },
  {
      "_id": "8",
      "airline": "Air Canada Express",
      "aircraft": "Mitsubishi CRJ-900LR",
      "alliance": "Star Alliance",
      "registration": "C-GDJZ",
      "user": "Admin",
      "date": "3/14/24",
      "flight": ["Origin: Raleigh/Durham, NC (RDU)", "Destination: Toronto, Canada (YYZ)", "Duration: 1 hour 42 minutes"],
      "main_image": "cgdjz.jpeg"
  }
]

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/planes", (req, res)=>{
    res.send(planes);
});

let latestPlaneId = planes.length > 0 ? planes[planes.length - 1]._id : 0;

app.post("/api/planes", upload.single("img"), (req, res) => {
  const result = validatePlane(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  latestPlaneId++;

  const plane = {
    _id: latestPlaneId,
    name: req.body.name,
    description: req.body.description,
    supplies: req.body.supplies.split(","),
  };

  if (req.file) {
    plane.img = req.file.filename;
  }

  planes.push(plane);
  res.send(planes);
});


app.put("/api/planes/:id", upload.single("img"), (req, res)=>{
    const plane = planes.find((r)=>r._id === parseInt(req.params.id));
  
    if(!planes) res.status(400).send("Plane with given id was not found");
  
    const result = validatePlane(req.body);
  
    if(result.error){
      res.status(400).send(result.error.details[0].message);
      return;
    }
  
    plane.name = req.body.name;
    plane.description = req.body.description;
    plane.supplies = req.body.supplies.split(",");
  
    if(req.file) {
      plane.img = req.file.filename;
    }
  
    res.send(plane);
  });
  
  app.delete("/api/planes/:id", (req, res)=>{
    const plane = planes.find((r)=>r._id === parseInt(req.params.id));
  
    if(!plane){
      res.status(404).send("The plane with the given id was not found");
    }
  
    const index = planes.indexOf(plane);
    planes.splice(index,1);
    res.send(plane);
  });

const validatePlane = (plane) => {
  const schema = Joi.object({
    _id:Joi.allow(""),
    supplies:Joi.allow(""),
    name:Joi.string().min(3).required(),
    description:Joi.string().min(3).required()
  });

  return schema.validate(plane);
};

app.listen(3000, ()=> {
    console.log("Server is Running");
});