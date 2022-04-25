//**************************************************************************
//
//   Template for own plugins.
//
//**************************************************************************

const app = require("photoshop").app;

const title = 'Hello World';
const help = 'Somnium plugin template.';

module.exports = {
  title,
  help,
  onClick
}

function onClick()
{
  app.showAlert('Hello World');
}
