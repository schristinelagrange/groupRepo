let lat = '';
let lon = '';
let url = '';
let weather;
let pulledData = JSON.parse(localStorage.getItem("data"));
let data = (pulledData !== null) ? pulledData : {};
let newEvent = [];

function getWeather()
{
  if(typeof weather === 'object')
  {
    return Promise.resolve(weather)
  }
    return getUrl()
    
    .then(function(url)
    {
      return fetch(url)
      .then(function(responce)
      {
          return responce.json();
      })
      .then(function(responce)
      {
          weather = responce;
      })
    });
    
}
function getUrl()
{
  return new Promise(function(resolve, reject)
  {
    
    window.navigator.geolocation.getCurrentPosition(function(position)
    {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      resolve(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=9abc24e2bd82a06cffa0711c49b6f93b`)
      return url
    },reject)
  })
}
function renderWeather(event)
{
  for(let i = 0; i < 7; i++)
  {
    let tempDate = moment(weather.daily[i].dt, "X").format("MM/D/YYYY");
    let dialogHeaderContent = $("#dialogHeaderContent").text()
    let weatherInfo = $("#weatherInfo")
    if(tempDate == dialogHeaderContent)
    {
      weatherInfo.html(`<p><h7>Weather For Your Current Location</h7></p><p>High:${weather.daily[i].temp.max}</p><p>Wind:${weather.daily[i].wind_speed}</p><p>Humidity:${weather.daily[i].humidity}</p><p><img src=http://openweathermap.org/img/w/${weather.daily[i].weather[0].icon}.png></p>`)
    }
  }
}
function renderEvents()
{
  let dialogHeaderContent = $("#dialogHeaderContent").text()
  let eventText = $("#eventText").val();
  newEvent.push(`<p>${eventText}</p>`)
  $("#eventText").val("")
  data[dialogHeaderContent] = newEvent;
  localStorage.setItem('data', JSON.stringify(data))
  $("#eventData").html(data[dialogHeaderContent])
  
}

function showDialog(event)
{
  $("#eventData").html('')
  $("#weatherInfo").html('')
  $("#calenderDialog").css({'visibility': 'visible', 'margin-right':'3%'})
  $(".calendar").css("width", "60%")
  $(".container").css({"justify-content": "normal", "padding-left":"5%"})
  $("#dialogHeaderContent").text(event.target.id);
}
const date = new Date();
console.log(date);
const renderCalendar = () => {
  date.setDate(1);
  const monthDays = document.querySelector(".days");
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();
  const firstDayIndex = date.getDay();
  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();
  const nextDays = 7 - lastDayIndex - 1;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  document.querySelector(".date h1").innerHTML = months[date.getMonth()];
  document.querySelector(".date p").innerHTML = new Date().toDateString();
  let days = "";
  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }
  for (let i = 1; i <= lastDay; i++) {
    let month = date.getMonth();
    let year = date.getFullYear();
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today calenderDays" id=${month+1}/${i}/${year}>${i}</div>`;
    } else {
      days += `<div id=${month+1}/${i}/${year} class="calenderDays">${i}</div>`;
    }
  }
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
    monthDays.innerHTML = days;
  }
};
document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});
document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});
renderCalendar();

$("#closeDialog").click(function()
{
  $("#calenderDialog").css({'visibility': 'hidden'})
  $(".calendar").css("width", "90%")
  $(".container").css({"justify-content": "center"})
})

$( document ).on('click','.calenderDays',(function(event)
{
  console.log(event)
  $("#calenderDialog").css({'visibility': 'visible', 'margin-right':'3%'})
  $(".calendar").css("width", "60%")
  $(".container").css({"justify-content": "normal", "padding-left":"5%"})
  $("#dialogHeaderContent").text(event.target.id);


//call stockAPI

var date = event.target.id;


if($('.stockAPIdiv') == null) {
  stockAPI(date);
} else {
  $('.stockAPIdiv').remove();
  stockAPI(date);
}

//call mystockAPI

  getSymbol();


}))

$("#closeDialog").click(function()
{
  $("#calenderDialog").css({'visibility': 'hidden'})
  $(".calendar").css("width", "90%")
  $(".container").css({"justify-content": "center"})
})

$( document ).on('click','.calenderDays',(function(event)
{
  newEvent = []
  showDialog(event)
  getWeather()
  .then(renderWeather)
  .catch(function(error){
    console.log(error)
  })
  let dialogHeaderContent = $("#dialogHeaderContent").text()
  $("#eventData").html(data[dialogHeaderContent])
}))

$("#saveEvent").click(function(event)
{
  console.log('subbmited')
  event.preventDefault()
  renderEvents()
})

$("#deleteData").click(function()
{
  let dialogHeaderContent = $("#dialogHeaderContent").text()
  delete data[dialogHeaderContent]
  $("#eventData").html('')
  newEvent = [];
  localStorage.setItem('data', JSON.stringify(data))
})


