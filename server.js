﻿var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'web2020',
	password : 'web2020',
	database : 'web'
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.static('Public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

function restrict(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.sendFile(path.join(__dirname + '/my/login.html'));
  }
}

app.use('/', function(request, response, next) {
	if ( request.session.loggedin == true || request.url == "/login" || request.url == "/register" ) {
    next();
	}
	else {
    response.sendFile(path.join(__dirname + '/Index/login.html'));
	}
});

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/Index/home.html'));
});

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/Index/login.html'));
});

app.post('/login', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
				response.end();
			} else {
				//response.send('Incorrect Username and/or Password!');
				response.sendFile(path.join(__dirname + '/Index/loginerror.html'));
			}			
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/register', function(request, response) {
	response.sendFile(path.join(__dirname + '/Index/register.html'));
});

app.post('/register', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var password2 = request.body.password2;
	var email = request.body.email;
	console.log(username, password, email);
	if (username && password && email) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ? AND email = ?', [username, password, email], function(error, results, fields) {
			if (error) throw error;
			if (results.length <= 0) {
        connection.query('INSERT INTO user (username, password, email) VALUES(?,?,?)', [username, password, email],
            function (error, data) {
                if (error)
                  console.log(error);
                else
                  console.log(data);
        	});
				response.send('<br><center>! ' + username + ' REGISTERD SUCCESSFULLY !<br><br><br><a href="/home">HOME</a></center>');
				//response.sendFile(path.join(__dirname + '/Index/registersuccess.html'));
			} else {
				response.send('<br><center>! ' + username + ' ALREADY REGISTERD !<br><br><br><a href="/home">HOME</a></center>');
				//response.sendFile(path.join(__dirname + '/Index/registerfail.html'));
			}			
			response.end();
		});
	} else {
		response.send('Please enter User Information!');
		response.end();
	}
});

app.get('/logout', function(request, response) {
  request.session.loggedin = false;
	response.send('<br><center><H1>LOGGED OUT</H1><br><br><H1><a href="/">HOME</a></H1></center>');
	response.end();
});

app.get('/home', restrict, function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Index/home.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});


/* Css */

app.get('/main.css', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/main.css'));
});

app.get('/area.css', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/area.css'));
});

app.get('/intro.css', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/intro.css'));
});

app.get('/spot.css', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/spot.css'));
});

app.get('/food.css', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/food.css'));
});

app.get('/item.css', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/item.css'));
});


/* Font */

app.get('/NanumBarunpenB.ttf', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/Font/NanumBarunpenB.ttf'));
});

app.get('/NanumBarunpenB.woff', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/Font/NanumBarunpenB.woff'));
});

app.get('/Seongsil.ttf', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/Font/Seongsil.ttf'));
});

app.get('/Seongsil.woff', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/Font/Seongsil.woff'));
});

app.get('/Dahaeng.ttf', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/Font/Dahaeng.ttf'));
});

app.get('/Dahaeng.woff', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/Font/Dahaeng.woff'));
});

app.get('/Amsterdam.ttf', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/Font/Amsterdam.ttf'));
});

app.get('/Amsterdam.woff', function(request, response) {
	response.sendFile(path.join(__dirname + '/Css/Font/Amsterdam.woff'));
});


/* Images */

app.get('/feiji.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/feiji.png'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});


app.get('/map.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/map.png'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/mainlogo.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/mainlogo.gif'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/go.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/go.png'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/dongbei.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/dongbei.jfif'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/heilongjiang.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/heilongjiang.jfif'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/haerbin_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/haerbin_1_crop.png'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/haerbin_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/haerbin_1.png'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/haerbin_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/haerbin_2.png'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/haerbin_3.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/haerbin_3.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/haerbin_4.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/haerbin_4.png'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/haerbin_5.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/haerbin_5.png'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/haerbin_6.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/haerbin_6.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/castle_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/castle_1_crop.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/castle_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/castle_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/castle_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/castle_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/castle_3.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/castle_3.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/castle_4.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/castle_4.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/castle_5.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/castle_5.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/castle_6.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/castle_6.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/731_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/731_1_crop.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/731_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/731_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/731_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/731_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/731_3.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/731_3.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/731_4.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/731_4.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/An_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/An_1_crop.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/An_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/An_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/An_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/An_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/An_3.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/An_3.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/An_4.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/An_4.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jingpo_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/jingpo_1_crop.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jingpo_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/jingpo_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jingpo_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/jingpo_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jingpo_3.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/jingpo_3.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jingpo_4.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/jingpo_4.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/snow_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/snow_1_crop.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/snow_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/snow_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/snow_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/snow_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/snow_3.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/snow_3.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/snow_4.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/snow_4.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/erlong_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/erlong_1_crop.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/erlong_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/erlong_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/erlong_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/erlong_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/erlong_3.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/erlong_3.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/erlong_4.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/erlong_4.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/taiyang_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/taiyang_1_crop.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/taiyang_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/taiyang_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/taiyang_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/taiyang_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/taiyang_3.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/taiyang_3.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/taiyang_4.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/taiyang_4.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/laochang_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/laochang_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/laochang_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/laochang_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/laochang_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/laochang_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/liang_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/liang_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/liang_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/liang_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/liang_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/liang_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/laochu_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/laochu_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/laochu_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/laochu_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/laochu_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/laochu_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jangbao_1_crop.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/jangbao_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jangbao_1.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/jangbao_1.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jangbao_2.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/jangbao_2.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jilin.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/jilin.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/liaoning.img', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Images/liaoning.jpg'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});


/* Pages */

app.get('/main', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/main.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/dongbei', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Areas/dongbei.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/heilongjiang_intro', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Heilongjiang/heilongjiang_intro.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/heilongjiang_spot1', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Heilongjiang/heilongjiang_spot1.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/heilongjiang_spot2', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Heilongjiang/heilongjiang_spot2.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/heilongjiang_food', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Heilongjiang/heilongjiang_food.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/heilongjiang_item', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Heilongjiang/heilongjiang_item.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jilin_intro', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Jilin/jilin_intro.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jilin_spot', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Jilin/jilin_spot.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jilin_food', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Jilin/jilin_food.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/jilin_item', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Jilin/jilin_item.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/liaoning_intro', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Liaoning/liaoning_intro.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/liaoning_spot', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Liaoning/liaoning_spot.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/liaoning_food', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Liaoning/liaoning_food.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});

app.get('/liaoning_item', function(request, response) {
	if (request.session.loggedin) {
		response.sendFile(path.join(__dirname + '/Pages/Regions/Liaoning/liaoning_item.html'));
	} else {
		response.send('Please login to view this page!');
		response.end();
	}
});


/* Server */
app.listen(3000, function () {
    console.log('Server Running at http://127.0.0.1:3000');
});


/*
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/Pages')); // 1

var port = 8001;
app.listen(port, function(){
  console.log('Server is running...\nAddress: http://localhost:'+port);
});
*/