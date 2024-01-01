import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../Models/LocationDetails';
import { WeatherDetails } from '../Models/WeatherDetails';
import { TemperatureData } from '../Models/TemperatureData';
import { TodayData } from '../Models/TodayData';
import { WeekData } from '../Models/WeekData';
import { TodaysHighlight } from '../Models/TodaysHighlight';
import { Observable } from 'rxjs';
import { EnvironmentalVariables } from '../Environment/EnvironmentVariables';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  //Variables which will be filled by API Endpoints
  locationDetails?: LocationDetails;
  weatherDetails?: WeatherDetails;

  //Variables that have the extracted data from the API Endpoit Variables
  temperatureData: TemperatureData; //Left Container

  todayData?: TodayData[] = [];              //Right Container - Day
  WeekData?: WeekData[] = [];                //Right Container - Week
  todaysHighlight?: TodaysHighlight;  //Right Container - Today's Highlights

  //Variables to be used for API Calls
  cityName:string = 'New Delhi';
  language:string = 'en-US';
  date:string = '20200622';
  units:string = 'm';

  //Variable holding current time
  currentTime:Date;

  //Variable to Control Tabs
  today:boolean = false;
  week:boolean = true;

  //Variable to Control Metric Values
  celsius:boolean = true;
  fahrenheit:boolean = false;

  constructor(private httpClient: HttpClient) 
  {  
    this.getData();
  }

  getSummaryImage(summary:string):string
  {
    //Base Folder Address Containing the Images
    var baseAddress = 'assets/';

    var CloudySunny = 'cloudy.png';
    var RainSunny = 'rainsun.png';
    var Windy = 'windy.png';
    var Rainy = 'storm.png';
    var Sunny = 'sun.png';
    var Snow = 'Snow.png';
    var WindySun = 'windysun.png';

    if(String(summary).includes("Partly Cloudy") || String(summary).includes("P Cloudy"))return baseAddress + CloudySunny;
    else if(String(summary).includes("Partly Rainy") || String(summary).includes("P Rainy"))return baseAddress + RainSunny;
    else if(String(summary).includes("Wind"))return baseAddress + Windy;
    else if(String(summary).includes("Rain"))return baseAddress + Rainy;
    else if(String(summary).includes("Sun"))return baseAddress + Sunny;
    else if(String(summary).includes("Snow"))return baseAddress + Snow;
    else if(String(summary).includes("Partly Windy") || String(summary).includes("P Windy"))return baseAddress + WindySun;

    return baseAddress + CloudySunny;
  }

  //Method to Create a Chunk for Left Container Using 'fillTemperatureDataModel()'
  fillTemperatureDataModel()
  {
    this.currentTime = new Date();
    this.temperatureData.day = this.weatherDetails['v3-wx-observations-current'].dayOfWeek;
    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2,'0')}:${String(this.currentTime.getMinutes()).padStart(2,'0')}`;
    this.temperatureData.temperature = this.weatherDetails['v3-wx-observations-current'].temperature;
    this.temperatureData.location = `${this.locationDetails.location.city[0]},${this.locationDetails.location.country[0]}`;
    this.temperatureData.rainPercent = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
    this.temperatureData.summaryPhrase = this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;
    this.temperatureData.summaryImage = this.getSummaryImage(this.temperatureData.summaryPhrase);
  }

  //Method to Create a Chunk for Right Container Using 'WeekDataModel()'
  fillWeakData()
  {
    var weekCount = 0;

    while(weekCount < 7)
    {
      this.WeekData.push(new WeekData());
      this.WeekData[weekCount].day = this.weatherDetails['v3-wx-forecast-daily-15day'].dayOfWeek[weekCount].slice(0,3);
      this.WeekData[weekCount].tempMax = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMax[weekCount];
      this.WeekData[weekCount].tempMin = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMin[weekCount];
      this.WeekData[weekCount].summaryImage = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-daily-15day'].narrative[weekCount]);

      weekCount++;
    }
  }

  //Method to Create a Chunk for Right Container Using 'TodayDataModel()'
  fillTodayData()
  {
    var TodayCount = 0;
    while(TodayCount < 7)
    {
      this.todayData.push(new TodayData());
      this.todayData[TodayCount].time = this.weatherDetails['v3-wx-forecast-hourly-10day'].validTimeLocal[TodayCount].slice(11,16);
      this.todayData[TodayCount].temperature = this.weatherDetails['v3-wx-forecast-hourly-10day'].temperature[TodayCount];
      this.todayData[TodayCount].summaryImage = this.getSummaryImage(this.weatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[TodayCount]);

      TodayCount++;
    }
  }

  getTimeFromString(localTime:string)
  {
    return localTime.slice(11,16);
  }
  //Method to Create a Chunk for Right Container Using 'TodayHighlightDataModel()'
  fillTodaysHighlight()
  {
    this.todaysHighlight.airQuality = this.weatherDetails['v3-wx-globalAirQuality'].globalairquality.airQualityIndex;
    this.todaysHighlight.humidity = this.weatherDetails['v3-wx-observations-current'].relativeHumidity;
    this.todaysHighlight.sunrise = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunriseTimeLocal);
    this.todaysHighlight.sunset = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunsetTimeLocal);
    this.todaysHighlight.uvindex = this.weatherDetails['v3-wx-observations-current'].uvIndex;
    this.todaysHighlight.visibility = this.weatherDetails['v3-wx-observations-current'].visibility;
    this.todaysHighlight.windStatus = this.weatherDetails['v3-wx-observations-current'].windSpeed;
  }

  //Method to create useful data chunks for UI using the data recieved from the API
  prepareData():void
  {
    //Setting Left Container Data Model Properties
    this.fillTemperatureDataModel();
    this.fillWeakData();
    this.fillTodayData();
    this.fillTodaysHighlight();
    console.log(this.temperatureData);
    console.log(this.WeekData);
    console.log(this.todayData);
    console.log(this.todaysHighlight);
  }

  CelsiustoFahrenheit(celsius:number):number
  {
    return + ((celsius * 1.8) + 32).toFixed(2);
  }

  FahrenheittoCelsius(fahrenheit:number):number
  {
    return + ((fahrenheit - 32) * 0.555).toFixed(2);
  }

  //Method to get Location Details from the API using the variable CityName
  getLocationDetails(cityName:string, language:string):Observable<LocationDetails>
  {
    return this.httpClient.get<LocationDetails>(EnvironmentalVariables.weatherApiLocationBaseURL,{
      headers: new HttpHeaders()
      .set(EnvironmentalVariables.xRapidApiKeyName,EnvironmentalVariables.xRapidApiKeyValue)
      .set(EnvironmentalVariables.xRapidApiHostName,EnvironmentalVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('query',cityName)
      .set('language',language)
    })
  }
  

  getWeatherReport(date:string, latitude:number, longitude:number, language:string, units:string):Observable<WeatherDetails>
  {
    return this.httpClient.get<WeatherDetails>(EnvironmentalVariables.weatherApiForecastBaseURL,{
      headers: new HttpHeaders()
      .set(EnvironmentalVariables.xRapidApiKeyName,EnvironmentalVariables.xRapidApiKeyValue)
      .set(EnvironmentalVariables.xRapidApiHostName,EnvironmentalVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('date',date)
      .set('latitude',latitude)
      .set('longitude',longitude)
      .set('language',language)
      .set('units',units)
    });
  }

  getData()
  {

    this.todayData = [];
    this.WeekData = [];
    this.temperatureData = new TemperatureData();
    this.todaysHighlight = new TodaysHighlight()

    var latitude = 0;
    var longitude = 0;

    this.getLocationDetails(this.cityName,this.language).subscribe({
      next: (response) => {
        this.locationDetails = response;
        latitude = this.locationDetails?.location.latitude[0];
        longitude = this.locationDetails?.location.longitude[0];

        //Once we get the value for Latitude and Longitude then we can call for the getWeatherReport Method
    this.getWeatherReport(this.date,latitude,longitude,this.language,this.units).subscribe({
      next: (response) => {
        this.weatherDetails = response;

        this.prepareData()
      }
    })
      
  }
    
});

    

  }

}
