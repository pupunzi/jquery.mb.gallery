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
 * Name:jquery.mb.containerPlus
 * Version: 2.0
 */


(function($){

  var isIE=$.browser.msie;

  $.mbGallery ={
    name:"mb.gallery",
    author:"Matteo Bicocchi",
    version:"1.0",
    defaults:{
      containment:"body",
      cssURL:"css/",
      skin:"white",
      overlay:"#333",

      imageSelector: ".imgFull",
      thumbnailSelector: ".imgThumb",
      descSelector: ".imgDesc",

      minWidth: 500,
      minHeight: 400,
      maxWidth: 0,
      maxHeight: 0,
      galleryFrameColor: "#fff",
      maskOpacity:.5,
      maskBgnd:"transparent",
      startFrom: 0,//"random"
      fadeTime: 500,
      slideTimer: 6000,
      autoSlide: true
    },
    buildMbGallery:function(options){
      var gallery= $(this).get(0);
      gallery.options = $.extend({}, $.mbGallery.defaults, options);
      var css= $("<link rel='stylesheet' type='text/css' href='"+gallery.options.cssURL+gallery.options.skin+".css' title='tyle'  media='screen'/>");
      $("head").prepend(css);
      $(gallery).hide();
      gallery.galleryID= "mb_gallery_"+gallery.id;
      $(gallery).mb_getPhotos();

      if(gallery.options.containment=="body"){
        var overlay=$("<div/>").addClass("mb_overlay").one("click",function(){$(gallery).mb_closeGallery();}).css({opacity:gallery.options.maskOpacity,backgroundColor: gallery.options.overlay}).hide();
        var galleryScreen= $("<div/>").attr("id",gallery.galleryID).addClass("galleryScreen");
        var galleryImg= $("<div/>").addClass("galleryImg");
        var galleryLoader= $("<div/>").addClass("loader").mb_bringToFront().css("opacity",.7).hide();
        var galleryThumbs=$("<div/>").addClass("galleryThumbs").hide();
        var galleryNav=$("<div/>").addClass("galleryNav");
        galleryScreen.bind("mouseleave",function(){
          $(gallery).mb_hideThumbs();
        });
        $("body").append(overlay);
        overlay.fadeIn();
        $("body").append(galleryScreen);
        galleryScreen.append(galleryNav);
        galleryScreen.append(galleryImg);
        galleryImg.append(galleryLoader);
        galleryImg.append(galleryThumbs);
        galleryScreen.css({
          minWidth:gallery.options.minWidth,
          minHeight:gallery.options.minHeight,
          top:"50%",
          marginTop:-(gallery.options.minHeight/2),
          left:"50%",
          marginLeft:-(gallery.options.minWidth/2)
        });
        galleryImg.css({
          minWidth:gallery.options.minWidth,
          minHeight:gallery.options.minHeight
        });
        gallery.sliding=gallery.options.autoSlide;
        gallery.idx=gallery.options.startFrom=="random"?Math.floor(Math.random()*(gallery.images.length-1)):gallery.options.startFrom;
        $("#"+gallery.galleryID).find(".loader").addClass("loading").show();
        $(gallery).mb_buildThumbs();
        $(gallery).mb_selectThumb();
        $(gallery).mb_buildNav();
        $(gallery).mb_preload();
      }
    },
    getPhotos: function(){
      var gallery= $(this).get(0);
      gallery.images= new Array();
      $(gallery).find(gallery.options.thumbnailSelector).each(function(i){
        var photo=new Object();
        photo.idx= i;
        photo.thumb= $(this).attr("href");
        photo.full= $(this).next("a").attr("href");
        photo.fullWidth= $(this).attr("w")?$(this).attr("w"):false;
        photo.fullHeight= $(this).attr("h")?$(this).attr("h"):false;
        photo.desc= $(this).nextAll(gallery.options.descSelector).html();
        gallery.images.push(photo);
      });
    },
    preload:function(){
      var gallery= $(this).get(0);
      if(!gallery.sliding) $("#"+gallery.galleryID).find(".loader").addClass("loading").show();
      var rndVar=$.browser.msie?"?"+new Date():"";
      $("<img/>").attr("src", gallery.images[gallery.idx].full+rndVar).load(
              function(){
                if(!gallery.sliding) $("#"+gallery.galleryID).find(".loader").fadeOut(500,function(){$("#"+gallery.galleryID).find(".loader").removeClass("loading");});//
                $(gallery).mb_changePhoto(rndVar);
                $(gallery).mb_selectThumb();
              });

    },
    changePhoto:function(rndVar){
      var gallery= $(this).get(0);
      $("#"+gallery.galleryID).find(".loader").fadeOut(500,function(){$("#"+gallery.galleryID).find(".loader").removeClass("loading");});
      var galleryImg=$("#"+gallery.galleryID).find(".galleryImg");
      var galleryDesc=$("#"+gallery.galleryID).find(".photoDesc");
      var galleryScreen=$("#"+gallery.galleryID);
      var galleryNav=$("#"+gallery.galleryID).find(".galleryNav");
      var newImg= $("<img/>").attr({src:gallery.images[gallery.idx].full+rndVar}).css({position:"absolute",top:0,left:0}).hide();
      galleryImg.prepend(newImg);

      var dim=newImg.getDim(gallery,gallery.images[gallery.idx].fullWidth,gallery.images[gallery.idx].fullHeight);
      var w=parseFloat(dim[1]);
      var h=parseFloat(dim[0]);
      //newImg.css({widh:w,height:h});
      galleryScreen.animate({
        top:"50%",
        marginTop:-(h/2),
        left:"50%",
        marginLeft:-(w/2)
      },"slow");
      galleryImg.animate({
        width:w,
        height:h
      },"slow",function(){});

      newImg.fadeIn("slow",function(){});
      newImg.next("img").fadeOut("slow",function(){$(this).remove();});
      galleryDesc.fadeOut("slow",function(){galleryDesc.html(gallery.images[gallery.idx].desc); galleryDesc.fadeIn();});
      if(gallery.sliding){
        galleryNav.find(".startStopIcon").addClass("selected");
        gallery.startSlide=setTimeout(function(){
          gallery.idx=gallery.idx==gallery.images.length-1?0:gallery.idx+1;
          $(gallery).mb_preload();
        },gallery.options.slideTimer);
      }
      galleryNav.find(".photoCounter").html((gallery.idx+1)+" / <b>"+gallery.images.length+"</b>");
    },
    buildThumbs:function(){
      var gallery= $(this).get(0);
      var galleryThumbs=$("#"+gallery.galleryID).find(".galleryThumbs");
      galleryThumbs.empty();
      $(gallery.images).each(function(i){
        var photo=this;
        var img=$("<img>").addClass("thumb");
        img.attr("src",photo.thumb);
        img.attr("id", gallery.galleryID+"_thumb_"+i);
        img.bind("click",function(){
          if($(this).is(".selected")) return;
          gallery.idx = photo.idx;
          $(gallery).mb_selectThumb();
          $(gallery).mb_stopSlide();
          $(gallery).mb_preload();
          $(gallery).mb_hideThumbs();
        });
        galleryThumbs.css("opacity",.9);
        galleryThumbs.append(img);
      });
    },
    buildNav:function(){
      var gallery= $(this).get(0);
      var galleryNav=$("#"+gallery.galleryID).find(".galleryNav");
      var galleryThumbs=$("#"+gallery.galleryID).find(".galleryThumbs");

      var photoDesc= $("<div/>").addClass("photoDesc");
      var thumbsIcon= $("<div/>").addClass("thumbsIcon ico").bind("click",function(){
        if(galleryThumbs.is(":hidden")) $(gallery).mb_showThumbs();
        else $(gallery).mb_hideThumbs();
      });
      var startStopIcon= $("<div/>").addClass("startStopIcon ico").bind("click",function(){
        if (gallery.sliding) $(gallery).mb_stopSlide();
        else $(gallery).mb_startSlide();
      });
      var prevIcon= $("<div/>").addClass("prevIcon ico").bind("click",function(){
        $(gallery).mb_galleryPrev();
      });
      var nextIcon= $("<div/>").addClass("nextIcon ico").bind("click",function(){
        $(gallery).mb_galleryNext();
      });
      var photoCounter= $("<div/>").addClass("photoCounter ico");
      var galleryCloseIcon= $("<div/>").addClass("galleryCloseIcon ico").one("click",function(){$(gallery).mb_closeGallery();});

      var galleryBtns= $("<div/>").addClass("galleryBtns");
      galleryNav.append(photoDesc);
      galleryNav.append(galleryBtns);
      galleryBtns.prepend(thumbsIcon).prepend(startStopIcon).prepend(prevIcon).prepend(nextIcon).prepend(photoCounter).prepend(galleryCloseIcon);
    },
    selectThumb:function(){
      var gallery= $(this).get(0);
      var galleryThumbs=$("#"+gallery.galleryID).find(".galleryThumbs");
      var actualThumb=$("#"+gallery.galleryID+"_thumb_"+gallery.idx);
      galleryThumbs.find(".thumb").removeClass("selected").css("opacity",1);
      actualThumb.addClass("selected").css("opacity",.4);
    },
    startSlide:function(){
      var gallery= $(this).get(0);
      var galleryNav=$("#"+gallery.galleryID).find(".galleryNav");
      gallery.sliding=true;
      gallery.idx=gallery.idx==gallery.images.length-1?0:gallery.idx+1;
      $(gallery).mb_preload();
      galleryNav.find(".startStopIcon").addClass("selected");
    },
    stopSlide:function(){
      var gallery= $(this).get(0);
      var galleryNav=$("#"+gallery.galleryID).find(".galleryNav");
      gallery.sliding=false;
      clearTimeout(gallery.startSlide);
      galleryNav.find(".startStopIcon").removeClass("selected");
    },
    prev:function(){
      var gallery= $(this).get(0);
      $(gallery).mb_stopSlide();
      gallery.sliding=false;
      gallery.idx=gallery.idx==0?gallery.images.length-1:gallery.idx-1;
      $(gallery).mb_preload();
    },
    next:function(){
      var gallery= $(this).get(0);
      $(gallery).mb_stopSlide();
      gallery.sliding=false;
      gallery.idx=gallery.idx==gallery.images.length-1?0:gallery.idx+1;
      $(gallery).mb_preload();
    },
    showThumbs:function(){
      var gallery= $(this).get(0);
      var galleryNav=$("#"+gallery.galleryID).find(".galleryNav");
      galleryNav.find(".thumbsIcon").addClass("selected");
      var galleryThumbs=$("#"+gallery.galleryID).find(".galleryThumbs");
      galleryThumbs.slideDown();
    },
    hideThumbs:function(){
      var gallery= $(this).get(0);
      var galleryNav=$("#"+gallery.galleryID).find(".galleryNav");
      galleryNav.find(".thumbsIcon").removeClass("selected");
      var galleryThumbs=$("#"+gallery.galleryID).find(".galleryThumbs");
      galleryThumbs.slideUp();
    },
    closeGallery:function(){
      var gallery= $(this).get(0);
      if(!$.browser.msie)
        $("#"+gallery.galleryID).animate({position:"absolute",top:-1000},"slow",function(){$("#"+gallery.galleryID).remove();});
      else
        $("#"+gallery.galleryID).remove();
      $(".mb_overlay").slideUp("slow",function(){$(".mb_overlay").remove();});
      $(gallery).mb_stopSlide();
    }
  };

  jQuery.fn.extend({
    getDim:function(gallery){
      var nh=$(this).outerHeight();
      var nw=$(this).outerWidth();

      var wh=gallery.options.containment=="body"?$(window).height():$("#"+gallery.options.containment).innerHeight();
      var ww=gallery.options.containment=="body"?$(window).width():$("#"+gallery.options.containment).innerWidth();
      if (gallery.options.galleryMaxHeight>0 && $(this).outerHeight()>gallery.options.galleryMaxHeight){nh=gallery.options.galleryMaxHeight;}
      if (gallery.options.galleryMaxWidth>0 && $(this).outerWidth()>gallery.options.galleryMaxWidth){nw=gallery.options.galleryMaxWidth;}

      if (nh+120>=wh){
        nh= wh-130;
        nw=(nh*$(this).outerWidth())/$(this).outerHeight();
        $(this).attr("height", nh);
        $(this).attr("width", nw);
      }
      if (nw+100>=ww){
        nw= ww-120;
        nh=(nw*$(this).outerHeight())/$(this).outerWidth();
        $(this).attr("width", nw);
        $(this).attr("height", nh);
      }
      return [nh,nw];
    }
  });

 /* jQuery.fn.extend({
     getDim:function(gallery,w,h){
      var ow=w?w:$(this).outerWidth();
      var oh=h?h:$(this).outerHeight();

      var wh=gallery.options.containment=="body"?$(window).height():$("#"+gallery.options.containment).innerHeight();
      var ww=gallery.options.containment=="body"?$(window).width():$("#"+gallery.options.containment).innerWidth();
      if (gallery.options.galleryMaxHeight>0 && oh>gallery.options.galleryMaxHeight){oh=gallery.options.galleryMaxHeight;}
      if (gallery.options.galleryMaxWidth>0 && ow>gallery.options.galleryMaxWidth){ow=gallery.options.galleryMaxWidth;}

      if (oh+130>=wh){
        oh= wh-130;
         $(this).attr("height", oh);
        ow=(oh*$(this).outerWidth())/$(this).outerHeight();
      }
      if (ow+130>=ww){
        ow= ww-120;
        $(this).attr("width", ow);
        oh=(ow*$(this).outerHeight())/$(this).outerWidth();
      }
      return [oh,ow];
    }
  });
*/


  $.fn.mbGallery= $.mbGallery.buildMbGallery;
  $.fn.mb_getPhotos= $.mbGallery.getPhotos;
  $.fn.mb_buildThumbs= $.mbGallery.buildThumbs;
  $.fn.mb_buildNav= $.mbGallery.buildNav;
  $.fn.mb_preload= $.mbGallery.preload;
  $.fn.mb_changePhoto= $.mbGallery.changePhoto;
  $.fn.mb_selectThumb= $.mbGallery.selectThumb;

  $.fn.mb_galleryNext= $.mbGallery.next;
  $.fn.mb_galleryPrev= $.mbGallery.prev;
  $.fn.mb_startSlide= $.mbGallery.startSlide;
  $.fn.mb_stopSlide= $.mbGallery.stopSlide;

  $.fn.mb_showThumbs= $.mbGallery.showThumbs;
  $.fn.mb_hideThumbs= $.mbGallery.hideThumbs;
  $.fn.mb_closeGallery= $.mbGallery.closeGallery;

  jQuery.fn.mb_bringToFront= function(){
    var zi=10;
    $('*').each(function() {
      if($(this).css("position")=="absolute"){
        var cur = parseInt($(this).css('zIndex'));
        zi = cur > zi ? parseInt($(this).css('zIndex')) : zi;
      }
    });
    $(this).css('zIndex',zi+=1);
    return $(this);
  };

})(jQuery);