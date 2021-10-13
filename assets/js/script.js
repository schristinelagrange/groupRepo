let lat = '';
let lon = '';
let url = '';
let weather;
let pulledData = JSON.parse(localStorage.getItem("data"));
let data = (pulledData !== null) ? pulledData : {};
let newEvent = [];
let calendarYear;

//call calendar api
function getHolidays(event)
{
  fetch(`https://calendarific.com/api/v2/holidays?&api_key=0304ab491c16d7aae9858fa131471a6febc6e8c6&country=US&year=${calendarYear}&type=national`)
  .then(function(response)
  {
  	return response.json();
  })
  .then(function(response)
  {
    holidays = response

    for(let i = 0; i < holidays.response.holidays.length; i++)
    {
      let day = holidays.response.holidays[i].date.datetime.day;
      let month = holidays.response.holidays[i].date.datetime.month;
      let year = holidays.response.holidays[i].date.datetime.year;
      let date = month+"/"+day+"/"+year;
      if(date == event.target.id)
      {
        $("#holidayInfo").text(holidays.response.holidays[i].name)
      }
    }
  })
}

//get weather call
function getWeather()
{
  //if weather is already an object, the call has been done. so return weather as the promise
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
//gets the url based on your current location.
function getUrl()
{
  //creates a promise function and returns the url, we are able to use .then in the function call to then call getWeather knowing the url has been created.
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
//renders the weather to the dialog
function renderWeather(event)
{
  for(let i = 0; i < 7; i++)
  {
    let tempDate = moment(weather.daily[i].dt, "X").format("MM/D/YYYY");
    let dialogHeaderContent = $("#dialogHeaderContent").text()
    let weatherInfo = $("#weatherInfo")
    if(tempDate == dialogHeaderContent)
    {
      weatherInfo.html(`<p><h7>Weather For Your Current Location</h7></p><p>High:${weather.daily[i].temp.max}</p><p>Wind:${weather.daily[i].wind_speed}</p><p>Humidity:${weather.daily[i].humidity}</p><p><img src=https://openweathermap.org/img/w/${weather.daily[i].weather[0].icon}.png></p>`)
    }
  }
}
//renders the stored events to the dialog
function renderEvents()
{
  let dialogHeaderContent = $("#dialogHeaderContent").text()
  let eventText = $("#eventText").val();
  if(data[dialogHeaderContent])
  {
    newEvent = data[dialogHeaderContent];
  }
  newEvent.push(`<div class="eventDiv" ><p>${eventText}</p><input type="button" class="delEvent btn-small" value = "X"></div>`)
    $("#eventText").val("")
  data[dialogHeaderContent] = newEvent;
  localStorage.setItem('data', JSON.stringify(data))
  $("#eventData").html(data[dialogHeaderContent])
  
}
//delete idividual events
$( document ).on('click','.delEvent',function(event)
{
  let targetDivContent = event.target.previousSibling.outerText;
  let targetDate = $("#dialogHeaderContent").text();
  //find the index of the content we are deleting
  let dataIndex = data[targetDate].indexOf(`<div class="eventDiv" ><p>${targetDivContent}</p><input type="button" class="delEvent btn-small" value = "X"></div>`);
 //if the array is longer than 1, splice the array to remove the value wanting to be deleted
  if(data[targetDate].length > 1)
  {
    data[targetDate].splice(dataIndex,1)
  }
  else
  {
    //if the length is 1 just pop the last one off
    data[targetDate].pop()
  }
  localStorage.setItem('data', JSON.stringify(data))
  $("#eventData").html(data[targetDate])
})
//makes the dialog visable, and shrinks the calendar to fit it all on the screen, shows the date in the top of the dialog
function showDialog(event)
{
  $("#eventData").html('')
  $("#weatherInfo").html('')
  $("#calenderDialog").css({'visibility': 'visible', 'margin-right':'3%'})
  $(".calendar").css("width", "60%")
  $(".container").css({"justify-content": "normal"})
  $("#dialogHeaderContent").text(event.target.id);
}
const date = new Date();
//console.log(date);
//renders the calendar to the page
const renderCalendar = () => {
  date.setDate(1);
  console.log(date  + " date")
  const monthDays = document.querySelector(".days");
  console.log(monthDays  + " monthdays")
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  console.log(lastDay  + " lastDay")
  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();
  console.log(prevLastDay  + " prevlastday")
  const firstDayIndex = date.getDay();
  console.log(firstDayIndex  + " firstDayIndex")
  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();
  console.log(lastDayIndex  + " lastDayIndex")
  const nextDays = 7 - lastDayIndex - 1;
  console.log(nextDays  + " nextDays")
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
  //sets the month and the string date to the top of the calendar
  document.querySelector(".date h1").innerHTML = months[date.getMonth()];
  document.querySelector(".date p").innerHTML = new Date().toDateString();
  let days = "";
  //loops threw and creates the calender day divs
  for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
  }
  for (let i = 1; i <= lastDay; i++) {
    let month = date.getMonth();
    let year = date.getFullYear();
    calendarYear = year;
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today calenderDays" id=${month+1}/${i}/${year}>${i}</div>`;
    } else {
      days += `<div id=${month+1}/${i}/${year} class="calenderDays">${i}</div>`;
    }
  }
  if(nextDays === 0)
  {
    monthDays.innerHTML = days;
  }
  else
  {
    for (let j = 1; j <= nextDays; j++) {
      days += `<div class="next-date">${j}</div>`;
      monthDays.innerHTML = days;
    }
  }
};
//event listeners for prev and next month. adds 1 or subtracts 1 fromt the current month, then calls render calendar again
document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
});
document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});
renderCalendar();

