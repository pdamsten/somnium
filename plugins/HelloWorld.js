//**************************************************************************
//
//   Template for own plugins.
//
//**************************************************************************

const title = 'Hello World';
const help = 'Somnium plugin template.';

module.exports = {
  title,
  help,
  onClick
}

function onClick()
{
  alert('Hello World');
}
