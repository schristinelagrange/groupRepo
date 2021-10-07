let lat = '';
let lon = '';
let url = '';
let weather;
//pulls data from local storage and converts it back to an object
let pulledData = JSON.parse(localStorage.getItem("data"));
//checks to see if pulledSearches is null, if not sets it to pulledSearches, if its null sets it to a object with an array.
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
  //console.log(event)
  //console.log(this)
})
$("#closeDialog").click(function()
{
  $("#calenderDialog").css({'visibility': 'hidden'})
  $(".calendar").css("width", "90%")
  $(".container").css({"justify-content": "center"})
})
$( document ).on('click','.calenderDays',(function(event)
{
  let dialogHeaderContent = $("#dialogHeaderContent").text()
  newEvent = []
  //console.log(event)
  $("#eventData").html('')
  $("#calenderDialog").css({'visibility': 'visible', 'margin-right':'3%'})
  $(".calendar").css("width", "60%")
  $(".container").css({"justify-content": "normal", "padding-left":"5%"})
  $("#dialogHeaderContent").text(event.target.id);
  console.log(moment(event.target.id, "MM/DD/YYYY").format('X'))
  getWeather()
  .then(renderWeather)
  .catch(function(error){
    console.log(error)
  })
  $("#eventData").html(data[dialogHeaderContent])
}))
$("#infoForm").submit(function(event)
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
//`https://api.openweathermap.org/data/2.5/onecall?lat=34.5308634&lon=-82.6504161&exclude=hourly,minutely&units=imperial&appid=9abc24e2bd82a06cffa0711c49b6f93b`