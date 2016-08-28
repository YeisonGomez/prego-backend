var cheerio = require('cheerio');

module.exports.listGroup = function(html, callback) {
    console.log("Parseando lista de estudiantes...");
    $ = cheerio.load(html);
    console.log(html);
    
}