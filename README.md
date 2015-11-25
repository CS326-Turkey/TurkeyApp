# TurkeyApp
## Overview
Team Turkey presents Glean, a change to charity program that will help you feel that little goodness, those warm fuzzies for putting your money to good use.

You make a purchase, Glean rounds up the cost, subtracts the actual purchase from the cost, and that difference goes to a charity of your choice!

Glean does this by integrating into your bank account and keeping track of the charges you make. It’s easy, safe, and secure.
## How To Run
```bash
node app.js
```
## Libraries

``express-handlebars``
  * https://github.com/ericf/express-handlebars.git
  * used as the template engine for the project

``body-parser``
  * https://github.com/expressjs/body-parser.git
  * used to retrieve the body of requests

``express-session``
  * https://github.com/expressjs/session.git
  * used for establishing sessions with clients of the site

``connect-flash``
  * https://github.com/jaredhanson/connect-flash.git
  * used to send messages to views (i.e. when a user is redirected to a new page)

``cookie-parser``
  * https://github.com/expressjs/cookie-parser.git
  * needed for the use of sessions using express-sessions

``morgan``
  * https://github.com/expressjs/morgan.git
  * used for logging HTTP requests

## Views

``home``

``login``

``forgotPassword``

``dashboard``

``profile``

``register``

``about``

``admin``

``adminhome``

``userhome``

``404``

``505``

``check_user_info``

``team``

*A summary of each of the views in your application and its purpose.*
## Statefulness
*Provide a detailed writeup of how your application uses sessions to maintain statefulness. You must make references to specific files in your project repository and links to the associated files. We will be reviewing your work through github and using the README.md file as an entry point.*

## Persistence

![database diagram](/gleanDB.png)

*Provide a detailed writeup of how your application uses a database. You must include a figure that shows the important data sets that your database maintains. You must make reference to specific files in your project repository and links to the associated files. We will be reviewing your work through github and using the README.md file as an entry point.*
