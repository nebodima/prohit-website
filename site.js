(function( $ ) {
	'use strict';	

	/**
	 * On Video Ended
	 *
	 * @since  2.0.0
	 */
	function onVideoEnded( event ) {	
		if ( event.data.message == 'ON_YENDIFVIDEOSHARE_ENDED' ) {
			var id = event.data.id;
			var loop = event.data.loop;
	
			if ( id ) {
				var $playlistItems = $( '.yendif-video-share-playlist-item', '#yendif-video-share-playlist-' + id );
				var activeIndex = $( '.yendif-video-share-playlist-item.active', '#yendif-video-share-playlist-' + id ).data( 'index' );
				
				var nextIndex = ++activeIndex;
				if ( $playlistItems.length == nextIndex ) {
					if ( loop ) {
						nextIndex = 0;
					} else {
						nextIndex = -1;
					}
				}

				if ( nextIndex > -1 ) {
					$( '.yendif-video-share-playlist-item', '#yendif-video-share-playlist-' + id ).eq( nextIndex ).trigger( 'click' );
				}
			}	
		}
	}

	/**
	 * Called when the page has loaded
	 *
	 * @since  2.0.0
	 */
	$(function() {
		// Magnific Popup 
		if ( $.fn.magnificPopup !== undefined ) {
			$( '.yendif-video-share-popup' ).each(function() {	
				var player_ratio = parseFloat( $( this ).data( 'player_ratio' ) );

				$( this ).magnificPopup({ 
					delegate: '.yendif-video-share-grid-item', // the selector for gallery item
					type: 'iframe',
					overflowY: 'auto',			
					removalDelay: 300,
					iframe: { // to create title, close, iframe, counter div's
					markup: '<div class="mfp-title-bar">' +
								'<div class="mfp-close" title="Close (Esc)"></div>' +
							'</div>' +							
							'<div class="mfp-iframe-scaler" style="padding-top:' + player_ratio + '%;" >' +            												
								'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +																								
							'</div>'																							        			
					},	
					gallery: { // to build gallery				
						enabled: true													
					}									
				});	
			});
		};

		// Playlist
		$( '.yendif-video-share-playlist-item' ).on( 'click', function( e ) {			
			var $container = $( this ).closest( '.yendif-video-share-playlist' );

			var src = $( this ).data( 'src' );
			$container.find( 'iframe' ).attr( 'src', src );

			$container.find( '.yendif-video-share-playlist-item' ).removeClass( 'active' );
			$( this ).addClass( 'active' );
		});

		window.addEventListener( 'message', onVideoEnded, false );

		// Ratings
		$( 'body' ).on( 'click', '.yendif-video-share-ratings-star a', function( e ) {
			e.preventDefault();
			
			var id = $( this ).data( 'id' ),
				rating = $( this ).data( 'value' );
		
			if ( yendif.allow_guest_rating == 0 && yendif.userid == 0 ) {
				alert( yendif.message_login_required );
				return false;
			};

			document.getElementById( 'yendif-video-share-ratings-widget' ).innerHTML = '<span class="yendif-video-share-spinner"></span>';
			var xmlhttp;

			if ( window.XMLHttpRequest ) {
				xmlhttp = new XMLHttpRequest();
			} else {
				xmlhttp = new ActiveXObject( 'Microsoft.XMLHTTP' );
			};

			xmlhttp.onreadystatechange = function() {
				if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
					if ( xmlhttp.responseText ) {		    
						document.getElementById( 'yendif-video-share-ratings-widget' ).innerHTML = xmlhttp.responseText;
					};
				};
			};	

			xmlhttp.open( 'GET', yendif.baseurl + 'index.php?option=com_yendifvideoshare&task=video.rating&format=raw&id=' + id + '&rating=' + rating, true );
			xmlhttp.send();
				
			return false;			
		});

		// Likes & Dislikes
		$( 'body' ).on( 'click', '.yendif-video-share-like-btn, .yendif-video-share-dislike-btn', function( e ) {
			e.preventDefault();
			
			var id = $( this ).data( 'id' ),
				like = $( this ).data( 'like' ),
				dislike = $( this ).data( 'dislike' );
		
			if ( yendif.allow_guest_like == 0 && yendif.userid == 0 ) {
				alert( yendif.message_login_required );
				return false;
			};

			document.getElementById( 'yendif-video-share-likes-dislikes-widget' ).innerHTML = '<span class="yendif-video-share-spinner"></span>';
			var xmlhttp;

			if ( window.XMLHttpRequest ) {
				xmlhttp = new XMLHttpRequest();
			} else {
				xmlhttp = new ActiveXObject( 'Microsoft.XMLHTTP' );
			};

			xmlhttp.onreadystatechange = function() {
				if ( xmlhttp.readyState == 4 && xmlhttp.status == 200 ) {
					if ( xmlhttp.responseText ) {	
						document.getElementById( 'yendif-video-share-likes-dislikes-widget' ).innerHTML = xmlhttp.responseText;
					};
				};
			};	

			xmlhttp.open( 'GET', yendif.baseurl + 'index.php?option=com_yendifvideoshare&view=video&task=video.vote&format=raw&id=' + id + '&like=' + like + '&dislike=' + dislike, true );
			xmlhttp.send();
				
			return false;			
		});		
	});

})( jQuery );