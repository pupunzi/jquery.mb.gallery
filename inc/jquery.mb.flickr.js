/*******************************************************************************
 jquery.mb.components
 Copyright (c) 2001-2010. Matteo Bicocchi (Pupunzi); Open lab srl, Firenze - Italy
 email: info@pupunzi.com
 site: http://pupunzi.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 ******************************************************************************/

/*
 * jQuery.mb.components: jquery.mb.flickr
 * version: 1.0
 * © 2001 - 2009 Matteo Bicocchi (pupunzi), Open Lab
 *
 *
 * Chiave: f40779ab07dd09e5890f48e3618296b3
 * Segreto: c24a710f28bc3a6f
 * NSID: 16424076@N00
 *
 * This plugin adds an object filled with all the photos from a Flickr Set or a Flickr User
 * to a DOM element of your page.
 * Once the calls get success your element will have set all the photos, total elements and actual page
 *
 * ex:
 $("#myElementId").mb_loadFlickrPhotos({callBack: logData})
 function logData(o){
 console.debug(o.page); // actual page
 console.debug(o.pages); // total pages
 console.debug(o.photos); // Object containing all the photos per_page
 $(o.photos).each(function(n){
 console.debug(o.photos[n].title) // the title of the photo
 console.debug(o.photos[n].square) // the url for the photo sqared thmb
 console.debug(o.photos[n].thumb) // the url for the photo thmb
 console.debug(o.photos[n].medium) // the url for the medium-size photo
 console.debug(o.photos[n].source) // the url for the surce photo
 console.debug(o.photos[n].url) // the url for the flickr photo page
 });
 }
 *
 */



