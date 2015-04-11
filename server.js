
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var bodyParser = require('body-parser');
var router = express.Router();

var User = require('./models/user');
var Task = require('./models/task');


mongoose.connect('mongodb://erazfa2:edog@ds061681.mongolab.com:61681/ehsan');
var app = express();
var port = process.env.PORT || 4000;

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  next();
};
app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api', router);

var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

var llamaRoute = router.route('/llamas');

llamaRoute.get(function(req, res) {
  res.json([{ "name": "alice", "height": 12 }, { "name": "jane", "height": 13 }]);
});


var usersRoute = router.route('/users');

usersRoute.get(function(req, res, next) {
	var q = User.find();

	if(typeof (req.query.where) === "object"){
		for(var i = 0; i < req.query.where.length; i++)
			q.find(eval("("+req.query.where[i]+")"));
	}
	else
		q.find(eval("("+req.query.where+")"));

	if(typeof(req.query.sort) === "object"){
		for(var i = 0; i < req.query.sort.length; i++)
			q.sort(eval("("+req.query.sort[i]+")"));
		}
	else
		q.sort(eval("("+req.query.sort+")"));

	
	if(typeof(req.query.select) === "object"){
		for(var i = 0; i < req.query.select.length; i++)
			q.select(eval("("+req.query.select[i]+")"));
	}
	
	else
		q.select(eval("("+req.query.select+")"));

	if(typeof(req.query.skip) === "object"){

	for(var i = 0; i < req.query.skip.length; i++)
		q.skip(eval("("+req.query.skip[i]+")"));
	}
	else
		q.skip(eval("("+req.query.skip+")"));

	if(typeof(req.query.limit) === "object"){

	for(var i = 0; i < req.query.limit.length; i++)
		q.limit(eval("("+req.query.limit[i]+")"));
	}
	else
		q.limit(eval("("+req.query.limit+")"));


	if(eval("("+req.query.count+")"))
		q.count();

	q.exec(function (err, user){
		if (err) return res.status(500).json([{"message": "Error accessing database", "data": []}]);
		if(user.length < 1) res.status(404).json([{"message": "User not found", "data": []}]);
		else res.status(200).json({"message": "OK", "data": user});
	});

});

usersRoute.post(function(req, res, next) {
	if (req.body.name === "" || req.body.name === undefined) {
		res.status(500).json({"message": "Must include a name", "data": []});
		return;
	}
	if (req.body.email === "" || req.body.email === undefined) {
		res.status(500).json({"message": "Must include an email", "data": []});
		return;
	}

	User.findOne({email: req.body.email}, function (err, userEmail) {
		if (err) return res.status(500).json([{"message": "Error accessing database", "data": []}]);
		if (userEmail != null) {
			res.status(500).json({"message": "Email address already in database", "data": []});
		}
		else{
			User.create(req.body, function (err, post) {
				if (err) return next(err);
				res.status(201).json({"message": "OK", "data": post});
			});
		}
	});

});

usersRoute.options(function(req, res){
	res.writeHead(200);
	res.end();
});

var usersIdRoute = router.route('/users/:id');

usersIdRoute.get(function(req, res, next) {
	User.findById(req.params.id, function(err, user) {
		if (err) return res.status(500).json({"message": "Error accessing database", "data": []});
		if(user === null) res.status(404).json({"message": "User not found", "data": []});
		else res.status(200).json({"message": "OK", "data": user});
	});
});

usersIdRoute.put(function(req, res, next) {
	if (req.body.name === "" || req.body.name === undefined) {
		res.status(500).json({"message": "Must include a name", "data": []});
		return;
	}
	if (req.body.email === "" || req.body.email === undefined) {
		res.status(500).json({"message": "Must include an email", "data": []});
		return;
	}

	User.findOne({email: req.body.email}, function (err, userEmail) {
		if (err) return res.status(500).json({"message": "Error accessing database", "data": []});
		if (userEmail['_id'] != req.params.id) {
			
			res.status(500).json({"message": "Email address already in database", "data": []});
		}
		else {
			User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
				if (err) return res.status(500).json({"message": "Error accessing database", "data": []});
				if (user === null) res.status(404).json({"message": "User not found", "data": []});
				else res.status(200).json({"message": "OK", "data": user});
			});
		}
	});
});

