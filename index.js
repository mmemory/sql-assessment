var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://postgres:@localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);

    // db.user_create_seed(function(){
    //   console.log("User Table Init");
    // });
    // db.vehicle_create_seed(function(err){
    //     if(err) console.log(err);
    //   console.log("Vehicle Table Init")
    // });
});

app.get('/api/users', function(req, res) {
    db.get_all_users(function(err, response) {
        if (err) console.log(err);
        res.status(200).json(response);
    });
});

app.get('/api/vehicles', function(req, res) {
    db.get_all_vehicles(function(err, response) {
        if(err) console.log(err);
        res.status(200).json(response);
    });
});

app.post('/api/users', function(req, res) {
    var queryVars = [req.body.email, req.body.firstname, req.body.lastname];
    db.create_user(queryVars,function(err, response) {
        res.end();
    });
});

app.post('/api/vehicles', function(req, res) {
    var queryVars = [req.body.make, req.body.model, req.body.year, req.body.ownerId];

    db.create_vehicle(queryVars, function(err, response) {
        res.end();
    });
});

app.get('/api/user/:userId/vehiclecount', function(req, res) {
    db.get_vehicle_count_by_userid([req.params.userId], function(err, response) {
        res.json(response[0]);
    });
});

app.get('/api/user/:userId/vehicle', function(req, res) {
    db.get_all_vehicles_by_ownerid([req.params.userId], function(err, response) {
        res.json(response);
    });
});

app.get('/api/vehicle', function(req, res) {
    if(req.query.UserEmail) {
        db.get_vehicle_by_email([req.query.UserEmail], function(err, response) {
            if (err) console.log(err);
            res.json(response);
        });
    }
    if(req.query.userFirstStart) {
        db.get_vehicle_by_user_partial_name([req.query.userFirstStart+'%'], function(err, response) {
            if(err) console.log(err);
            res.json(response)
        });
    }
});

app.get('/api/newervehiclesbyyear', function(req, res) {
    db.get_vehicles_by_year(function(err, response) {
        if (err) console.log(err);
        res.json(response);
    });
});

app.put('/api/vehicle/:vehicleId/user/:userId', function(req, res) {
    db.update_vehicle_owner([req.params.userId, req.params.vehicleId], function(err, response) {
        if(err) console.log(err);
        res.json(response);
    });
});

app.delete('/api/user/:userId/vehicle/:vehicleId', function(req, res) {
    db.remove_ownership_of_vehicle([req.params.vehicleId, req.params.userId], function(err, response) {
        if(err) console.log(err);
        res.send();
    });
});

app.delete('/api/vehicle/:vehicleId', function(req, res) {
    db.delete_vehicle([req.params.vehicleId], function(err, response) {
        if(err) console.log(err);
        res.send();
    })
});

app.listen('3000', function(){
  console.log("Successfully listening on : 3000")
});

module.exports = app;