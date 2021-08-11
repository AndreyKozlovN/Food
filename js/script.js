window.addEventListener('DOMContentLoaded', function () {
    const tabs = require('./modules/tabs'),
          modal = require('./modules/modal'),
          timer = require('./modules/timer'),
          cards = require('./modules/cards'),
          calc = require('./modules/calc'),
          forms = require('./modules/forms'),
          sliders = require('./modules/sliders');
    
          tabs();
          modal();
          timer();
          cards();
          calc();
          forms();
          sliders();
          
});