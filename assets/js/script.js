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
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    console.log(new Date().getMonth())
    if (
      i === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      days += `<div class="today">${i}</div>`;
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




$(".calenderDays").click(function(event)
{
  console.log(event)
  $("#calenderDialog").css({'visibility': 'visible', 'margin-right':'3%'})
  $(".calendar").css("width", "60%")
  $(".container").css({"justify-content": "normal", "padding-left":"5%"})
  $("#dialogHeaderContent").text(event.target.id);


//call stockAPI
var date = event.target.id
  stockAPI(date);
  console.log(date)
})

$("#closeDialog").click(function()
{
  $("#calenderDialog").css({'visibility': 'hidden'})
  $(".calendar").css("width", "90%")
  $(".container").css({"justify-content": "center"})
})

//stock API


function stockAPI (date) {

  var stockURL = 'https://financialmodelingprep.com/api/v3/historical-price-full/%5EGSPC?apikey=9f9b6e858376323424e765f45067c09e';
  var mystockURL = 'https://financialmodelingprep.com/api/v3/historical-price-full/AAPL?apikey=9f9b6e858376323424e765f45067c09e';


fetch(stockURL)
.then(function (response) {
  return response.json()
})
.then(function (data) {
  console.log(data.historical)


for(let i=0; i<data.historical.length; i++) {
  var dateform = moment(data.historical[i].date).format('M/D/YYYY');

  if(date == dateform) {
    var spindexdiv = document.createElement('div');
    $('#dialogContent').append(spindexdiv);

    var closeprice = document.createElement('p');
    closeprice.setAttribute('style', 'color: white')
    closeprice.textContent = 'S&P Close Price : ' + data.historical[i].close;

    spindexdiv.append(closeprice);
    console.log(data.historical[i].close);
  }
}
})
}