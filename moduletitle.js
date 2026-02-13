jQuery(function($){

    // Last word in title
    $('h3.title-cat, h1.mod-breadcrumbs__item, .lastword').html(function(){    
        var text = $(this).text().split(' ');
        var last = text.pop();
        return text.join(" ") + (text.length > 0 ? ' <span class="last-word-nonda">'+last+'</span>' : last);   
    });
    
    // First word in title
    $('.bicolor, .jt-news .jtc_introdate, .jt-cs.nonda.jt-record .jt-title').html(function(){    
        var text = $(this).text().split(' ');
        var first = text.shift();
        return (text.length > 0 ? '<span class="titlespan"><span class="first-word-nonda">'+first+'</span> ' + text.join(" ") + '</span>' : '<span class="titlespan"><span class="first-word-nonda">'+first+'</span></span>');
    });
});
