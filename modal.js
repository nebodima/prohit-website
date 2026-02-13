;(function () {
    'use strict';

    document.addEventListener( 'DOMContentLoaded', function() {
      var elements = document.querySelectorAll( '.yendif-video-share-select-link' );

      for ( var i = 0, l = elements.length; l > i; i += 1 ) {
        elements[ i ].addEventListener( 'click', function( event ) {
          event.preventDefault();

          var functionName = event.target.getAttribute( 'data-function' );

          window.parent[ functionName ](
            event.target.getAttribute( 'data-id' ),
            event.target.getAttribute( 'data-title' ),
            null,
            null,
            event.target.getAttribute( 'data-uri' ),
            event.target.getAttribute( 'data-language' ),
            null
          );

          if ( window.parent.Joomla.Modal ) {
            window.parent.Joomla.Modal.getCurrent().close();
          };
        });
      };
    });
  })();