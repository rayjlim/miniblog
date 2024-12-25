# Miniblog

[![PHP](https://github.com/rayjlim/miniblog/actions/workflows/php.yml/badge.svg)](https://github.com/rayjlim/miniblog/actions/workflows/php.yml)
[![Node.js](https://github.com/rayjlim/miniblog/actions/workflows/node.js.yml/badge.svg)](https://github.com/rayjlim/miniblog/actions/workflows/node.js.yml)

A headless CMS backend with a React App front end.
Meant to be a personal journal

## Goals…

(to write up)

## Measure of success…

(to write up)

## Setup

- Go into the `backend` directory
- `composer install`
- create `.env` and `.env.production` from `.env.example`
  - Be sure the xampp server is running
- Go into `frontend` directory
- create `.env` from `.env.example`
- `npm run start`

## Deployment to Production

- Go into the `scripts` directory
- Create `.env` (see `.env.example`)
- `./publish.sh`  

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

## Testing

### Backend

using Codeception, (to write up)

### Frontend

Using Enzyme for React, (to write up)
