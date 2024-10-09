import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponet } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { GlobalVariableService } from './global-variable.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: []
})

export class AppComponent implements OnInit {

  constructor(private data: GlobalVariableService) { }

  title = 'angular';

  ngOnInit(): void {
    this.data.fetchData()
  }

}
