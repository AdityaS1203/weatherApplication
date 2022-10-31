const express=require("express");
const app=express();
const https=require("https");
const bodyParser=require("body-parser");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
    });


app.post("/",function(req,res){
  var c=req.body.city;
  const apiKey="62263460b345f14c7234e63b38b23e9b";
  const cityUrl="https://api.openweathermap.org/geo/1.0/direct?q="+c+"&appid="+apiKey;
  https.get(cityUrl,function(response){
    response.on("data",function(data){
      const weatherData=JSON.parse(data);
         var lat=weatherData[0].lat;
         var lon=weatherData[0].lon;
         const urlfortemp="https://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+lon+"&units=metric&appid="+apiKey;
         https.get(urlfortemp,function(responses){
         responses.on("data",function(data){
           const values=JSON.parse(data);
           var temperature=values.main.temp;
           const icon=values.weather[0].icon;
           const description=values.weather[0].description;
           const imgURL="http://openweathermap.org/img/wn/"+ icon +"@2x.png";
           res.write("<style>h1{text-align: center;margin:0 0 0 0;}h3{text-align: center;margin:12% 0 2% 0;}img{display:block;margin: 0 auto 0 auto;}</style>")
           res.write("<h3>Current weather is "+description+"</h3>");
           res.write("<h1>Temperature in "+c+" is "+temperature+" (in celcius)</h1>");
           res.write("<img src="+ imgURL + ">");
           res.send();
         });
         });
  });
  });
});

app.listen(process.env.PORT||3000,function(){
  console.log("server for weather app is running");
});
