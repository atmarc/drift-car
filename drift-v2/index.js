const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use('/static', express.static(__dirname + '/static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['main.py']);

    pyProg.stdout.on('data', function(data) {
        console.log(data.toString());
        res.write(data);
        res.end('end');
    });

    // res.render(__dirname + '/static/index', { myScript: "var data = [1,2,3,4,5]" })
})

app.get('/*', (req, res) => {
    res.redirect('/')
})

// Set Port
app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), () => {
	console.log('Server started on port ' + app.get('port'))
})