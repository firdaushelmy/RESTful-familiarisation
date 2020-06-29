const express = require('express');
const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'));

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`server is running on ${port}`)
});