const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

mongoose
    .connect("mongodb+srv://howardty52:fcB1YOLUuSu0qilj@242assignments.vl2gcsf.mongodb.net/")
    .then(()=> {
        console.log("connected to mongodb");
    })
    .catch((error) => {
        console.log("couldn't connect to mongodb", error);
    });

const planeSchema = new mongoose.Schema({
    airline: String,
    aircraft: String,
    alliance: String,
    registration: String,
    user: String,
    date: String,
    notes: String,
    img: String
});

const Plane = mongoose.model("Plane", planeSchema);

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/planes", async (req, res)=>{
    const planes = await Plane.find();
    res.send(planes);
});

app.get("/api/planes/:id", async (req, res) => {
    const id = req.params.id;
    const plane = await Plane.findOne({_id:id});
    res.send(plane);
});

app.post("/api/planes", upload.single("img"), async (req, res) => {
  const result = validatePlane(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const plane = new Plane ({
    airline: req.body.airline,
    aircraft: req.body.aircraft,
    alliance: req.body.alliance,
    registration: req.body.registration,
    user: req.body.user,
    date: req.body.date,
    notes: req.body.notes
  });

  if (req.file) {
    plane.img = req.file.filename;
  }

  const saveResult = await plane.save();
  res.send(plane);
});

app.put("/api/planes/:id", upload.single("img"), async (req, res) => {
    const result = validatePlane(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let toUpdate = {
      airline: req.body.airline,
      aircraft: req.body.aircraft,
      alliance: req.body.alliance,
      registration: req.body.registration,
      user: req.body.user,
      date: req.body.date,
      notes: req.body.notes
    };

    if(req.file){
        toUpdate.img = req.file.filename;
    }

    const id = req. params.id;

    const updateResult = await Plane.updateOne({_id:id},toUpdate);
    res.send(updateResult);
});

app.delete("/api/planes/:id", async (req,res) => {
    const plane = await Plane.findByIdAndDelete(req.params.id);
    res.send(plane);
});

const validatePlane = (plane) => {
  const schema = Joi.object({
    _id:Joi.allow(""),
    airline:Joi.string().min(3).required(),
    aircraft:Joi.string().min(3).required(),
    alliance:Joi.allow("").required(),
    registration:Joi.string().min(3).required(),
    user:Joi.string().min(3).required(),
    date:Joi.allow("").required(),
    notes:Joi.allow("")
  });

  return schema.validate(plane);
};

app.listen(3000, ()=> {
    console.log("Server is Running");
});