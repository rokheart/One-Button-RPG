var http = require('http')
var favicon = require('serve-favicon')
var finalhandler = require('finalhandler')
var path = require('path')
var fs = require('fs')
const util = require('util')
var count = 0

var _favicon = favicon(path.join(__dirname, 'public', 'favicon.ico'))

var server = http.createServer(function onRequest (req, res) {
  var done = finalhandler(req, res)

  _favicon(req, res, function onNext (err) {
    if (err) return done(err)
    count++;
    
    console.log(count + ': ' + util.inspect(req, {depth: null}));
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Hello!\n');
    res.write(count + "");
    //res.write('<div style="width:150px;height:150px;line-height:3em;overflow:scroll;padding:5px;">');
    res.write('<div id="log" style="height:150px;overflow:scroll;padding:10px;">');
    res.write('<p>You dealt ' + (10 + count) + ' damage</p>');
    res.write('<p>You rolled a 20</p>');
    res.write('<p>CRIT - 9999 damage</p>');
    res.write('</div>');

    res.write('<form action="/">');
    res.write('    First name:<br>');
    res.write('    <input type="text" name="firstname" value="Mickey"><br>');
    res.write('    Last name:<br>');
    res.write('    <input type="text" name="lastname" value="Mouse"><br><br>');
    res.write('    <input type="submit" value="Submit">');
    res.write('</form>');

    res.end();
  })
}).listen(3030)
console.log('Server open, listening on port: ' + server.address().port);



//javascript:(function(){var objDiv=document.getElementById("log");objDiv.scrollTop=objDiv.scrollHeight;})();