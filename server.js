
var express = require('express');
var http = require('http');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

var dateFormat = require('dateformat');
var now = new Date();

app.set('view engine', 'ejs');

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "mydb"
});


const siteTitle = "SMNode-1.0 applicaion";
const baseURL = "http://localhost:4000/"; 

app.get('/',function(req,res){

	con.query("SELECT * FROM e_events ORDER BY e_start_date DESC", function(err,result){
         res.render('pages/index',{
	    	siteTitle : siteTitle,
	    	pageTitle : "Event list",
	    	items : result
    });
	});
    
    
});

app.get('/event/add',function(req,res){

	   res.render('pages/add-event.ejs',{
		    	siteTitle : siteTitle,
		    	pageTitle : "Event list",
		    	items : ''
	    });
    
});


app.post('/event/add',function(req,res){

       var query = "INSERT INTO `e_events` (e_name,e_start_date,e_end_date,e_desc,e_location) VALUES(";
           query += " '"+req.body.e_name+"',";
           query += " '"+dateFormat(req.body.e_start_date,"yyyy-mm-dd")+"',"; 
           query += " '"+dateFormat(req.body.e_end_date,"yyyy-mm-dd")+"',"; 
           query += " '"+req.body.e_desc+"',"; 
           query += " '"+req.body.e_location+"')"; 

       con.query(query,function(err,result){

       	res.redirect(baseURL);

       });

});


app.get('/event/edit/:id',function(req,res){


    con.query("SELECT * FROM e_events WHERE e_id = '"+req.params.id+"'",function(err,result){

    	result[0].e_start_date = dateFormat(result[0].e_start_date,"yyyy-mm-dd");
    	result[0].e_end_date = dateFormat(result[0].e_end_date,"yyyy-mm-dd");

    	res.render('pages/edit-event',{
    		siteTitle : siteTitle,
    		pageTitle : "Editing event : " + result[0].e_name,
    		item : result
    	});

    });

});


app.post('/event/edit/:id',function(req,res){

       var query = "UPDATE e_events SET";
           query += " e_name = '"+req.body.e_name+"',";
           query += " e_start_date = '"+dateFormat(req.body.e_start_date,"yyyy-mm-dd")+"',"; 
           query += " e_end_date = '"+dateFormat(req.body.e_end_date,"yyyy-mm-dd")+"',"; 
           query += " e_desc = '"+req.body.e_desc+"',"; 
           query += " e_location = '"+req.body.e_location+"'";
           query += " WHERE e_id = "+req.body.e_id+""; 

       con.query(query,function(err,result){

       if(result.affectedRows){

       	   res.redirect(baseURL);
       }

       });

});


app.get('/event/delete/:event_id',function(req,res){

  
    con.query("DELETE FROM e_events WHERE e_id='"+req.params.event_id+"'",function(err,result){

    	if (result.affectedRows) {
    		
    		res.redirect(baseURL);
    	}
    });

});




var server = app.listen(4000,function(){
        console.log("Server started on 4000..."); 
});