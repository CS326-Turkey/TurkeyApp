# TurkeyApp

## Overview
Team Turkey presents Glean, a change to charity program that will help you feel that little goodness, those warm fuzzies for putting your money to good use.

You make a purchase, Glean rounds up the cost, subtracts the actual purchase from the cost, and that difference goes to a charity of your choice!

Glean does this by integrating into your bank account and keeping track of the charges you make. It’s easy, safe, and secure.

## How To Run

Aquire the credentials.js file for database authentication from an admin. Place this file in the main directory.

Run the following commands in bash:

```bash
npm install
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
  * Main landing page for users not logged into Glean. This page is meant mostly for promotional purposes to attract users to the service. Currently, there is a description of the service, and navigation for users to access an about page and a page to learn about the team.

``login``
  * Login screen for users seeking to sign-in to Glean. If users forget their password, a link to reset a user's password is accessible from the page.

``forgotPassword``
 * ForgotPassword view is used to help user to find their passwords. When user forget their passwords, they can go to forgot password page and enter their infomation, and then the server find the password. 

``dashboard``
 * Dashboard view shows some Statistics of the user. 
 
``profile``
  * Profile view shows the information of the user. User can also change their information. 
  
``register``
  * Sign up a new account. 
  
``about``
  * Information about Glean. 
  
``admin``
  * Shows information of all users and all transaction. Adminitrators can aslo search for some data. 
  
``adminhome``
  * Home page of Admin which is slightly different from the regular home page and user home page. 
  
``userhome``
  * Home page of the User which is slighty different from the regular home page and admin home page. 
  
``404``
  * It shows when page is not found.
  
``505``
  * It shows when there is an error.
  
``check_user_info``
  * It confirms the information of the user for finding password. 
  
``team``
  * Profiles of all team members. 
  
*A summary of each of the views in your application and its purpose.*
## Statefulness
*Provide a detailed writeup of how your application uses sessions to maintain statefulness. You must make references to specific files in your project repository and links to the associated files. We will be reviewing your work through github and using the README.md file as an entry point.*

## Persistence

![database diagram](/gleanDB.png)

*Provide a detailed writeup of how your application uses a database. You must include a figure that shows the important data sets that your database maintains. You must make reference to specific files in your project repository and links to the associated files. We will be reviewing your work through github and using the README.md file as an entry point.*
