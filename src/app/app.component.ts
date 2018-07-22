import { Component } from '@angular/core'
import { version } from '../environments/version'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Snake'
  version = version
}
