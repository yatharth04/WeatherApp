import { Component } from '@angular/core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-left-container',
  templateUrl: './left-container.component.html',
  styleUrls: ['./left-container.component.css']
})
export class LeftContainerComponent {

  //Variables for Nav Bar
  faMagnifyingGlass:any = faMagnifyingGlass;
  faLocation:any = faLocation;

  //Variables for Temperature Summary
  faCloud:any = faCloud;
  faCloudRain:any = faCloudRain;

  constructor(public weatherService:WeatherService){}

  onSearch(location:string)
  {
    this.weatherService.cityName = location;
    this.weatherService.getData();
  }
}