//stock API

var FMPapikey = '9f9b6e858376323424e765f45067c09e';
function stockAPI (date) {

  var stockURL = 'https://financialmodelingprep.com/api/v3/historical-price-full/%5EGSPC?apikey='+FMPapikey;
  

fetch(stockURL)
.then(function (response) {
  return response.json()
})
.then(function (data) {
  // console.log(data.historical)


for(let i=0; i<data.historical.length; i++) {
  var dateform = moment(data.historical[i].date).format('M/D/YYYY');

  if(date == dateform) {
    var spindexdiv = document.createElement('div');
    spindexdiv.classList = "stockAPIdiv";
    $('#dialogContent').append(spindexdiv);

    var sptitle = document.createElement('h3')
    sptitle.textContent = "S&P index"
    sptitle.setAttribute('style', 'color: white');
    spindexdiv.append(sptitle);

    var closeprice = document.createElement('p');
    closeprice.setAttribute('style', 'color: white')
    closeprice.textContent = 'Close Price : ' + data.historical[i].close;

    var pricechange = document.createElement('p');
    pricechange.textContent = data.historical[i].change + '('+ data.historical[i].changePercent + '%)';

    if(data.historical[i].changePercent>0) {
      pricechange.setAttribute('style', 'color:red')
      var up = document.createElement('span');
      up.innerHTML = '🔺';
      pricechange.append(up);
    } else if(data.historical[i].changePercent<0) {
      pricechange.setAttribute('style', 'color:blue')
      var down = document.createElement('span');
      down.innerHTML = '🔻';
      pricechange.append(down);
    }

    spindexdiv.append(closeprice)
    spindexdiv.append(pricechange);

  } 
}

})


}

// my stock submit (auto fill) -> get Symbol from the input


  $('.stocksavebtn').on('click', function saveStock() {
    localStorage.setItem('mystock', $('.stockinput').val());
    $('.stockinput').val('');
    getSymbol();

  })



function getSymbol () {
  var mystockname = localStorage.getItem('mystock');

    
  var symbolURL = 'https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=10000000000&volumeMoreThan=100000&exchange=NASDAQ,nyse,amex&apikey=' +FMPapikey; 
  var mystocksymbol;


  fetch(symbolURL)
.then(function (response) {
  return response.json()
})
.then(function (data) {

  //autofill
  var availablestocks = [];
  for(let i=0; i<data.length; i++) {
  availablestocks.push(data[i].companyName);
  }

  $('.stockinput').autocomplete({
    source: availablestocks
  });

  for(let i=0; i<data.length; i++){
      if(mystockname == data[i].companyName){
        mystocksymbol = data[i].symbol;
        if($('.mystockAPIdiv') == null) {
          mystockAPI(mystocksymbol, mystockname);
        } else {
          $('.mystockAPIdiv').remove();
          mystockAPI(mystocksymbol, mystockname);
        }

      }
  } 
})


}


//mystockAPI

function mystockAPI (symbol, mystockname) {

  

  var mystockURL = 'https://financialmodelingprep.com/api/v3/historical-price-full/' + symbol +'?apikey=' +FMPapikey;

fetch(mystockURL)
.then(function (response) {
  return response.json()
})
.then(function (data) {
  // console.log(data.historical)


  for(let i=0; i<data.historical.length; i++) {
    var dateform = moment(data.historical[i].date).format('M/D/YYYY');
    var date = $('#dialogHeaderContent').text();

    if(date == dateform) {
      var mystockdiv = document.createElement('div');
      mystockdiv.classList = "mystockAPIdiv";
      $('#dialogContent').append(mystockdiv);
  
      var mystockTitle = document.createElement('h3')
      mystockTitle.textContent = mystockname +"'s price"
      mystockTitle.setAttribute('style', 'color: white');

  
      var mystockCloseprice = document.createElement('p');
      mystockCloseprice.setAttribute('style', 'color: white')
      mystockCloseprice.textContent = 'Close Price : ' + data.historical[i].close;
  
      var pricechange = document.createElement('p');
      pricechange.textContent = data.historical[i].change + '('+ data.historical[i].changePercent + '%)';

      mystockdiv.append(mystockTitle);
      mystockdiv.append(mystockCloseprice)
      mystockdiv.append(pricechange);
  
      if(data.historical[i].changePercent>0) {
        pricechange.setAttribute('style', 'color:red')
        var up = document.createElement('span');
        up.innerHTML = '🔺';
        pricechange.append(up);
      } else if(data.historical[i].changePercent<0) {
        pricechange.setAttribute('style', 'color:blue')
        var down = document.createElement('span');
        down.innerHTML = '🔻';
        pricechange.append(down);
      }


    } 

}
})
}


