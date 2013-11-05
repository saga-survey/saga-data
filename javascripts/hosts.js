//global variables
var my_n, my_i, my_z, img, preload_step;

var scales = ["sdss_images/hosts_wide/", "sdss_images/hosts_zoom/"];

var url_nsa = "http://www.nsatlas.org/getAtlas.html?submit_form=Submit&search=nsaid&nsaID=";
var url_sdss = "http://skyserver.sdss3.org/dr10/en/tools/explore/obj.aspx?id=";
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

function change_img(step){
    if (step){ my_i = (my_i + step + my_n)%my_n; } else{ my_z = 1 - my_z;}
    preload_step = step;
    img.attr('src', getImgUrl(my_i, my_z));
    if (step){ load_text(); }
}

function load_text(){
    var d_this = d[my_i];
    var t = getHyperlink(url_nsa + d_this.nsa, d_this.id);
    t += ' (' + getHyperlink(url_sdss + d_this.sdss, d_this.iau);
    if('ngc' in d_this) {
        t += ', ' + getHyperlink(url_ned + d_this.ngc, d_this.ngc);
    }
    t += ')';
    $('#host_text').html(t);
}

$( document ).ready(function() {
    //initialize global variables
    img = $('#host_img');
    my_n = d.length;
    my_i = 0; //data index
    my_z = 0; //scale index
    preload_step = 0;

    img.attr('src', getImgUrl(0, 0));
    load_text();
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

