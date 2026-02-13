 jQuery(function ($) {
 $(window).on('scroll', function(){
            var scrollBar = $(".scroll-progress-bar");
            if( scrollBar.length > 0 ){
                var s = $(window).scrollTop(),
                    d = $(document).height(),
                    c = $(window).height();
                var scrollPercent = (s / (d - c)) * 100;
                const postition = scrollBar.data('position')
                if( postition === 'top' ){
                    // var sticky = $('.header-sticky');
                    // if( sticky.length > 0 ){
                    //     sticky.css({ top: scrollBar.height() })
                    // }else{
                    //     sticky.css({ top: 0 })
                    // }
                }
                scrollBar.css({width: `${scrollPercent}%` })
            }
             
          })    

});