//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/valoDB",{useNewUrlParser: true});
const agentSchema = {
  name: {
    type: String
  },
  type: {
    type: String
  },
  ability: [{
    type: String
  }]
};
const Agent = mongoose.model("Agent", agentSchema);

//get all
app.get("/agents",function(req,res){
  Agent.find(function(err, foundAgents){
    if(!err){
      res.send(foundAgents);
    }else{
      res.send(err);
    }

  });
});

//post
app.post("/agents", function(req,res){
  const newAgent = new Agent({
    name: req.query.name,
    type: req.query.type,
    ability: req.query.ability
  });
  newAgent.save(function(err){
    if(!err){
      res.send("A new agent has been added");
    }
    else{
      res.send(err);
    }
  });
});

//delete all
app.delete("/agents", function(req,res){
  Agent.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all agents");
    }else{
      res.send(err);
    }
  });
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
