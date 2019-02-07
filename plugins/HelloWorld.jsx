//**************************************************************************
//
//   Template for own plugins.
//
//**************************************************************************

HelloWorld = (function() {

return { // public:

title: 'Hello World',
help: 'Somnium plugin template.',

onClick: function()
{
  try {
    alert('Hello World');
  } catch (e) {
    log(e);
  }
}

};})();
