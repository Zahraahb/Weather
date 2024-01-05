
var todayForecast= document.getElementById('today-forecast');
var nextForecast= document.getElementById('next-forecast');
var search= document.getElementById('search')

search.addEventListener('keyup',e=>{
    getApi(e.target.value)
})

async function getApi(searchCity){
    let url= await fetch(`https://api.weatherapi.com/v1/forecast.json?key=4c30e965e830470d87a170158240301&q=${searchCity}&days=3`);
   
    
    if(url.ok && url.status!=400){
        let res= await url.json();
        displayToday(res.location,res.current);
        displayNextDays(res.forecast.forecastday)

    }
    
}



const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function displayToday(location,current){
    let localtimeString=location.localtime;
    let localDateTime = new Date(localtimeString);
    let  dayOfWeek = localDateTime.getDay();
    let dayName = daysOfWeek[dayOfWeek];
    let  options = { day: 'numeric', month: 'long' };
    let formattedDate = localDateTime.toLocaleDateString('en-Uk', options);

    if(current){
    let box=`
    <div class="card city ">
                        <div class="card-title d-flex justify-content-around text-white upper ">
                            <span class="">${dayName}</span>
                            <span class="">${formattedDate}</span>
                        </div>
                        <div class="card-body d-flex flex-column justify-content-center align-items-center main">
                            
                            <h2>${location.name}</h2>
                            <img src="${current.condition.icon}" alt="">
                            <h1>${current.temp_c}°C</h1>
                           
                            <p class="mt-2">${current.condition.text}</p>
                           </div>

                           <div class="card-title d-flex justify-content-around text-white lower m-0 py-2">
                            <span><i class="bi-wind h4 me-1"></i>${current.wind_kph}Km/h</span>
                            <span><i class="bi-umbrella h4 me-1"></i>${current.precip_mm}mm</span>
                            <span><i class="bi-compass h4 me-1"></i>${current.wind_dir}</span>
                        </div>
        </div>
    `
    todayForecast.innerHTML=box;
    }
    
}

function displayNextDays(data){
  
    let box='';
    for(let i=1; i<data.length;i++){
        let dateString=data[i].date;
        let dateTime = new Date(dateString);
        let  dayOfWeek = dateTime.getDay();
        let dayName = daysOfWeek[dayOfWeek];
        let  options = { day: 'numeric', month: 'long' };
        let formattedDate = dateTime.toLocaleDateString('en-Uk', options);

        box+=`
        <div class="card city  w-100 p-0 ">
                        <div class="card-title d-flex justify-content-around text-white upper">
                                <span class="">${dayName}</span>
                                <span class="">${formattedDate}</span>
                            </div>
                            <div class="card-body d-flex flex-column justify-content-center align-items-center next p-0">
                                            
                                <img src="${data[i].day.condition.icon}" alt="">
                                <h1>${data[i].day.maxtemp_c}°C</h1>
                                <span>${data[i].day.mintemp_c}°C</span>
                                
                                <p class="mt-2">${data[i].day.condition.text}</p>
                               </div>
                               
                        </div>

        `
       

    }
    nextForecast.innerHTML=box


}




if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        // Success callback
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(latitude)
            console.log(longitude)

            // Call a function to get the city name using reverse geocoding
            getCityName(latitude, longitude);
        },
        // Error callback
        function (error) {
            console.error(`Error getting location: ${error.message}`);
        }
    );
} else {
    console.log('Geolocation is not supported in this browser.');
}

function getCityName(latitude, longitude) {
    // Replace 'YOUR_API_KEY' with your Google Maps API key
    const apiKey = 'AIzaSyDAnrYdTe33WNHVSHZyshofOHYr0Odc7B0';
    const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    fetch(geocodingApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK' && data.results.length > 0) {
                // Get the city name from the first result
                const cityName = extractCityName(data.results[0]);
                console.log(`City Name: ${cityName}`);
                getApi(cityName)
            }
            else {
                console.error('Error retrieving city name from geocoding API.');
            }
        })
        .catch(error => {
            console.error(`Error fetching geocoding API: ${error.message}`);
        });
}

function extractCityName(result) {
    // Extract the city name from the address components
    const addressComponents = result.address_components;
    
    
    const cityComponent = addressComponents.find((component) =>
        component.types.includes('administrative_area_level_1')
        
        
    );
    

    return cityComponent ? cityComponent.long_name.split(" ")[0] : 'City not found';
}





  

