# working
1. first run `ng generate application {name}` here `{name}` meand project name. for exmaple if we want to create a site for anns then {name} should be anns. If we run this command then it create new site inside projects folder. 
2. change the ShopKey inside src/environments/ folder both file . there `shopKey` key was there please update with newly created shop key

3. copy app folder ( Shop/src/app ) folder  to newly created project src/ folder and replace it. copy environments folder to newly created folder and replace it and also copy styles.scss to new folder and replace it;

4. change the design 
5. folder structure
  admin:  admin page no need to customize
  lib: libraries for the site this also no need to customize
  remaining folders are usind for custoimise site 
copy htaccess file in ui folder to hosted server with change path in htaccess and also rename htaccess to .htaccess  
6. change app.component.ts file `title` variable value; cart
7. check angular.json file with shop 
8. check api url is correct copy-file.php in file
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.6.

## build command for shop site `ng build Shop --prod  --baseHref=/shop/`
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
