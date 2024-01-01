import { Component } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../Services/weather.service';

@Component({
  selector: 'app-right-container',
  templateUrl: './right-container.component.html',
  styleUrls: ['./right-container.component.css']
})
export class RightContainerComponent {

  constructor(public weatherService: WeatherService){};

  //fa icons for thumbs up/down and smile/frown
  faThumbsUp:any = faThumbsUp;
  faThumbsDown:any = faThumbsDown;
  faFaceSmile:any = faFaceSmile;
  faFaceFrown:any = faFaceFrown;
  
  //Funtion to Control Tab Value/State
  onTodayClick()
  {
    this.weatherService.today=true;
    this.weatherService.week=false;
  }

  onWeekClick()
  {
    this.weatherService.today=false;
    this.weatherService.week=true;
  }

  //Function to Control Metric Value
  onCelsiusClick()
  {
    this.weatherService.celsius=true;
    this.weatherService.fahrenheit=false;
  }

  onFahrenheitClick()
  {
    this.weatherService.celsius=false;
    this.weatherService.fahrenheit=true;
  }

}