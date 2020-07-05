var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded(
    { extended:true }
));

app.use(express.static("public"));


app.get("/",function(req, res){
    request("http://api.openweathermap.org/data/2.5/weather?q=Kohalpur,NP&APPID=fe0c23724926411ceef2af1e41ccd932",function(error, response, body){
    if(error){
        console.log(error);
    }
    else{
        if(response.statusCode==200){
            var data = JSON.parse(body);
            var tempr = (Number(data.main.temp) - 273.15).toFixed(2);
            var feelslike = (Number(data.main.feels_like)-273.15).toFixed(2);
            var sunrise = Number(data.sys.sunrise);
            var sunset = Number(data.sys.sunset);

            function Unix_timestamp(t){
                var dt = new Date(t*1000);
                var hr = dt.getHours();
                var AMorPM = (hr >= 12 ? ' pm':' am');
                hr = (hr % 12);
                var m = "0" + dt.getMinutes();
                var s = "0" + dt.getSeconds();
                return hr+ ':' + m.substr(-2) + ':' + s.substr(-2) + AMorPM;    
            }

            dict = {
                Description : data.weather[0].description,
                iconurl : data.weather[0].icon,
                tempr : tempr,
                feelslike: feelslike,
                name: data.name,
                sunrise: Unix_timestamp(sunrise),
                sunset: Unix_timestamp(sunset),
            }

            res.render("home",dict)
        }
    }
})
});

app.get("/city",function(req,res){
    var city = req.query.Search;
    //console.log(city)
    var url = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID=fe0c23724926411ceef2af1e41ccd932"

    request(url,function(error, response, body){
        if(error){
            console.log(error);
        }
        else{
            if(response.statusCode==200){
                var data = JSON.parse(body);
                var tempr = (Number(data.main.temp) - 273.15).toFixed(2);
                var feelslike = (Number(data.main.feels_like)-273.15).toFixed(2);
                var sunrise = Number(data.sys.sunrise);
                var sunset = Number(data.sys.sunset);
    
                function Unix_timestamp(t){
                    var dt = new Date(t*1000);
                    var hr = dt.getHours();
                    var AMorPM = (hr >= 12 ? ' pm':' am');
                    hr = (hr % 12);
                    if(hr==2){
                        hr=12;
                    }
                    var m = "0" + dt.getMinutes();
                    var s = "0" + dt.getSeconds();
                    console.log(hr,m,s)
                    return hr+ ':' + m.substr(-2) + ':' + s.substr(-2) + AMorPM;    
                }
    
                dict = {
                    Description : data.weather[0].description,
                    iconurl : data.weather[0].icon,
                    tempr : tempr,
                    feelslike: feelslike,
                    name: data.name,
                    sunrise: Unix_timestamp(sunrise),
                    sunset: Unix_timestamp(sunset),
                }
    
                res.render("city",dict)
            }
        }
    })

   
});

app.listen(3000,function(){
    console.log("Server started!!!")
})