//closes dialog and returns calendar to full screen
$("#closeDialog").click(function()
{
  $("#calenderDialog").css({'visibility': 'hidden'})
  $(".calendar").css("width", "100%")
  $(".container").css({"justify-content": "center"})
})
//opens daialog, calls get weather, and stock api
$( document ).on('click','.calenderDays',(function(event)
{
  $("#holidayInfo").text(" ")
  newEvent = []
  showDialog(event)
  getWeather()
  .then(renderWeather)
  .catch(function(error){
    console.log(error)
  })
  let dialogHeaderContent = $("#dialogHeaderContent").text()
  $("#eventData").html(data[dialogHeaderContent])
  getHolidays(event)
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

$("#saveEvent").click(function(event)
{
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
//spare key '4e011863df1e09d29721886272ffe3a4';
//spare key '9f9b6e858376323424e765f45067c09e';
var FMPapikey =    '9f9b6e858376323424e765f45067c09e';
// another spare key '65a7a307c49a31bc405d2356c9e065ea'


function stockAPI (date) {

  var stockURL = 'https://financialmodelingprep.com/api/v3/historical-price-full/%5EGSPC?apikey='+ FMPapikey;
  


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
    closeprice.textContent = 'Close Price : ' + data.historical[i].close.toFixed(2);

    var pricechange = document.createElement('p');
    pricechange.textContent = data.historical[i].change.toFixed(2) + '('+ data.historical[i].changePercent.toFixed(2) + '%)';

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



  var todaystockURL = 'https://financialmodelingprep.com/api/v3/quote-short/%5EGSPC?apikey=' +FMPapikey;
fetch(todaystockURL)
.then(function(response) {
  return response.json()
})
.then(function (data) {
  if($('.stockAPIdiv')[0] == null) {
  if(date == moment().format('M/D/YYYY')) {


    var todayIndexdiv = document.createElement('div');
    todayIndexdiv.classList = "stockAPIdiv";
    $('#dialogContent').append(todayIndexdiv);

    var sptitle = document.createElement('h3')
    sptitle.textContent = "S&P index"
    sptitle.setAttribute('style', 'color: white');
    todayIndexdiv.append(sptitle);

    var closeprice = document.createElement('p');
    closeprice.setAttribute('style', 'color: white')
    closeprice.textContent = 'Real-time Price : ' + data[0].price.toFixed(2);

    todayIndexdiv.append(closeprice)

  }}
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
      mystockCloseprice.textContent = 'Close Price : ' + data.historical[i].close.toFixed(2);
  
      var pricechange = document.createElement('p');
      pricechange.textContent = data.historical[i].change.toFixed(2) + '('+ data.historical[i].changePercent.toFixed(2) + '%)';

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

var todaystockURL = 'https://financialmodelingprep.com/api/v3/quote-short/'+symbol+'?apikey=' +FMPapikey;


fetch(todaystockURL)
.then(function(response) {
  return response.json()
})
.then(function (data) {
  if($('.mystockAPIdiv')[0] == null) {
  var date = $('#dialogHeaderContent').text();

  if(date == moment().format('M/D/YYYY')) {

    var todayMystockDiv = document.createElement('div');
    todayMystockDiv.classList = "mystockAPIdiv";
    $('#dialogContent').append(todayMystockDiv);

    var mystockTitle = document.createElement('h3')
    mystockTitle.textContent = mystockname +"'s price"
    mystockTitle.setAttribute('style', 'color: white');
    todayMystockDiv.append(mystockTitle);

    var mystockPrice = document.createElement('p');
    mystockPrice.setAttribute('style', 'color: white')
    mystockPrice.textContent = 'Real-time Price : ' + data[0].price.toFixed(2);

    todayMystockDiv.append(mystockPrice)

  }}
})

}
