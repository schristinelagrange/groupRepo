let lat = '';
let lon = '';
let url = '';
let weather;
//pulls data from local storage and converts it back to an object
let pulledData = JSON.parse(localStorage.getItem("data"));
//checks to see if pulledSearches is null, if not sets it to pulledSearches, if its null sets it to a object with an array.
let data = (pulledData !== null) ? pulledData : {data:[]};





function getWeather(url)
{
  console.log(url  + "this is url");
  fetch(url)
    .then(function(responce)
    {
      return responce.json();
    })
    .then(function(data)
    {
      console.log(data);
      weather = data;
    })
}
$( document ).ready(function()
{
  window.navigator.geolocation.getCurrentPosition(function(position)
  {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&units=imperial&appid=9abc24e2bd82a06cffa0711c49b6f93b`;
    console.log(url);
    getWeather(url);
    console.log(weather + "this is weather")
  })

})

function renderWeather(event)
{
  for(let i = 0; i < 7; i++)
  {
    console.log(moment(event.target.id, "MM/DD/YYYY").format('X'))
  }
}




fetch('https://calendarific.com/api/v2/holidays?&api_key=1f4dc4481a87c2b13ef01f67da9c0f7b95dbdac8&country=US&year=2021&type=national')
.then(function(responce)
{
	return responce.json();
})
.then(function(responce)
{
	console.log(responce)
})


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

$('.days div').click(function(){
  console.log(event)
  console.log(this)
})

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
// var dialogInclude = $('#dialogContent')[0].children;

if($('.stockAPIdiv') == null) {
  stockAPI(date);
} else {
  $('.stockAPIdiv').remove();
  stockAPI(date);
}


if($('.mystockAPIdiv') == null) {
  getSymbol();
} else {
  $('.mystockAPIdiv').remove();
  getSymbol();
}

}))

$("#closeDialog").click(function()
{
  $("#calenderDialog").css({'visibility': 'hidden'})
  $(".calendar").css("width", "90%")
  $(".container").css({"justify-content": "center"})
})

//stock API


function stockAPI (date) {

  var stockURL = 'https://financialmodelingprep.com/api/v3/historical-price-full/%5EGSPC?apikey=9f9b6e858376323424e765f45067c09e';
  

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

    var pricechange = document.createElement('span');
    pricechange.textContent = data.historical[i].changePercent + '(%) change';

    if(data.historical[i].changePercent>0) {
      pricechange.setAttribute('style', 'background-color: red; color:white')
    } else if(data.historical[i].changePercent<0) {
      pricechange.setAttribute('style', 'background-color: blue; color:white')
    }


    spindexdiv.append(closeprice)
    spindexdiv.append(pricechange);

  } 
  // else {
  //   console.log('not bussiness day')
  // }
}
})
}

// my stock submit -> get Symbol from the input


  $('.stocksavebtn').on('click', function saveStock() {
    localStorage.setItem('mystock', $('.stockinput').val());
    getSymbol();

  })

  var mystockname = localStorage.getItem('mystock');

function getSymbol () {

    
  var symbolURL = 'https://financialmodelingprep.com/api/v3/stock/list?apikey=9f9b6e858376323424e765f45067c09e' 
  var mystocksymbol;

  console.log(mystockname);

  fetch(symbolURL)
.then(function (response) {
  return response.json()
})
.then(function (data) {
  for(let i=0; i<data.length; i++){
      if(mystockname == data[i].name){
        mystocksymbol = data[i].symbol;
        if(mystocksymbol !== null) {
          console.log(mystocksymbol);
          mystockAPI(mystocksymbol);

          break;
        }
      }
  } 
})


}


//mystockAPI

function mystockAPI (symbol) {

  var mystockURL = 'https://financialmodelingprep.com/api/v3/historical-price-full/' + symbol +'?apikey=9f9b6e858376323424e765f45067c09e';

fetch(mystockURL)
.then(function (response) {
  return response.json()
})
.then(function (data) {
  console.log(data.historical)


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
  
      var pricechange = document.createElement('span');
      pricechange.textContent = data.historical[i].changePercent + '(%) change';


      if(data.historical[i].changePercent>0) {
        pricechange.setAttribute('style', 'background-color: red; color:white')
      } else if(data.historical[i].changePercent<0) {
        pricechange.setAttribute('style', 'background-color: blue; color:white')
     }

     mystockdiv.append(mystockTitle);
    mystockdiv.append(mystockCloseprice)
    mystockdiv.append(pricechange);
  
    } 
  // else {
  //   console.log('not bussiness day')
  // }
}
})
}


//`https://api.openweathermap.org/data/2.5/onecall?lat=34.5308634&lon=-82.6504161&exclude=hourly,minutely&units=imperial&appid=9abc24e2bd82a06cffa0711c49b6f93b`


