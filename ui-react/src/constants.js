
module.exports = {
    REST_ENDPOINT: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 
        'http://localhost/projects/miniblog3/index.php/'
        : 'http://www.lilplaytime.com/epcal2/index.php/'
}


