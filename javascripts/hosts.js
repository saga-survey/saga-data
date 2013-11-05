//global variables
var hosts, i, n, z;

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

function load_host(fi, fz){
    if (fz){
        $('#host_img').src = hosts['url'][fi];
        preload([hosts['zoom'][fi], hosts['url'][(fi+1)%n], 
                hosts['url'][(fi-1+n)%n]]);
    }
    else{
        $('#host_img').src = hosts['zoom'][fi];
        preload([hosts['url'][fi], hosts['zoom'][(fi+1)%n], 
                hosts['zoom'][(fi-1+n)%n]]);
    }
    $('#host_text').html = hosts['text'][fi];
    i = fi;
    z = fz;
}

$( document ).ready(function() {
    $.getJSON("hosts.json", function(data){hosts = data;});
    n = hosts['url'].length;
    load_host(0, 0);

    $("btn_next").click(function() {load_host((i+1)%n, z);});
    $("btn_prev").click(function() {load_host((i-1+n)%n, z);});
    $("btn_zoom").click(function() {
        load_host(i, 1-z);
        if (z) {$(this).html("Zoom Out");} else {$(this).html("Zoom In");}
    });

    $(document).keydown(function(event){
        switch(event.which){
            case 74:
                $("btn_prev").click();
                break;
            case 75:
                $("btn_next").click();
                break;
            case 90:
                $("btn_zoom").click();
                break;
        }
    });
});

