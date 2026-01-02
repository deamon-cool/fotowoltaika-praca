## Description
Business application that collects ads from employers and makes them visible to employees. The browser-based application is designed for mobile use by potential employees and desktop use by employers with the admin panel to manage ads.

[Here you can view short video made when application was online](https://www.youtube.com/watch?v=QONAAVHTRkA)

## Key features
* Posting jobs
    - Employers post jobs with full description including position, salary, address, agreement type and so on.
    - Employers can view all added jobs because the application creates a session on the fly (no login or signup required)
    - App is secured by encrypted session, recaptcha, designed anti-ddos black IPs module, bandwidth reduction and other tools including Nginx and Linux packages and configurations.
* Search and view jobs
    - Potential employees can search and view jobs with many employers and in many locations across Poland. The application works for them as a PWA (mobile application) or in the browser. They can apply for particular offer by clicking on it, getting description and copying customized e-mail body to send it to employer in a private message.
* Admin panel
    - It allows to manage all adds from deleting, editing, creating to publishing.
    - It allows you to generate marketing posts on Facebook and create automated e-mail messages.

## Key technologies
* HTML
* CSS
* React.js + Redux
* Node.js + Express.js,
* Mongoose, MongoDb
* Nginx
* Git
* Linux server administration,
* Postman

## Key methodologies
* MVC
* REST
* mobile first

## Development and deployment info
* Development run
    - in main folder of the app
    `npm i`
    `npm start`
    - in `/express-server`
    `cd /express-server`
    `npm i`
    `npm start`
* Build app
    - in main folder of the app (creating react build)
    `npm build`
    - folders/files build, express-server, package.json are production folders/files
    - when running an app: Description is not loaded: **IMPORTANT** run script to convert descriptions `convertEditorContentJSONtoObj.js`

## License
Polyform Noncommercial License, non-commercial usage.