usersIdRoute.delete(function(req, res, next) {
	User.findByIdAndRemove(req.params.id, req.body, function(err, post){
	   if(err) return res.status(500).json({"message": "Error accessing database", "data": []});
		if (post === null) res.status(404).json({"message": "User not found", "data": []});
		else res.status(200).json({"message": "OK", "data": []});
	});
});

var tasksRoute = router.route('/tasks');

tasksRoute.get(function(req, res, next) {
	var q = Task.find();


if(typeof (req.query.where) === "object"){
	for(var i = 0; i < req.query.where.length; i++)
		q.find(eval("("+req.query.where[i]+")"));
}
else
	q.find(eval("("+req.query.where+")"));


	if(typeof(req.query.sort) === "object"){

	for(var i = 0; i < req.query.sort.length; i++)
		q.sort(eval("("+req.query.sort[i]+")"));
	}
	else
		q.sort(eval("("+req.query.sort+")"));

	
	if(typeof(req.query.select) === "object"){

	for(var i = 0; i < req.query.select.length; i++)
		q.select(eval("("+req.query.select[i]+")"));
	}
	else
		q.select(eval("("+req.query.select+")"));

	if(typeof(req.query.skip) === "object"){

	for(var i = 0; i < req.query.skip.length; i++)
		q.skip(eval("("+req.query.skip[i]+")"));
	}
	else
		q.skip(eval("("+req.query.skip+")"));

	if(typeof(req.query.limit) === "object"){

	for(var i = 0; i < req.query.limit.length; i++)
		q.limit(eval("("+req.query.limit[i]+")"));
	}
	else
		q.limit(eval("("+req.query.limit+")"));


	if(eval("("+req.query.count+")"))
		q.count();


	q.exec(function (err, task){
		if (err) return res.status(500).json({"message": "Error accessing database", "data": []});
		if(task.length < 1) res.status(404).json({"message": "Task not found", "data": []});
		else res.status(200).json({"message": "OK", "data": task});
	});


});

tasksRoute.post(function(req, res){
	if (req.body.name === "" || req.body.name === undefined) {
		res.status(500).json({"message": "Must include a name", "data": []});
		return;
	}
	if (req.body.deadline === "" || req.body.deadline === undefined) {
		res.status(500).json({"message": "Must include a deadline", "data": []});
		return;
	}
	Task.create(req.body, function(err, tasks){
		if(err) return res.status(500).json([{"message": "Error accessing database", "data": []}]);
		res.status(201).json({"message": "OK", "data": tasks});

	})
});

tasksRoute.options(function(req, res){
	res.writeHead(200);
	res.end();
});

var tasksIdRoute = router.route('/tasks/:id');

tasksIdRoute.get(function(req, res){
	Task.findById(req.params.id, function(err, task) {
		if (err) return res.status(500).json({"message": "Error accessing database", "data": []});
		if(task === null) res.status(404).json({"message": "Task not found", "data": []});
		else res.status(200).json({"message": "OK", "data": task});
	});
});

tasksIdRoute.put(function(req, res){
	if (req.body.name === "" || req.body.name === undefined) {
		res.send(req.body);
		
		return;
	}
	if (req.body.deadline === "" || req.body.deadline === undefined) {
		res.status(500).json({"message": "Must include a deadline", "data": []});
		return;
	}
	Task.findByIdAndUpdate(req.params.id, req.body, function (err, task) {
		if (err) return res.status(500).json({"message": "Error accessing database", "data": []});
		if (task === null) res.status(404).json({"message": "Task not found", "data": []});
		else res.status(200).json({"message": "OK", "data": task});
	});

});

tasksIdRoute.delete(function(req, res){
	Task.findByIdAndRemove(req.params.id, req.body, function(err, post){
		if(err) return res.status(500).json({"message": "Error accessing database", "data": []});
		if (post === null) res.status(404).json({"message": "Task not found", "data": []});
		else res.status(200).json({"message": "OK", "data": []});
	});
});


app.listen(port);
console.log('Server running on port ' + port); 
