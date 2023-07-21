import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'king-tide-front';

  constructor(private router: Router) { }
  redirectToHome() {
    this.router.navigate(['/home']); // Redirect to /home route
  }

}
