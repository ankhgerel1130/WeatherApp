async function getWeather() {
    const city = document.getElementById('city').value;
    const apiKey = 'ab853dcecca4b673e158af22aa48528b';  
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);  
        if (data.cod === 200) {

            const timezoneOffset = data.timezone / 3600; 
            const localTime = new Date(new Date().getTime() + (timezoneOffset * 3600 * 1000));

            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formattedDate = localTime.toLocaleDateString('en-US', options);


            const iconCode = data.weather[0].icon;
            const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

            document.getElementById('date-time').innerHTML = `<strong>Date & Time: </strong> ${formattedDate}`;
            document.getElementById('city-name').innerHTML = `<strong>City: </strong> ${data.name}`;
           
            document.getElementById('temperature').innerHTML = `<strong>Temperature: </strong> ${data.main.temp} °C`;
            document.getElementById('weather-description').innerHTML = `
                <strong>Weather: </strong> ${data.weather[0].description}
                <img src="${iconUrl}" alt="Weather Icon" style="vertical-align: middle; margin-left: 10px;">
            `;
        } else {
            document.getElementById('weather-info').innerHTML = 'City not found!';
        }
    } catch (error) {
        document.getElementById('weather-info').innerHTML = 'Error fetching data!';
        console.error('Error:', error);
    }
}
