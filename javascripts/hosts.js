//global variables
var my_n, my_i, my_z, img, preload_step;

var scales = ["sdss_images/hosts_wide/", "sdss_images/hosts_zoom/"];

var url_nsa = "http://www.nsatlas.org/getAtlas.html?submit_form=Submit&search=nsaid&nsaID=";
var url_sdss = "http://skyserver.sdss3.org/dr8/en/tools/explore/obj.asp?id=";
var url_ned = "http://ned.ipac.caltech.edu/cgi-bin/objsearch?objname=";

function getHyperlink(href, text){
    return '<a target="_blank" href="' + href + '">' + text + '</a>';
}

function getImgUrl(i, z){
    return scales[z] + d[i].id + '.jpg';
}

function preload(step){
    if (step){
        (new Image()).src = getImgUrl((my_i+step+my_n)%my_n, my_z);
        (new Image()).src = getImgUrl(my_i, 1-my_z);
    }
    else{
        (new Image()).src = getImgUrl((my_i+1)%my_n, my_z);
        (new Image()).src = getImgUrl((my_i-1+my_n)%my_n, my_z);
    }
}

function change_hash(){
    var h = '#' + (my_i+1).toString();
    if (my_z) { h += 'z';}
    window.location.hash = h;
}

function change_img(step){
    if (step){ my_i = (my_i + step + my_n)%my_n; } else{ my_z = 1 - my_z;}
    preload_step = step;
    img.attr('src', getImgUrl(my_i, my_z));
    if (step){ load_text(); }
    change_hash();
}

function load_text(){
    var d_this = d[my_i];
    var t = d_this.id + ' (';
    t += getHyperlink(url_nsa + d_this.nsa, 'NSA '+d_this.nsa);
    t += ', ' + getHyperlink(url_sdss + d_this.sdss_ObjID, 'SDSS '+d_this.sdss);
    if('ngc' in d_this) {
        t += ', ' + getHyperlink(url_ned+'NGC'+d_this.ngc, 'NGC '+d_this.ngc);
    }
    t += ')';
    $('#host_text').html(t);
}

$( document ).ready(function() {
    //initialize global variables
    img = $('#host_img');
    my_n = d.length;
    
    var hash = window.location.hash.substring(1);
    my_i = parseInt(hash) - 1;
    my_z = 0;
    preload_step = 0;

    if (isNaN(my_i) || my_i < 0 || my_i >= my_n) { my_i = 0;}
    else if (hash.charAt(hash.length-1) == 'z') {my_z = 1;}

    img.attr('src', getImgUrl(my_i, my_z));
    load_text();
    change_hash();
    preload(0);
    preload(1);

    //binding events
    img.load(function(){preload(preload_step);});
    $('#btn_next').click(function() {change_img(1);});
    $('#btn_prev').click(function() {change_img(-1);});
    $('#btn_zoom').click(function() {
        change_img(0);
        if (my_z) {$(this).html('Zoom Out');} else {$(this).html('Zoom In');}
    });

    $(document).keydown(function(event){
        switch(event.which){
            case 37:
            case 74:
                $('#btn_prev').click();
                break;
            case 39:
            case 75:
                $('#btn_next').click();
                break;
            case 90:
                $('#btn_zoom').click();
                break;
        }
    });
});

