(function( jQuery ){
  // Simple wrapper around jQuery animate to simplify animating progress from your app
  // Inputs: Progress as a percent, Callback
  // TODO: Add options and jQuery UI support.
  jQuery.fn.animateProgress = function(progress, callback) {    
    return this.each(function() {
      jQuery(this).animate({
        width: progress+'%'
      }, {
        duration: 2000, 
        
        // swing or linear
        easing: 'swing',

        // this gets called every step of the animation, and updates the label
        step: function( progress ){
          var labelEl = jQuery('.ui-label', this),
              valueEl = jQuery('.value', labelEl);
          
          if (Math.ceil(progress) < 20 && jQuery('.ui-label', this).is(":visible")) {
            labelEl.hide();
          }else{
            if (labelEl.is(":hidden")) {
              labelEl.fadeIn();
            };
          }
          
          if (Math.ceil(progress) == 100) {
            labelEl.text('Done');
            setTimeout(function() {
              labelEl.fadeOut();
            }, 1000);
          }else{
            valueEl.text(Math.ceil(progress) + '%');
          }
        },
        complete: function(scope, i, elem) {
          if (callback) {
            callback.call(this, i, elem );
          };
        }
      });
    });
  };
})( jQuery );

jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar .ui-progress .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar .ui-progress').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar .ui-progress').animateProgress(90, function() {
    jQuery(this).animateProgress(81, function() {
      setTimeout(function() {
        jQuery('#progress_bar .ui-progress').animateProgress(90, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar2 .ui-progress .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar2 .ui-progress').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar2 .ui-progress').animateProgress(72, function() {
    jQuery(this).animateProgress(63, function() {
      setTimeout(function() {
        jQuery('#progress_bar2 .ui-progress').animateProgress(72, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar3 .ui-progress .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar3 .ui-progress').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar3 .ui-progress').animateProgress(80, function() {
    jQuery(this).animateProgress(85, function() {
      setTimeout(function() {
        jQuery('#progress_bar3 .ui-progress').animateProgress(80, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar4 .ui-progress .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar4 .ui-progress').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar4 .ui-progress').animateProgress(94, function() {
    jQuery(this).animateProgress(90, function() {
      setTimeout(function() {
        jQuery('#progress_bar4 .ui-progress').animateProgress(94, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});

jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar5 .ui-progress .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar5 .ui-progress').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar5 .ui-progress').animateProgress(85, function() {
    jQuery(this).animateProgress(80, function() {
      setTimeout(function() {
        jQuery('#progress_bar5 .ui-progress').animateProgress(85, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


// gray bars
jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar_gray .ui-progress3 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar_gray .ui-progress3').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar_gray .ui-progress3').animateProgress(90, function() {
    jQuery(this).animateProgress(81, function() {
      setTimeout(function() {
        jQuery('#progress_bar_gray .ui-progress3').animateProgress(90, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar_gray2 .ui-progress3 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar_gray2 .ui-progress3').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar_gray2 .ui-progress3').animateProgress(72, function() {
    jQuery(this).animateProgress(63, function() {
      setTimeout(function() {
        jQuery('#progress_bar_gray2 .ui-progress3').animateProgress(72, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar_gray3 .ui-progress3 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar_gray3 .ui-progress3').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar_gray3 .ui-progress3').animateProgress(80, function() {
    jQuery(this).animateProgress(85, function() {
      setTimeout(function() {
        jQuery('#progress_bar_gray3 .ui-progress3').animateProgress(80, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar_gray4 .ui-progress3 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar_gray4 .ui-progress3').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar_gray4 .ui-progress3').animateProgress(94, function() {
    jQuery(this).animateProgress(90, function() {
      setTimeout(function() {
        jQuery('#progress_bar_gray4 .ui-progress3').animateProgress(94, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});

jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar_gray5 .ui-progress3 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar_gray5 .ui-progress3').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar_gray5 .ui-progress3').animateProgress(85, function() {
    jQuery(this).animateProgress(80, function() {
      setTimeout(function() {
        jQuery('#progress_bar_gray5 .ui-progress3').animateProgress(85, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});



// gray bars two
jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar_gray001 .ui-progress1 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar_gray001 .ui-progress1').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar_gray001 .ui-progress1').animateProgress(90, function() {
    jQuery(this).animateProgress(81, function() {
      setTimeout(function() {
        jQuery('#progress_bar_gray001 .ui-progress1').animateProgress(90, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar_gray002 .ui-progress1 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar_gray002 .ui-progress1').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar_gray002 .ui-progress1').animateProgress(72, function() {
    jQuery(this).animateProgress(63, function() {
      setTimeout(function() {
        jQuery('#progress_bar_gray002 .ui-progress1').animateProgress(72, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar_gray003 .ui-progress1 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar_gray003 .ui-progress1').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar_gray003 .ui-progress1').animateProgress(80, function() {
    jQuery(this).animateProgress(85, function() {
      setTimeout(function() {
        jQuery('#progress_bar_gray003 .ui-progress1').animateProgress(80, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar_gray004 .ui-progress1 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar_gray004 .ui-progress1').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar_gray004 .ui-progress1').animateProgress(94, function() {
    jQuery(this).animateProgress(90, function() {
      setTimeout(function() {
        jQuery('#progress_bar_gray001 .ui-progress1').animateProgress(94, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});

jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar_gray005 .ui-progress1 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar_gray005 .ui-progress1').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar_gray005 .ui-progress1').animateProgress(85, function() {
    jQuery(this).animateProgress(80, function() {
      setTimeout(function() {
        jQuery('#progress_bar_gray005 .ui-progress1').animateProgress(85, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});







jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar001 .ui-progress2 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar001 .ui-progress2').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar001 .ui-progress2').animateProgress(90, function() {
    jQuery(this).animateProgress(81, function() {
      setTimeout(function() {
        jQuery('#progress_bar001 .ui-progress2').animateProgress(90, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar002 .ui-progress2 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar002 .ui-progress2').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar002 .ui-progress2').animateProgress(72, function() {
    jQuery(this).animateProgress(63, function() {
      setTimeout(function() {
        jQuery('#progress_bar002 .ui-progress2').animateProgress(72, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar003 .ui-progress2 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar003 .ui-progress2').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar003 .ui-progress2').animateProgress(80, function() {
    jQuery(this).animateProgress(85, function() {
      setTimeout(function() {
        jQuery('#progress_bar003 .ui-progress2').animateProgress(80, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar004 .ui-progress2 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar004 .ui-progress2').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar004 .ui-progress2').animateProgress(94, function() {
    jQuery(this).animateProgress(90, function() {
      setTimeout(function() {
        jQuery('#progress_bar004 .ui-progress2').animateProgress(94, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});


jQuery(function() {
  // Hide the label at start
  jQuery('#progress_bar005 .ui-progress2 .ui-label').hide();
  // Set initial value
  jQuery('#progress_bar005 .ui-progress2').css('width', '7%');

  // Simulate some progress
  jQuery('#progress_bar005 .ui-progress2').animateProgress(85, function() {
    jQuery(this).animateProgress(80, function() {
      setTimeout(function() {
        jQuery('#progress_bar005 .ui-progress2').animateProgress(85, function() {
          jQuery('#main_content').slideDown();
          jQuery('#fork_me').fadeIn();
        });
      }, 2000);
    });
  });
  
});








