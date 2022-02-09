# miniblog

A headless CMS backend (php) with a Create React App front end.

## Setup

- Go into `backend` directory
- `backend/composer install`
- create `backend/SERVER_CONFIG.php`
- Go into `frontend` directory
- `npm run start`

## Deployment to Production

- `cd scripts`
- in `env_vars.sh`,  set up required vars (see `env_vars.sh.example`)
- `sh publish.sh`  

## Testing

using Codeception (to write up)

### Using Enzyme for React

(to write up)

## Additional Details

[docs](./doc/index.md)

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
