import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'; // Importing the platformBrowserDynamic function for bootstrapping
import { AppModule } from './app/app.module'; 
// Bootstrapping the module to launch the application
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch((err) => console.error(err)); 
