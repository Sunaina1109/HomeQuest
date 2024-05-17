const express= require("express");
const app= express();
const mongoose= require("mongoose");
const Listing = require("./models/listing.js");
const port= 8081;
const path= require("path");
const methodOverride = require("method-override");
const ejsMate= require("ejs-mate"); //using for repeating tamplates in all pages like: navbar, footer, etc.



const Mongo_URL= "mongodb://127.0.0.1:27017/wonderlust";
// //this all code to connect my mongodb 
main().then((listing)=>{
    console.log("successfully run")
})
.catch((err)=>{
    console.log(err)
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static( path.join(__dirname, "public")))


async function main() {
await mongoose.connect(Mongo_URL);
};

app.get("/", (req, res)=>{
    res.send(" root is working");   
});

app.get("/listings", async (req, res)=>{
  const allListings= await Listing.find({});
  res.render("listings/index.ejs", {allListings})
});

app.get("/listings/new", async (req, res)=>{
  res.render("listings/new.ejs")
});

//show route
app.get("/listings/:id", async (req, res)=>{
  let {id}= req.params;
  const listing= await Listing.findById(id);
  res.render("listings/show.ejs", {listing});

});

//create route
app.post("/listings", async(req, res)=>{
  let newListing= new Listing (req.body.listing);
  await newListing.save();
  res.redirect("/listings")
});

//edit Route
app.get('/listings/:id/edit', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/edit', { listing, listing_id: req.params.id });
  } catch (error) {
    res.status(500).send('Error fetching listing');
  }
});

// update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing });
  res.redirect(`/listings/${id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   let sampleListing2 = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   await sampleListing2.save();
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.listen(port, ()=>{
    console.log("port is listen 8081");
});







