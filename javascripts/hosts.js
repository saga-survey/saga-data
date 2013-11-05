//global variables
var my_n, my_i, my_z, my_k, img, ready;

var scales = ['14.06250', '0.7031250'];

var url_img = 'http://skyservice.pha.jhu.edu/DR10/ImgCutout/getjpeg.aspx?opt=G&width=512&height=512&scale=';
var url_nsa = 'http://www.nsatlas.org/getAtlas.html?search=nsaid&submit_form=Submit&nsaID=';
var url_sdss = 'http://skyserver.sdss3.org/dr10/en/tools/quicklook/quickobj.aspx?';

function getImgUrl(i, z){
    return url_img + scales[z] + '&' + d[i].ra_dec;
}

function getHyperlink(href, text){
    return '<a target="_blank" href="' + href + '">' + text + '</a>';
}

function preload(k, i, z){
    img.eq(k).data('ready', false);
    img.eq(k).attr('src',  getImgUrl(i, z));
}

function change_img(step){
    if (step == 0) {return;}
    img.eq(my_k).hide();
    my_k = (my_k + step + 4)%4;
    if (img.eq(my_k).data('ready')) {img.eq(my_k).show();}
    if (step == 2){ // zoom
        my_z = 1-my_z;
        preload((my_k+1)%4, (my_i+1)%my_n, my_z);
        preload((my_k+3)%4, (my_i-1+my_n)%my_n, my_z);
    }
    else{
        my_i = (my_i+step+my_n)%my_n;
        load_text();
        preload((my_k+step+4)%4, (my_i+step+my_n)%my_n, my_z);
        preload((my_k+2)%4, my_i, 1-my_z);
    }
}

function load_text(){
    var d_this = d[my_i];
    var t = getHyperlink(url_nsa + d_this.nsa, d_this.id);
    t += ' (' + getHyperlink(url_sdss + d_this.ra_dec, d_this.iau);
    if (d_this.ngc != '') {t += ', ' + d_this.ngc;}
    t += ')';
    $('#host_text').html(t);
}

$( document ).ready(function() {
    img = $('#carousel_img > img');
    img.load(function(){
        if ($(this).index() == my_k){ $(this).show(); }
        $(this).data('ready', true);
    });

    my_n = d.length;
    my_k = 0; //img index
    my_i = 0; //data index
    my_z = 0; //scale index

    img.hide();
    img.data('ready', false)
    img.eq(0).attr('src', getImgUrl(0, 0));
    load_text();
    img.eq(1).attr('src', getImgUrl(1, 0));
    img.eq(2).attr('src', getImgUrl(0, 1));
    img.eq(3).attr('src', getImgUrl(my_n-1, 0));

    $('#btn_next').click(function() {change_img(1);});
    $('#btn_prev').click(function() {change_img(-1);});
    $('#btn_zoom').click(function() {
        change_img(2);
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

