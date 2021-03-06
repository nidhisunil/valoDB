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

//chained routes get, post, delete for all agents
app.route("/agents")

.get(
  function(req,res){
    Agent.find(function(err, foundAgents){
      if(!err){
        res.send(foundAgents);
      }else{
        res.send(err);
      }
    });
  }
)

.post(
  function(req,res){
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
  }
)

.delete(
  function(req,res){
    Agent.deleteMany(function(err){
      if(!err){
        res.send("Successfully deleted all agents");
      }else{
        res.send(err);
      }
    });
  }
);

//chained routes targetting speciific agents
app.route("/agents/:agentName")
.get(function(req,res){

    Agent.findOne({name: req.params.agentName}, function(err, foundAgent){
      if(foundAgent){
        res.send(foundAgent)
      }else{
        res.send("No such agent found");
      }
    });
  })

  .put( //replaces the entire resource wth new values
    function(req,res){
      Agent.update(
        {name: req.params.agentName},
        {name: req.query.name, type: req.query.type, ability: req.query.ability},
        {overwrite:true},
        function(err){
          if(!err){
            res.send("Agent details have been successfully changed");
          }else{
            res.send(err);
          }
        }
      );
    })

    .patch( //replaces only the mentioned fields
      function(req,res){
        Agent.update(
          {name: req.params.agentName},
          {$set: req.body},
          function(err){
            if(!err){
              res.send("Succesfully updated agent details");
            }else{
              res.send(err);
            }
          }
        );
      })

    .delete(
      function(req,res){
        Agent.deleteOne(
          {name: req.params.agentName},
          function(err){
            if(!err){
              res.send("Successfully deleted agent");
            } else{
              res.send(err);
            }
          }
        );
      }
    );





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
