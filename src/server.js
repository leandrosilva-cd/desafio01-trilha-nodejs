const { response, request } = require('./');
const app = require('./');

app.listen(3333, (request, response) => {
    console.log('The server has started.');
});