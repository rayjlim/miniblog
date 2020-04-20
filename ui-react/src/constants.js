
module.exports = {
    REST_ENDPOINT: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        'http://localhost/projects/miniblog3/index.php/' : 
        'https://www.lilplaytime.com/miniblog/index.php/'
        ,
        PROJECT_ROOT:  (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        'http://localhost/projects/miniblog3/' : 
        '/miniblog/'
}