(function($) {
  $.mbFlickr= {
    name:"mb.flickr",
    author:"Matteo Bicocchi",
    version:"1.0",
    //Flickr_API_DATA
    flickr_api_key:"",
    flickr_user_name:"",
    flickr_user_id:"",

    defaults:{
      flickr_photoset_id:"72157594272544495",
      per_page:20
    },
    callBack:function(o){},

    //this is the main function
    loadFlickrPhotos:function(options){
      var gallery= $(this).get(0);
      gallery.defaults = $.extend({}, $.mbFlickr.defaults, options);
      if(typeof gallery.isInit!= "undefined" && gallery.isInit == gallery.defaults.flickr_photoset_id){
        if(gallery.defaults.callBack) gallery.defaults.callBack(gallery);
        return;
      }
      var overlay=$("<div/>").addClass("mb_overlay").one("click",function(){$(gallery).mb_closeGallery();}).css({
        opacity:.7,
        top:0,
        left:0,
        width:"100%",
        height:"100%",
        position:"fixed",
        background:"#000 url(css/elements/loading.gif) no-repeat center center",
        zIndex:10000
      }).hide();
      $("body").append(overlay);
      overlay.show();

      var getSet= gallery.defaults.flickr_photoset_id;
      if (!$.mbFlickr.flickr_user_id)
        $.mbFlickr.getFlickrNSID($.mbFlickr.flickr_api_key,$.mbFlickr.flickr_user_name);
      if (getSet) {
        $(gallery).mb_getFlickrSet(false,function(){
          $(gallery).mb_getFlickrPhotoDATA();
          $(gallery).mb_getFlickrPhotoINFO();
        });
      }else{
        $(gallery).mb_getFlickrPhotos(false,function(){
          $(gallery).mb_getFlickrPhotoDATA();
        });
      }
    },
    //get NSID from FLICKR
    getFlickrNSID:function(key,name){
      $.getJSON("http://api.flickr.com/services/rest/?method=flickr.urls.lookupUser&api_key="+key+"&url=http%3A%2F%2Fwww.flickr.com%2Fphotos%2F"+name+"%2F&format=json&rnd="+new Date()+"&jsoncallback=?",
        function(data){
          if (data.stat!="fail"){
            $.mbFlickr.flickr_user_id=data.user.id;
          }
        });
    },
    getFlickrSet:function(page, callBack){
      if (!page) page=1;
      var gallery= $(this).get(0);
      var per_page= gallery.defaults.per_page;
      var key= $.mbFlickr.flickr_api_key;
      var setID= gallery.defaults.flickr_photoset_id;
      $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key="+key+"&photoset_id="+setID+"&per_page="+per_page+"&page="+page+"&format=json&rnd="+new Date()+"&jsoncallback=?",
        function(data){

          gallery.photos = data.photoset.photo;
          gallery.pages = data.photoset.pages;
          gallery.page = data.photoset.page;

          if(callBack) callBack();
        });
    },
    getFlickrPhotos:function(page, callBack){
      if(!page) page=1;
      var gallery= $(this).get(0);
      var per_page= gallery.defaults.per_page;
      var key= $.mbFlickr.flickr_api_key;
      var userNSID= $.mbFlickr.flickr_user_id;
      $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key="+key+"&user_id="+userNSID+"&per_page="+per_page+"&page="+page+"&format=json&rnd="+new Date()+"&jsoncallback=?",
        function(data){

          gallery.photos = data.photos.photo;
          gallery.pages = data.photos.pages;
          gallery.page = data.photos.page;
          if(callBack) callBack();
        });
    },
    getFlickrPhotoDATA:function(){
      var gallery= $(this).get(0);
      var key = $.mbFlickr.flickr_api_key;
      $(gallery.photos).each(function(i){

        $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+key+"&photo_id="+this.id+"&secret="+this.secret+"&format=json&rnd="+new Date()+"&jsoncallback=?",
          function(data){

            gallery.photos[i].square= data.sizes.size[0].source;
            gallery.photos[i].thumb= data.sizes.size[1].source;
            gallery.photos[i].thumbWidth= data.sizes.size[1].width;
            gallery.photos[i].thumbHeght= data.sizes.size[1].height;

            gallery.photos[i].small= data.sizes.size[2].source;
            gallery.photos[i].smallWidth= data.sizes.size[2].width;
            gallery.photos[i].smallHeigt= data.sizes.size[2].height;

            gallery.photos[i].medium= data.sizes.size[3].source;
            gallery.photos[i].mediumWidth= data.sizes.size[3].width;
            gallery.photos[i].mediumHeight= data.sizes.size[3].height;

            gallery.photos[i].source= data.sizes.size[data.sizes.size.length-1].source;
            gallery.photos[i].sourceWidth= data.sizes.size[data.sizes.size.length-1].width;
            gallery.photos[i].sourceHeight= data.sizes.size[data.sizes.size.length-1].height;

            gallery.photos[i].url= data.sizes.size[data.sizes.size.length-1].url;

            if (i== gallery.photos.length-1){
              setTimeout(function(){
                $(".mb_overlay").fadeOut();
                if (gallery.defaults.callBack) gallery.defaults.callBack(gallery);
                gallery.isInit=gallery.defaults.flickr_photoset_id;
              },2000);
            }
          });
      });
    },
    getFlickrPhotoINFO:function(){
      var gallery= $(this).get(0);
      var key = $.mbFlickr.flickr_api_key;
      $(gallery.photos).each(function(i){

        $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+key+"&photo_id="+this.id+"&secret="+this.secret+"&format=json&rnd="+new Date()+"&jsoncallback=?",
          function(data){
            gallery.photos[i].description=data.photo.description._content==undefined?"":data.photo.description._content;
          });
      });
    }
  };

  $.fn.mb_getFlickrSet = $.mbFlickr.getFlickrSet;
  $.fn.mb_getFlickrPhotos = $.mbFlickr.getFlickrPhotos;
  $.fn.mb_getFlickrPhotoDATA = $.mbFlickr.getFlickrPhotoDATA;
  $.fn.mb_getFlickrPhotoINFO = $.mbFlickr.getFlickrPhotoINFO;
  $.fn.mb_loadFlickrPhotos = $.mbFlickr.loadFlickrPhotos;

})(jQuery);