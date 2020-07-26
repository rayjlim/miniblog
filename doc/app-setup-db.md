# App Setup Db

## Objective

What needs to be setup from the DB perspective for?

Input a SQL document or text

Output will be
    a DB Check file, to be called after DB values defined in deploy files
        will check if DB connection is available
        will check if database table is created
    a DB drop and populate file, to be called for reset of data
        will drop the table(s)
        will populate from sql values
