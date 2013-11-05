//global variables
var my_i, my_z, n;
var text_key = 'text';
var url_key = ['url', 'zoom'];

function preload(url) {
    $(document.createElement('img')).attr('src', url);
}

function load_host(i, z){
    my_i = i;
    my_z = z;
    $('#host_img').attr('src', d[url_key[z]][i]);
    $('#host_text').html(d[text_key][i]);
    preload(d[url_key[1-z]][i]);
    preload(d[url_key[z]][(i+1)%n]);
    preload(d[url_key[z]][(i-1+n)%n]);
}

$( document ).ready(function() {
    n = d[text_key].length;
    load_host(0, 0);

    $("#btn_next").click(function() {load_host((my_i+1)%n, my_z);});
    $("#btn_prev").click(function() {load_host((my_i-1+n)%n, my_z);});
    $("#btn_zoom").click(function() {
        load_host(my_i, 1-my_z);
        if (my_z) {$(this).html("Zoom Out");} else {$(this).html("Zoom In");}
    });

    $(document).keydown(function(event){
        switch(event.which){
            case 74:
                $("#btn_prev").click();
                break;
            case 75:
                $("#btn_next").click();
                break;
            case 90:
                $("#btn_zoom").click();
                break;
        }
    });
});

