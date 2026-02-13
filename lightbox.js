/*!
 * lightbox2 v2.11.2
 * by Lokesh Dhakar
 *
 * More info:
 * http://lokeshdhakar.com/projects/lightbox2/
 *
 * Copyright Lokesh Dhakar
 * Released under the MIT license
 * https://github.com/lokesh/lightbox2/blob/master/LICENSE
 *
 * @preserve
 */

// Uses Node, AMD or browser globals to create a module.
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.lightbox2 = factory(root.jQuery);
    }
}(this, function ($) {

  function lightbox2(options) {
    this.album = [];
    this.currentImageIndex = void 0;
    this.init();

    // options
    this.options = $.extend({}, this.constructor.defaults);
    this.option(options);
  }

  // Descriptions of all options available on the demo site:
  // http://lokeshdhakar.com/projects/lightbox2/index.html#options
  lightbox2.defaults = {
    albumLabel: 'Image %1 of %2',
    alwaysShowNavOnTouchDevices: false,
    fadeDuration: 600,
    fitImagesInViewport: true,
    imageFadeDuration: 600,
    // maxWidth: 800,
    // maxHeight: 600,
    positionFromTop: 50,
    resizeDuration: 700,
    showImageNumberLabel: true,
    wrapAround: false,
    disableScrolling: false,
    /*
    Sanitize Title
    If the caption data is trusted, for example you are hardcoding it in, then leave this to false.
    This will free you to add html tags, such as links, in the caption.

    If the caption data is user submitted or from some other untrusted source, then set this to true
    to prevent xss and other injection attacks.
     */
    sanitizeTitle: false
  };

  lightbox2.prototype.option = function(options) {
    $.extend(this.options, options);
  };

  lightbox2.prototype.imageCountLabel = function(currentImageNum, totalImages) {
    return this.options.albumLabel.replace(/%1/g, currentImageNum).replace(/%2/g, totalImages);
  };

  lightbox2.prototype.init = function() {
    var self = this;
    // Both enable and build methods require the body tag to be in the DOM.
    $(document).ready(function() {
      self.enable();
      self.build();
    });
  };

  // Loop through anchors and areamaps looking for either data-lightbox2 attributes or rel attributes
  // that contain 'lightbox2'. When these are clicked, start lightbox2.
  lightbox2.prototype.enable = function() {
    var self = this;
    $('body').on('click', 'a[rel^=lightbox2], area[rel^=lightbox2], a[data-lightbox2], area[data-lightbox2]', function(event) {
      self.start($(event.currentTarget));
      return false;
    });
  };
 

  // Build html for the lightbox2 and the overlay.
  // Attach event handlers to the new DOM elements. click click click
  lightbox2.prototype.build = function() {
    if ($('#lightbox2').length > 0) {
        return;
    }

    var self = this;

    // The two root notes generated, #lightbox2Overlay and #lightbox2 are given
    // tabindex attrs so they are focusable. We attach our keyboard event
    // listeners to these two elements, and not the document. Clicking anywhere
    // while lightbox2 is opened will keep the focus on or inside one of these
    // two elements.
    //
    // We do this so we can prevent propogation of the Esc keypress when
    // lightbox2 is open. This prevents it from intefering with other components
    // on the page below.
    //
    // Github issue: https://github.com/lokesh/lightbox2/issues/663
    $('<div id="lightbox2Overlay" tabindex="-1" class="lightbox2Overlay"></div><div id="lightbox2" tabindex="-1" class="lightbox2"><div class="lbl-outerContainer"><div class="lbl-container"><div class="lbl-closeContainer"><a class="lbl-close"></a></div><img class="lbl-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" alt=""/><div class="lbl-nav"><a class="lbl-prev" aria-label="Previous image" href="" ></a><a class="lbl-next" aria-label="Next image" href="" ></a></div><div class="lbl-loader"><a class="lbl-cancel"></a></div></div></div><div class="lbl-dataContainer"><div class="lbl-data"><div class="lbl-details"><span class="lbl-caption"></span><span class="lbl-number"></span></div></div></div></div>').appendTo($('body'));

    // Cache jQuery objects
    this.$lightbox2       = $('#lightbox2');
    this.$overlay        = $('#lightbox2Overlay');
    this.$outerContainer = this.$lightbox2.find('.lbl-outerContainer');
    this.$container      = this.$lightbox2.find('.lbl-container');
    this.$image          = this.$lightbox2.find('.lbl-image');
    this.$nav            = this.$lightbox2.find('.lbl-nav');

    // Store css values for future lookup
    this.containerPadding = {
      top: parseInt(this.$container.css('padding-top'), 10),
      right: parseInt(this.$container.css('padding-right'), 10),
      bottom: parseInt(this.$container.css('padding-bottom'), 10),
      left: parseInt(this.$container.css('padding-left'), 10)
    };

    this.imageBorderWidth = {
      top: parseInt(this.$image.css('border-top-width'), 10),
      right: parseInt(this.$image.css('border-right-width'), 10),
      bottom: parseInt(this.$image.css('border-bottom-width'), 10),
      left: parseInt(this.$image.css('border-left-width'), 10)
    };

    // Attach event handlers to the newly minted DOM elements
    this.$overlay.hide().on('click', function() {
      self.end();
      return false;
    });

    this.$lightbox2.hide().on('click', function(event) {
      if ($(event.target).attr('id') === 'lightbox2') {
        self.end();
      }
    });

    this.$outerContainer.on('click', function(event) {
      if ($(event.target).attr('id') === 'lightbox2') {
        self.end();
      }
      return false;
    });

    this.$lightbox2.find('.lbl-prev').on('click', function() {
      if (self.currentImageIndex === 0) {
        self.changeImage(self.album.length - 1);
      } else {
        self.changeImage(self.currentImageIndex - 1);
      }
      return false;
    });

    this.$lightbox2.find('.lbl-next').on('click', function() {
      if (self.currentImageIndex === self.album.length - 1) {
        self.changeImage(0);
      } else {
        self.changeImage(self.currentImageIndex + 1);
      }
      return false;
    });

    /*
      Show context menu for image on right-click

      There is a div containing the navigation that spans the entire image and lives above of it. If
      you right-click, you are right clicking this div and not the image. This prevents users from
      saving the image or using other context menu actions with the image.

      To fix this, when we detect the right mouse button is pressed down, but not yet clicked, we
      set pointer-events to none on the nav div. This is so that the upcoming right-click event on
      the next mouseup will bubble down to the image. Once the right-click/contextmenu event occurs
      we set the pointer events back to auto for the nav div so it can capture hover and left-click
      events as usual.
     */
    this.$nav.on('mousedown', function(event) {
      if (event.which === 3) {
        self.$nav.css('pointer-events', 'none');

        self.$lightbox2.one('contextmenu', function() {
          setTimeout(function() {
              this.$nav.css('pointer-events', 'auto');
          }.bind(self), 0);
        });
      }
    });


    this.$lightbox2.find('.lbl-loader, .lbl-close').on('click', function() {
      self.end();
      return false;
    });
  };

  // Show overlay and lightbox2. If the image is part of a set, add siblings to album array.
  lightbox2.prototype.start = function($link) {
    var self    = this;
    var $window = $(window);

    $window.on('resize', $.proxy(this.sizeOverlay, this));

    this.sizeOverlay();

    this.album = [];
    var imageNumber = 0;

    function addToAlbum($link) {
      self.album.push({
        alt: $link.attr('data-alt'),
        link: $link.attr('href'),
        title: $link.attr('data-title') || $link.attr('title')
      });
    }

    // Support both data-lightbox2 attribute and rel attribute implementations
    var datalightbox2Value = $link.attr('data-lightbox2');
    var $links;

    if (datalightbox2Value) {
      $links = $($link.prop('tagName') + '[data-lightbox2="' + datalightbox2Value + '"]');
      for (var i = 0; i < $links.length; i = ++i) {
        addToAlbum($($links[i]));
        if ($links[i] === $link[0]) {
          imageNumber = i;
        }
      }
    } else {
      if ($link.attr('rel') === 'lightbox2') {
        // If image is not part of a set
        addToAlbum($link);
      } else {
        // If image is part of a set
        $links = $($link.prop('tagName') + '[rel="' + $link.attr('rel') + '"]');
        for (var j = 0; j < $links.length; j = ++j) {
          addToAlbum($($links[j]));
          if ($links[j] === $link[0]) {
            imageNumber = j;
          }
        }
      }
    }

    // Position lightbox2
    var top  = $window.scrollTop() + this.options.positionFromTop;
    var left = $window.scrollLeft();
    this.$lightbox2.css({
      top: top + 'px',
      left: left + 'px'
    }).fadeIn(this.options.fadeDuration);

    // Disable scrolling of the page while open
    if (this.options.disableScrolling) {
      $('body').addClass('lbl-disable-scrolling');
    }

    this.changeImage(imageNumber);
  };

  // Hide most UI elements in preparation for the animated resizing of the lightbox2.
  lightbox2.prototype.changeImage = function(imageNumber) {
    var self = this;
    var filename = this.album[imageNumber].link;
    var filetype = filename.split('.').slice(-1)[0];
    var $image = this.$lightbox2.find('.lbl-image');

    // Disable keyboard nav during transitions
    this.disableKeyboardNav();

    // Show loading state
    this.$overlay.fadeIn(this.options.fadeDuration);
    $('.lbl-loader').fadeIn('slow');
    this.$lightbox2.find('.lbl-image, .lbl-nav, .lbl-prev, .lbl-next, .lbl-dataContainer, .lbl-numbers, .lbl-caption').hide();
    this.$outerContainer.addClass('animating');

    // When image to show is preloaded, we send the width and height to sizeContainer()
    var preloader = new Image();
    preloader.onload = function() {
      var $preloader;
      var imageHeight;
      var imageWidth;
      var maxImageHeight;
      var maxImageWidth;
      var windowHeight;
      var windowWidth;

      $image.attr({
        'alt': self.album[imageNumber].alt,
        'src': filename
      });

      $preloader = $(preloader);

      $image.width(preloader.width);
      $image.height(preloader.height);
      windowWidth = $(window).width();
      windowHeight = $(window).height();

      // Calculate the max image dimensions for the current viewport.
      // Take into account the border around the image and an additional 10px gutter on each side.
      maxImageWidth  = windowWidth - self.containerPadding.left - self.containerPadding.right - self.imageBorderWidth.left - self.imageBorderWidth.right - 20;
      maxImageHeight = windowHeight - self.containerPadding.top - self.containerPadding.bottom - self.imageBorderWidth.top - self.imageBorderWidth.bottom - self.options.positionFromTop - 70;

      /*
      Since many SVGs have small intrinsic dimensions, but they support scaling
      up without quality loss because of their vector format, max out their
      size.
      */
      if (filetype === 'svg') {
        $image.width(maxImageWidth);
        $image.height(maxImageHeight);
      }

      // Fit image inside the viewport.
      if (self.options.fitImagesInViewport) {

        // Check if image size is larger then maxWidth|maxHeight in settings
        if (self.options.maxWidth && self.options.maxWidth < maxImageWidth) {
          maxImageWidth = self.options.maxWidth;
        }
        if (self.options.maxHeight && self.options.maxHeight < maxImageHeight) {
          maxImageHeight = self.options.maxHeight;
        }

      } else {
        maxImageWidth = self.options.maxWidth || preloader.width || maxImageWidth;
        maxImageHeight = self.options.maxHeight || preloader.height || maxImageHeight;
      }

      // Is the current image's width or height is greater than the maxImageWidth or maxImageHeight
      // option than we need to size down while maintaining the aspect ratio.
      if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
        if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
          imageWidth  = maxImageWidth;
          imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
          $image.width(imageWidth);
          $image.height(imageHeight);
        } else {
          imageHeight = maxImageHeight;
          imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
          $image.width(imageWidth);
          $image.height(imageHeight);
        }
      }
      self.sizeContainer($image.width(), $image.height());
    };

    // Preload image before showing
    preloader.src = this.album[imageNumber].link;
    this.currentImageIndex = imageNumber;
  };

  // Stretch overlay to fit the viewport
  lightbox2.prototype.sizeOverlay = function() {
    var self = this;
    /*
    We use a setTimeout 0 to pause JS execution and let the rendering catch-up.
    Why do this? If the `disableScrolling` option is set to true, a class is added to the body
    tag that disables scrolling and hides the scrollbar. We want to make sure the scrollbar is
    hidden before we measure the document width, as the presence of the scrollbar will affect the
    number.
    */
    setTimeout(function() {
      self.$overlay
        .width($(document).width())
        .height($(document).height());

    }, 0);
  };

  // Animate the size of the lightbox2 to fit the image we are showing
  // This method also shows the the image.
  lightbox2.prototype.sizeContainer = function(imageWidth, imageHeight) {
    var self = this;

    var oldWidth  = this.$outerContainer.outerWidth();
    var oldHeight = this.$outerContainer.outerHeight();
    var newWidth  = imageWidth + this.containerPadding.left + this.containerPadding.right + this.imageBorderWidth.left + this.imageBorderWidth.right;
    var newHeight = imageHeight + this.containerPadding.top + this.containerPadding.bottom + this.imageBorderWidth.top + this.imageBorderWidth.bottom;

    function postResize() {
      self.$lightbox2.find('.lbl-dataContainer').width(newWidth);
      self.$lightbox2.find('.lbl-prevLink').height(newHeight);
      self.$lightbox2.find('.lbl-nextLink').height(newHeight);

      // Set focus on one of the two root nodes so keyboard events are captured.
      self.$overlay.focus();

      self.showImage();
    }

    if (oldWidth !== newWidth || oldHeight !== newHeight) {
      this.$outerContainer.animate({
        width: newWidth,
        height: newHeight
      }, this.options.resizeDuration, 'swing', function() {
        postResize();
      });
    } else {
      postResize();
    }
  };

  // Display the image and its details and begin preload neighboring images.
  lightbox2.prototype.showImage = function() {
    this.$lightbox2.find('.lbl-loader').stop(true).hide();
    this.$lightbox2.find('.lbl-image').fadeIn(this.options.imageFadeDuration);

    this.updateNav();
    this.updateDetails();
    this.preloadNeighboringImages();
    this.enableKeyboardNav();
  };

  // Display previous and next navigation if appropriate.
  lightbox2.prototype.updateNav = function() {
    // Check to see if the browser supports touch events. If so, we take the conservative approach
    // and assume that mouse hover events are not supported and always show prev/next navigation
    // arrows in image sets.
    var alwaysShowNav = false;
    try {
      document.createEvent('TouchEvent');
      alwaysShowNav = (this.options.alwaysShowNavOnTouchDevices) ? true : false;
    } catch (e) {}

    this.$lightbox2.find('.lbl-nav').show();

    if (this.album.length > 1) {
      if (this.options.wrapAround) {
        if (alwaysShowNav) {
          this.$lightbox2.find('.lbl-prev, .lbl-next').css('opacity', '1');
        }
        this.$lightbox2.find('.lbl-prev, .lbl-next').show();
      } else {
        if (this.currentImageIndex > 0) {
          this.$lightbox2.find('.lbl-prev').show();
          if (alwaysShowNav) {
            this.$lightbox2.find('.lbl-prev').css('opacity', '1');
          }
        }
        if (this.currentImageIndex < this.album.length - 1) {
          this.$lightbox2.find('.lbl-next').show();
          if (alwaysShowNav) {
            this.$lightbox2.find('.lbl-next').css('opacity', '1');
          }
        }
      }
    }
  };

  // Display caption, image number, and closing button.
  lightbox2.prototype.updateDetails = function() {
    var self = this;

    // Enable anchor clicks in the injected caption html.
    // Thanks Nate Wright for the fix. @https://github.com/NateWr
    if (typeof this.album[this.currentImageIndex].title !== 'undefined' &&
      this.album[this.currentImageIndex].title !== '') {
      var $caption = this.$lightbox2.find('.lbl-caption');
      if (this.options.sanitizeTitle) {
        $caption.text(this.album[this.currentImageIndex].title);
      } else {
        $caption.html(this.album[this.currentImageIndex].title);
      }
      $caption.fadeIn('fast');
    }

    if (this.album.length > 1 && this.options.showImageNumberLabel) {
      var labelText = this.imageCountLabel(this.currentImageIndex + 1, this.album.length);
      this.$lightbox2.find('.lbl-number').text(labelText).fadeIn('fast');
    } else {
      this.$lightbox2.find('.lbl-number').hide();
    }

    this.$outerContainer.removeClass('animating');

    this.$lightbox2.find('.lbl-dataContainer').fadeIn(this.options.resizeDuration, function() {
      return self.sizeOverlay();
    });
  };

  // Preload previous and next images in set.
  lightbox2.prototype.preloadNeighboringImages = function() {
    if (this.album.length > this.currentImageIndex + 1) {
      var preloadNext = new Image();
      preloadNext.src = this.album[this.currentImageIndex + 1].link;
    }
    if (this.currentImageIndex > 0) {
      var preloadPrev = new Image();
      preloadPrev.src = this.album[this.currentImageIndex - 1].link;
    }
  };

  lightbox2.prototype.enableKeyboardNav = function() {
    this.$lightbox2.on('keyup.keyboard', $.proxy(this.keyboardAction, this));
    this.$overlay.on('keyup.keyboard', $.proxy(this.keyboardAction, this));
  };

  lightbox2.prototype.disableKeyboardNav = function() {
    this.$lightbox2.off('.keyboard');
    this.$overlay.off('.keyboard');
  };

  lightbox2.prototype.keyboardAction = function(event) {
    var KEYCODE_ESC        = 27;
    var KEYCODE_LEFTARROW  = 37;
    var KEYCODE_RIGHTARROW = 39;

    var keycode = event.keyCode;
    if (keycode === KEYCODE_ESC) {
      // Prevent bubbling so as to not affect other components on the page.
      event.stopPropagation();
      this.end();
    } else if (keycode === KEYCODE_LEFTARROW) {
      if (this.currentImageIndex !== 0) {
        this.changeImage(this.currentImageIndex - 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeImage(this.album.length - 1);
      }
    } else if (keycode === KEYCODE_RIGHTARROW) {
      if (this.currentImageIndex !== this.album.length - 1) {
        this.changeImage(this.currentImageIndex + 1);
      } else if (this.options.wrapAround && this.album.length > 1) {
        this.changeImage(0);
      }
    }
  };

  // Closing time. :-(
  lightbox2.prototype.end = function() {
    this.disableKeyboardNav();
    $(window).off('resize', this.sizeOverlay);
    this.$lightbox2.fadeOut(this.options.fadeDuration);
    this.$overlay.fadeOut(this.options.fadeDuration);

    if (this.options.disableScrolling) {
      $('body').removeClass('lbl-disable-scrolling');
    }
  };

  return new lightbox2();
}));
