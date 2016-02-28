var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/wine_warmup';

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/wine', function (req, res, next){
  var responseArray = [];
  pg.connect(connectionString, function(err, client, done){
    if(err) {
      done();
      return res.status(500).json({status: 'error', message: 'Something bad happened'});
    }
    var query = client.query('SELECT * FROM wine');

    query.on('row', function(row) {
        responseArray.push(row);
    });
    query.on('end', function() {
        res.json(responseArray);
        done();
    });
    pg.end();
  });
});

router.get('/api/wine/:id', function (req, res, next){
  var responseArray = [];
  pg.connect(connectionString, function(err, client, done){
    if(err) {
      done();
      return res.status(500).json({status: 'error', message: 'Something bad happened'});
    }
    var query = client.query('SELECT * FROM wine WHERE id ='+req.params.id);

    query.on('row', function(row) {
        responseArray.push(row);
    });
    query.on('end', function() {
        res.json(responseArray);
        done();
    });
    pg.end();
  });
});

router.post('/api/wine', function (req, res, next){
  var newWine = req.body;
  pg.connect(connectionString, function(err, client, done){
    if(err) {
      done();
      return res.status(500).json({status: 'error', message: 'Something bad happened'});
    }
    var query = client.query("INSERT INTO wine(name, description, rating) VALUES('"+
    newWine.name+"','"+newWine.description+"','"+newWine.rating+ "');");

    query.on('row', function(row) {
        responseArray.push(row);
    });
    query.on('end', function() {
        res.json({status: 'success', message: 'New Wine!'});
        done();
    });
    pg.end();
  });
});

router.put('/api/wine/:id', function (req, res, next){

  //UPDATE table SET column=whatever
  pg.connect(connectionString, function(err, client, done){
    if(err) {
      done();
      return res.status(500).json({status: 'error', message: 'Something bad happened'});
    }
    var query = client.query("UPDATE wine SET " + req.body.column + "='" + req.body.value + "' WHERE id="+req.params.id);

    query.on('row', function(row) {
        responseArray.push(row);
    });
    query.on('end', function() {
        res.json({status: 'success', message: 'Updated Wine!'});
        done();
    });
    pg.end();
  });
});

router.delete('/api/wine/:id', function (req, res, next){

  pg.connect(connectionString, function(err, client, done){
    if(err) {
      done();
      return res.status(500).json({status: 'error', message: 'Something bad happened'});
    }
    var query = client.query('DELETE from wine WHERE id='+req.params.id);

    query.on('row', function(row) {
        responseArray.push(row);
    });
    query.on('end', function() {
        res.json({status: 'success', message: 'Drank the wine'});
        done();
    });
    pg.end();
  });
});

module.exports = router;
