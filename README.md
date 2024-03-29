# Miniblog

[![PHP](https://github.com/rayjlim/miniblog/actions/workflows/php.yml/badge.svg)](https://github.com/rayjlim/miniblog/actions/workflows/php.yml)
[![Node.js](https://github.com/rayjlim/miniblog/actions/workflows/node.js.yml/badge.svg)](https://github.com/rayjlim/miniblog/actions/workflows/node.js.yml)

A headless CMS backend with a React App front end.
Meant to be a personal journal

## Setup

- Go into the `backend` directory
- `composer install`
- create `.env` and `.env.production` from `.env.example`
  - Be sure the xampp server is running
- Go into `frontend` directory
- create `.env` from `.env.example`
- `npm run start`

## Deployment to Production

- `cd scripts`
- in `env_vars.sh`,  set up required vars (see `env_vars.sh.example`)
- `./publish.sh`  

## Testing

using Codeception (to write up)

### Using Enzyme for React

(to write up)

## DB Setup

What needs to be setup from the DB perspective for?

Input a SQL document or text

Output will be
    a DB Check file, to be called after DB values defined in deploy files
        will check if DB connection is available
        will check if database table is created
    a DB drop and populate file, to be called for reset of data
        will drop the table(s)
        will populate from sql values

## Shortcut Keys

Alt + o : Open OneDay [search]  
Alt + f : Open Search [one day]  
Alt + t : Go to Top [one day, search]  
Alt + b : Go to Bottom [one day, search]  
Alt + s : Save [Edit mode, Add mode]  
Escape  : Cancel [Edit mode, Add mode]  
Alt + , : Prev Day [one day]  
Alt + . : Next Day [one day]  
Alt + 1 : Add or Edit first entry [one day]  
Alt + [ ' Get new prompt [one day]  
Alt + p ' Populate Add form with Prompt [one day]

## Debugging

- when cors issue, check the auth token header variable case matches from frontend to backend
