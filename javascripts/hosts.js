//global variables
var my_n, my_i, my_z, img, preload_step;
var scales = ["sdss_images/hosts_wide/", "sdss_images/hosts_zoom/"];

var url_nsa = "http://www.nsatlas.org/getAtlas.html?submit_form=Submit&search=nsaid&nsaID=";
var url_sdss = "http://skyserver.sdss3.org/dr8/en/tools/explore/obj.asp?id=";
var url_ned = "http://ned.ipac.caltech.edu/cgi-bin/objsearch?objname=NGC";

var page_url = "http://saga-survey.github.io/saga-data/hosts.html#!";
var page_title = "SAGA Host Galaxies #";
var disqus_shortname = 'saga-hosts';
var disqus_identifier = '';
var disqus_url = '';
var disqus_title = '';

var getHyperlink = function(href, text){
    return '<a target="_blank" href="' + href + '">' + text + '</a>';
};

var getImgUrl = function(i, z){
    return scales[z] + d[i].id + '.jpg';
};

var get_hash_id = function(){
    return (my_i+1).toString();
};

var change_disqus = function(){
    var hid = get_hash_id();
    DISQUS.reset({
        reload: true,
        config: function () {
            this.page.identifier = d[my_i].id;  
            this.page.url = page_url + hid;
            this.page.title = page_title + hid;
        }
    });
};

var change_img = function(step){
    if (step){ my_i = (my_i + step + my_n)%my_n; } else{ my_z = 1 - my_z;}
    preload_step = step;
    img.attr('src', getImgUrl(my_i, my_z));
    var h = '#!' + get_hash_id();
    if (my_z) {h += 'z';}
    window.location.hash = h;
    if (step){
        load_text(); 
        change_disqus();
    }
};

var preload = function(step){
    if (step){
        (new Image()).src = getImgUrl((my_i+step+my_n)%my_n, my_z);
        (new Image()).src = getImgUrl(my_i, 1-my_z);
    }
    else{
        (new Image()).src = getImgUrl((my_i+1)%my_n, my_z);
        (new Image()).src = getImgUrl((my_i-1+my_n)%my_n, my_z);
    }
};

var load_text = function(){
    var d_this = d[my_i];
    var t = d_this.id + ' (';
    t += getHyperlink(url_nsa + d_this.nsa, 'NSA '+d_this.nsa);
    t += ', ' + getHyperlink(url_sdss + d_this.sdss_ObjID, 'SDSS '+d_this.sdss);
    if('ngc' in d_this) {
        t += ', ' + getHyperlink(url_ned + d_this.ngc, 'NGC '+d_this.ngc);
    }
    t += ')';
    $('#host_text').html(t);
};

$( document ).ready(function() {
    //initialize global variables
    img = $('#host_img');
    my_n = d.length;

    //resolve hash
    var hash = window.location.hash.substring(1);
    if (hash.charAt(0) == '!'){ hash = hash.substring(1);}
    my_i = parseInt(hash) - 1;
    my_z = 0;
    if (isNaN(my_i) || my_i < 0 || my_i >= my_n) { my_i = 0;}
    else if (hash.charAt(hash.length-1) == 'z') {my_z = 1;}
    
    //load disqus
    var hid = get_hash_id();
    disqus_identifier = d[my_i].id;
    disqus_url = page_url + hid;
    disqus_title = page_title + hid;
    var dsq = document.createElement('script'); 
    dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

    //load the first image
    img.attr('src', getImgUrl(my_i, my_z));
    load_text();
    (new Image()).src = getImgUrl((my_i+1)%my_n, my_z);
    (new Image()).src = getImgUrl((my_i-1+my_n)%my_n, my_z);
    (new Image()).src = getImgUrl(my_i+1, 1-my_z);

    //bind preload to img.load
    img.load(function(){preload(preload_step);});

    //bind click events
    $('#btn_next').click(function() {change_img(1);});
    $('#btn_prev').click(function() {change_img(-1);});
    $('#btn_zoom').click(function() {
        change_img(0);
        if (my_z) {$(this).html('Zoom Out');} else {$(this).html('Zoom In');}
    });

    //bind key events
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

