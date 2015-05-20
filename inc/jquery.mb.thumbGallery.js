/*******************************************************************************
 *
 * jQuery.mb.components: mb.thumbGrid
 * Creation date: 03/09/14
 *
 * Licences: MIT, GPL
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 ******************************************************************************/

/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.CSSAnimate.min.js
 *  last modified: 26/03/14 21.40
 *  *****************************************************************************
 */

!function($){function uncamel(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function setUnit(a,b){return"string"!=typeof a||a.match(/^[\-0-9\.]+$/)?""+a+b:a}function setFilter(a,b,c){var d=uncamel(b),e=jQuery.browser.mozilla?"":$.CSS.sfx;a[e+"filter"]=a[e+"filter"]||"",c=setUnit(c>$.CSS.filters[b].max?$.CSS.filters[b].max:c,$.CSS.filters[b].unit),a[e+"filter"]+=d+"("+c+") ",delete a[b]}eval(function(a,b,c,d,e,f){if(e=function(a){return a},!"".replace(/^/,String)){for(;c--;)f[c]=d[c]||c;d=[function(a){return f[a]}],e=function(){return"\\w+"},c=1}for(;c--;)d[c]&&(a=a.replace(new RegExp("\\b"+e(c)+"\\b","g"),d[c]));return a}('29 11=17.53;24(!2.9){2.9={};2.9.34=!1;2.9.22=!1;2.9.45=!1;2.9.42=!1;2.9.40=!1;2.9.28=!1;2.9.56=11;2.9.16=17.51;2.9.13=""+47(17.23);2.9.18=26(17.23,10);29 32,12,20;24(-1!=(12=11.15("33")))2.9.45=!0,2.9.16="33",2.9.13=11.14(12+6),-1!=(12=11.15("25"))&&(2.9.13=11.14(12+8));27 24(-1!=(12=11.15("58")))2.9.28=!0,2.9.16="36 38 39",2.9.13=11.14(12+5);27 24(-1!=11.15("57")){2.9.28=!0;2.9.16="36 38 39";29 30=11.15("59:")+3,43=30+4;2.9.13=11.14(30,43)}27-1!=(12=11.15("41"))?(2.9.22=!0,2.9.40=!0,2.9.16="41",2.9.13=11.14(12+7)):-1!=(12=11.15("31"))?(2.9.22=!0,2.9.42=!0,2.9.16="31",2.9.13=11.14(12+7),-1!=(12=11.15("25"))&&(2.9.13=11.14(12+8))):-1!=(12=11.15("68"))?(2.9.22=!0,2.9.16="31",2.9.13=11.14(12+7),-1!=(12=11.15("25"))&&(2.9.13=11.14(12+8))):-1!=(12=11.15("35"))?(2.9.34=!0,2.9.16="35",2.9.13=11.14(12+8)):(32=11.37(" ")+1)<(12=11.37("/"))&&(2.9.16=11.14(32,12),2.9.13=11.14(12+1),2.9.16.63()==2.9.16.64()&&(2.9.16=17.51));-1!=(20=2.9.13.15(";"))&&(2.9.13=2.9.13.14(0,20));-1!=(20=2.9.13.15(" "))&&(2.9.13=2.9.13.14(0,20));2.9.18=26(""+2.9.13,10);67(2.9.18)&&(2.9.13=""+47(17.23),2.9.18=26(17.23,10));2.9.69=2.9.18}2.9.46=/65/19.21(11);2.9.49=/66/19.21(11);2.9.48=/60|61|55/19.21(11);2.9.50=/33 52/19.21(11);2.9.44=/54/19.21(11);2.9.62=2.9.46||2.9.49||2.9.48||2.9.44||2.9.50;',10,70,"||jQuery|||||||browser||nAgt|verOffset|fullVersion|substring|indexOf|name|navigator|majorVersion|i|ix|test|webkit|appVersion|if|Version|parseInt|else|msie|var|start|Safari|nameOffset|Opera|mozilla|Firefox|Microsoft|lastIndexOf|Internet|Explorer|chrome|Chrome|safari|end|windowsMobile|opera|android|parseFloat|ios|blackberry|operaMobile|appName|Mini|userAgent|IEMobile|iPod|ua|Trident|MSIE|rv|iPhone|iPad|mobile|toLowerCase|toUpperCase|Android|BlackBerry|isNaN|AppleWebkit|version".split("|"),0,{})),jQuery.support.CSStransition=function(){var a=document.body||document.documentElement,b=a.style;return void 0!==b.transition||void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.MsTransition||void 0!==b.OTransition}(),$.CSS={name:"mb.CSSAnimate",author:"Matteo Bicocchi",version:"2.0.0",transitionEnd:"transitionEnd",sfx:"",filters:{blur:{min:0,max:100,unit:"px"},brightness:{min:0,max:400,unit:"%"},contrast:{min:0,max:400,unit:"%"},grayscale:{min:0,max:100,unit:"%"},hueRotate:{min:0,max:360,unit:"deg"},invert:{min:0,max:100,unit:"%"},saturate:{min:0,max:400,unit:"%"},sepia:{min:0,max:100,unit:"%"}},normalizeCss:function(a){var b=jQuery.extend(!0,{},a);jQuery.browser.webkit||jQuery.browser.opera?$.CSS.sfx="-webkit-":jQuery.browser.mozilla?$.CSS.sfx="-moz-":jQuery.browser.msie&&($.CSS.sfx="-ms-");for(var c in b){"transform"===c&&(b[$.CSS.sfx+"transform"]=b[c],delete b[c]),"transform-origin"===c&&(b[$.CSS.sfx+"transform-origin"]=a[c],delete b[c]),"filter"!==c||jQuery.browser.mozilla||(b[$.CSS.sfx+"filter"]=a[c],delete b[c]),"blur"===c&&setFilter(b,"blur",a[c]),"brightness"===c&&setFilter(b,"brightness",a[c]),"contrast"===c&&setFilter(b,"contrast",a[c]),"grayscale"===c&&setFilter(b,"grayscale",a[c]),"hueRotate"===c&&setFilter(b,"hueRotate",a[c]),"invert"===c&&setFilter(b,"invert",a[c]),"saturate"===c&&setFilter(b,"saturate",a[c]),"sepia"===c&&setFilter(b,"sepia",a[c]);var d="";"x"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" translateX("+setUnit(a[c],"px")+")",delete b[c]),"y"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" translateY("+setUnit(a[c],"px")+")",delete b[c]),"z"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" translateZ("+setUnit(a[c],"px")+")",delete b[c]),"rotate"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" rotate("+setUnit(a[c],"deg")+")",delete b[c]),"rotateX"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" rotateX("+setUnit(a[c],"deg")+")",delete b[c]),"rotateY"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" rotateY("+setUnit(a[c],"deg")+")",delete b[c]),"rotateZ"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" rotateZ("+setUnit(a[c],"deg")+")",delete b[c]),"scale"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" scale("+setUnit(a[c],"")+")",delete b[c]),"scaleX"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" scaleX("+setUnit(a[c],"")+")",delete b[c]),"scaleY"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" scaleY("+setUnit(a[c],"")+")",delete b[c]),"scaleZ"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" scaleZ("+setUnit(a[c],"")+")",delete b[c]),"skew"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" skew("+setUnit(a[c],"deg")+")",delete b[c]),"skewX"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" skewX("+setUnit(a[c],"deg")+")",delete b[c]),"skewY"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" skewY("+setUnit(a[c],"deg")+")",delete b[c]),"perspective"===c&&(d=$.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" perspective("+setUnit(a[c],"px")+")",delete b[c])}return b},getProp:function(a){var b=[];for(var c in a)b.indexOf(c)<0&&b.push(uncamel(c));return b.join(",")},animate:function(a,b,c,d,e){return this.each(function(){function o(){f.called=!0,f.CSSAIsRunning=!1,g.off($.CSS.transitionEnd+"."+f.id),clearTimeout(f.timeout),g.css($.CSS.sfx+"transition",""),"function"==typeof e&&e.apply(f),"function"==typeof f.CSSqueue&&(f.CSSqueue(),f.CSSqueue=null)}var f=this,g=jQuery(this);f.id=f.id||"CSSA_"+(new Date).getTime();var h=h||{type:"noEvent"};if(f.CSSAIsRunning&&f.eventType==h.type&&!jQuery.browser.msie&&jQuery.browser.version<=9)return f.CSSqueue=function(){g.CSSAnimate(a,b,c,d,e)},void 0;if(f.CSSqueue=null,f.eventType=h.type,0!==g.length&&a){if(a=$.normalizeCss(a),f.CSSAIsRunning=!0,"function"==typeof b&&(e=b,b=jQuery.fx.speeds._default),"function"==typeof c&&(d=c,c=0),"string"==typeof c&&(e=c,c=0),"function"==typeof d&&(e=d,d="cubic-bezier(0.65,0.03,0.36,0.72)"),"string"==typeof b)for(var i in jQuery.fx.speeds){if(b==i){b=jQuery.fx.speeds[i];break}b=jQuery.fx.speeds._default}if(b||(b=jQuery.fx.speeds._default),"string"==typeof e&&(d=e,e=null),!jQuery.support.CSStransition){for(var j in a){if("transform"===j&&delete a[j],"filter"===j&&delete a[j],"transform-origin"===j&&delete a[j],"auto"===a[j]&&delete a[j],"x"===j){var k=a[j],l="left";a[l]=k,delete a[j]}if("y"===j){var k=a[j],l="top";a[l]=k,delete a[j]}("-ms-transform"===j||"-ms-filter"===j)&&delete a[j]}return g.delay(c).animate(a,b,e),void 0}var m={"default":"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};m[d]&&(d=m[d]),g.off($.CSS.transitionEnd+"."+f.id);var n=$.CSS.getProp(a),p={};$.extend(p,a),p[$.CSS.sfx+"transition-property"]=n,p[$.CSS.sfx+"transition-duration"]=b+"ms",p[$.CSS.sfx+"transition-delay"]=c+"ms",p[$.CSS.sfx+"transition-timing-function"]=d,setTimeout(function(){g.one($.CSS.transitionEnd+"."+f.id,o),g.css(p)},1),f.timeout=setTimeout(function(){return f.called||!e?(f.called=!1,f.CSSAIsRunning=!1,void 0):(g.css($.CSS.sfx+"transition",""),e.apply(f),f.CSSAIsRunning=!1,"function"==typeof f.CSSqueue&&(f.CSSqueue(),f.CSSqueue=null),void 0)},b+c+10)}})}},$.fn.CSSAnimate=$.CSS.animate,$.normalizeCss=$.CSS.normalizeCss,$.fn.css3=function(a){return this.each(function(){var b=$(this),c=$.normalizeCss(a);b.css(c)})}}(jQuery);

/*  ******************************************************************************/


(function ($) {
	jQuery.thumbGrid = {

		name    : "jquery.mb.thumbGrid",
		version : "1.3.1",
		author  : "Matteo Bicocchi",
		defaults: {
			nav_effect         : "slideLeft",
			nav_delay          : 60,
			nav_timing         : 800,
			nav_pagination     : 6,
			gallery_effectnext : "slideRight",
			gallery_effectprev : "slideLeft",
			gallery_timing     : 500,
			gallery_cover      : true,
			gallery_fullscreenw: "100%",
			gallery_fullscreenh: "100%"
		},

		transitions: {
			fade        : {in: {opacity: 0}, out: {opacity: 0}},
			slideUp     : {in: {opacity: 0}, out: {y: -200, opacity: 0}},
			slideDown   : {in: {opacity: 0}, out: {y: 200, opacity: 0}},
			slideLeft   : {in: {opacity: 0}, out: {x: -200, opacity: 0}},
			slideRight  : {in: {opacity: 0}, out: {x: 200, opacity: 0}},
			slideInverse: {in: {y: 200, opacity: 0}, out: {y: 200, opacity: 0}},
			zoomIn      : {in: {scale: .5, opacity: 0}, out: {scale: 2, opacity: 0}},
			zoomOut     : {in: {scale: 2, opacity: 0}, out: {scale: .1, opacity: 0}},
			rotate      : {in: { opacity: 0}, out: {rotate: 179, opacity: 0}}
		},

		init: function (options) {

			var opt = {};

			jQuery.extend(opt, jQuery.thumbGrid.defaults, options);

			return this.each(function () {

				var grid = this;
				var $grid = jQuery(grid);

				$grid.addClass("tg-container");

				$grid.hide();

				grid.isAnimating = false;
				grid.pageIndex = 0;

				grid.nav_effect = $grid.data("nav_effect") || opt.nav_effect;
				grid.nav_delay = $grid.data("nav_delay") || opt.nav_delay;
				grid.nav_timing = $grid.data("nav_timing") || opt.nav_timing;
				grid.nav_pagination = $grid.data("nav_pagination") || opt.nav_pagination;
				grid.gallery_fullscreenw = $grid.data("gallery_fullscreenw") || opt.gallery_fullscreenw;
				grid.gallery_fullscreenh = $grid.data("gallery_fullscreenh") || opt.gallery_fullscreenh;
				grid.gallery_cover = $grid.data("gallery_cover") || opt.gallery_cover;
				grid.gallery_effectnext = $grid.data("gallery_effectnext") || grid.nav_effect;
				grid.gallery_effectprev = $grid.data("gallery_effectprev") || grid.nav_effect;
				grid.gallery_timing = $grid.data("gallery_timing") || grid.nav_effect;

				jQuery.extend(opt, $grid.data());

				grid.opt = opt;

				grid.elements = $grid.children().clone();
				$grid.children().hide();

				grid.elements.each(function (i) {
					jQuery(this).attr("data-globalindex", i);
				});

				grid.pages = [];
				grid.totPages = Math.ceil(grid.elements.size() / grid.nav_pagination);

				var thumbIdx = 0;

				for (var p = 0; p < grid.totPages; p++) {
					var page = [];
					for (var x = 0; x < grid.nav_pagination; x++) {

						if (!grid.elements[thumbIdx])
							break;

						var thumb = grid.elements[thumbIdx];
						page.push(thumb);
						thumbIdx++;
					}
					grid.pages.push(page);
				}

				jQuery.thumbGrid.drawPage(grid, grid.pageIndex, false);
			})
		},

		drawPage: function (el, pageIdx, applyEffect) {

			if (typeof applyEffect === "undefined")
				applyEffect = true;

			var grid = el;
			var $grid = jQuery(grid);

			grid.nav_effect = $grid.data("nav_effect") || "fade";
			grid.nav_delay = $grid.data("nav_delay") || 100;
			grid.nav_timing = $grid.data("nav_timing") || 1000;

			grid.isAnimating = true;

			var pageElements = grid.pages[pageIdx];
			var $page = jQuery("<ul/>").addClass("thumb-grid");

			for (var x = 0; x < grid.nav_pagination; x++) {
				var thumb = $(pageElements[x]).clone().removeClass("in");
				if (thumb.length) {
					var thumbWrapper = jQuery("<li/>").addClass("thumbWrapper").append(thumb);

					thumbWrapper.data("idx", x);

					thumbWrapper.on("click", function () {
						var idx = $("img", this).data("globalindex");
						jQuery.thumbGrid.drawSlideShow(grid, idx);
					});

					if (applyEffect) {
						thumbWrapper.css({opacity: 0});
						var transitionIn = jQuery.normalizeCss(jQuery.thumbGrid.transitions[grid.nav_effect].in);
						thumbWrapper.css(transitionIn);
					} else {
						var displayProperties = jQuery.normalizeCss({top: 0, left: 0, opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, skew: 0, filter: " blur(0)"});
						thumbWrapper.css(displayProperties).show();
					}

					$page.append(thumbWrapper);
					$page.addClass("active");

				} else {
					break;
				}
			}

			if (applyEffect)
				$page.addClass("in");

			$grid.find(".thumb-grid").addClass("out").removeClass("in");

			$grid.prepend($page);

			setTimeout(function () {

				var displayProperties = {top: 0, left: 0, opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, skew: 0, filter: " blur(0)"};

				var delayIn = grid.nav_delay;
				for (var i = 0; i < jQuery(".in .thumbWrapper", $grid).length; i++) {
					var elIn = jQuery(".in .thumbWrapper", $grid).eq(i);

					elIn.CSSAnimate(displayProperties, grid.nav_timing, delayIn, "cubic-bezier(0.19, 1, 0.22, 1)", function () {});
					delayIn += grid.nav_delay;

				}

				var delayOut = grid.nav_delay;
				for (var ii = 0; ii < jQuery(".out .thumbWrapper", $grid).length; ii++) {
					var elOut = jQuery(".out .thumbWrapper", $grid).eq(ii);
					var transitionOut = jQuery.thumbGrid.transitions[grid.nav_effect].out;

					grid.nav.addClass("waiting");

					elOut.CSSAnimate(transitionOut, grid.nav_timing, delayOut, "cubic-bezier(0.19, 1, 0.22, 1)", function () {

						if ($(this).index() == jQuery(".out .thumbWrapper", $grid).length - 1) {
							jQuery(".out", $grid).remove();
							grid.isAnimating = false;
							grid.nav.removeClass("waiting");
						}

					});
					delayOut += grid.nav_delay;
				}

				$grid.fadeIn();

				if (!applyEffect) {
					grid.height = $page.height();
					$grid.height(grid.height);
					jQuery.thumbGrid.buildIndex(grid);
					grid.isAnimating = false;

					if (typeof grid.nav != "undefined")
						grid.nav.show();
				}

			}, 100);

			jQuery(window).on("resize.thumbGrid", function () {
				grid.height = $page.height();
				$grid.height(grid.height);
			});
		},

		buildIndex: function (el) {
			var grid = el;
			var $grid = jQuery(grid);
			var nav = jQuery("<nav/>").addClass("thumbGridNav");

			if (grid.totPages <= 1)
				return;

			for (var x = 1; x <= grid.totPages; x++) {
				var idxPlaceHolder = jQuery("<a/>").html(x).attr({idx: (x - 1)});
				idxPlaceHolder.addClass("indexEl");
				idxPlaceHolder.on("click", function () {

					if (grid.isAnimating || grid.pageIndex == jQuery(this).attr("idx"))
						return;

					grid.pageIndex = jQuery(this).attr("idx");
					jQuery.thumbGrid.drawPage(grid, grid.pageIndex);

					jQuery(".indexEl", nav).removeClass("sel");
					jQuery(".indexEl", nav).eq(grid.pageIndex).addClass("sel");
				});

				nav.append(idxPlaceHolder);
				jQuery(".indexEl", nav).eq(grid.pageIndex).addClass("sel");

			}
			nav.hide();

			grid.nav = nav;

			$grid.after(nav);

		},

		drawSlideShow: function (el, idx) {

			jQuery("body").trigger("drawSlideShow");
			jQuery("body").css({overflow: "hidden"});

			var grid = el,
					$grid = jQuery(grid),
					overlay = jQuery("<div/>").addClass("tg-overlay").css({opacity: 0}),
					placeHolder = jQuery("<div/>").addClass("tg-placeHolder"),
					slideShowClose = jQuery("<div/>").addClass("tg-close tg-icon").on("click", function () {jQuery.thumbGrid.closeSlideShow(el, idx)}),
					slideShowNext = jQuery("<div/>").addClass("tg-next tg-icon").on("click", function () {slideShow.next()}),
					slideShowPrev = jQuery("<div/>").addClass("tg-prev tg-icon").on("click", function () {slideShow.prev()}),
					spinnerPh = jQuery("<div/>").addClass("tg-spinner"),
					$origin = $grid.find("[data-globalindex=" + idx + "]").parent("li"),
					pHleft = $origin.offset().left - jQuery(window).scrollLeft(),
					pHtop = $origin.offset().top - jQuery(window).scrollTop(),
					pHwidth = $origin.outerWidth(),
					pHheight = $origin.outerHeight();


			grid.nav_effect = $grid.data("nav_effect") || "fade";
			grid.nav_delay = $grid.data("nav_delay") || 500;
			grid.nav_timing = $grid.data("nav_timing") || 1000;

			grid.slideShowIdx = idx;

			placeHolder.css({position: "fixed", left: pHleft, top: pHtop, width: pHwidth, height: pHheight});
			overlay.append(placeHolder).append(slideShowClose).append(spinnerPh).append(slideShowNext).append(slideShowPrev);

			jQuery(".tg-icon", overlay).css({opacity: 0});

			var spinnerOpts = {
				lines    : 11, // The number of lines to draw
				length   : 6, // The length of each line
				width    : 6, // The line thickness
				radius   : 16, // The radius of the inner circle
				corners  : 1, // Corner roundness (0..1)
				rotate   : 16, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color    : '#fff', // #rgb or #rrggbb or array of colors
				speed    : 1.3, // Rounds per second
				trail    : 52, // Afterglow percentage
				shadow   : false, // Whether to render a shadow
				hwaccel  : false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex   : 2e9, // The z-index (defaults to 2000000000)
				top      : '50%', // Top position relative to parent
				left     : '50%' // Left position relative to parent
			};

			var target = spinnerPh.get(0),
					spinner;

			spinner = new Spinner(spinnerOpts).spin(target);
			spinnerPh.hide();
			//spinnerPh.delay(800).fadeIn(1000);

			var slideShow = {
				effect    : grid.nav_effect,
				effectNext: grid.gallery_effectnext || grid.nav_effect,
				effectPrev: grid.gallery_effectprev || grid.nav_effect,

				init: function () {
					slideShow.goTo(false);
					slideShow.keyboard(true);
					grid.isAnimating = false;
				},

				keyboard: function (on) {

					if (on) {
						jQuery(document).on("keydown.thumbGallery", function (e) {

							switch (e.keyCode) {

								case 27: //Esc
									jQuery.thumbGrid.closeSlideShow(el, idx);
									e.preventDefault();
									break;

								case 32: //space
//									jQuery.thumbGrid.closeSlideShow(el, idx);
									e.preventDefault();
									break;

								case 39: //arrow right
									slideShow.next();
									e.preventDefault();
									break;

								case 37: //arrow left
									slideShow.prev();
									e.preventDefault();
									break;
							}
						});

						jQuery("body").on("closeSlideShow", function () {slideShow.keyboard(false);});

					} else {
						jQuery(document).off("keydown.thumbGallery");
					}
				},

				goTo: function (animate) {

					var oldImgWrapper = jQuery(".tg-img-wrapper", placeHolder).eq(0);

					var idx = grid.slideShowIdx,
							imagesList = grid.elements,
							image = $(imagesList[idx]),
							imgWrapper = jQuery("<div/>").addClass("tg-img-wrapper"),
							imageToShowURL = image.data("highres"),
							imageCaption = image.data("caption"),
							imgContainer = jQuery("<div/>").addClass("tg-img-container");
					imgContainer.css({position: "absolute", top: 0, left: 0, bottom: 0, right: 0, width: grid.gallery_fullscreenw, height: grid.gallery_fullscreenh, margin: "auto"});
					imgWrapper.append(imgContainer);

					placeHolder.prepend(imgWrapper);

					imgWrapper.addClass("in");

					var img = jQuery("<img/>");

					var displayProperties = {top: 0, left: 0, opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, skew: 0, filter: "blur(0)"};

					if (animate) {
						imgWrapper.css(jQuery.normalizeCss(jQuery.thumbGrid.transitions[slideShow.effect].in));
						slideShow.spinner = setTimeout(function () {
							spinner = new Spinner(spinnerOpts).spin(target);
							spinnerPh.fadeIn(300);
						}, 1000)
					} else {
						displayProperties = jQuery.normalizeCss(displayProperties);
						imgWrapper.css(displayProperties);
						imgWrapper.css({opacity: 0});
					}

					img.one("load", function () {

						if (this.loaded)
							return;

						this.loaded = true;

						if (animate) {
							imgWrapper.css(jQuery.normalizeCss(jQuery.thumbGrid.transitions[slideShow.effect].in));
						} else {
							displayProperties = jQuery.normalizeCss(displayProperties);
							imgWrapper.css(displayProperties);
							imgWrapper.css({opacity: 0});
						}

						clearTimeout(slideShow.spinner);
						spinnerPh.fadeOut(300, function () {spinnerPh.empty();});

						imgContainer.css({
							backgroundImage   : "url(" + imageToShowURL + ")",
							backgroundSize    : grid.gallery_cover ? "cover" : "contain",
							backgroundPosition: "center center",
							backgroundRepeat  : "no-repeat"
						});

						var imageIndex = jQuery("<span/>").addClass("tg-img-index").html((idx + 1) + "/" + imagesList.length + " ");
						var captionLabel = jQuery("<label/>").html(imageCaption).prepend(imageIndex);

						if (imageCaption)
							imgContainer.append(captionLabel);

						if (animate)
							grid.isAnimating = true;

						setTimeout(function () {
							imgWrapper.CSSAnimate(displayProperties, grid.opt.gallery_timing, 50, "cubic-bezier(0.19, 1, 0.22, 1)", function () {});
							oldImgWrapper.CSSAnimate(jQuery.thumbGrid.transitions[slideShow.effect].out, grid.opt.gallery_timing, 80, "cubic-bezier(0.19, 1, 0.22, 1)", function () {
								grid.isAnimating = false;
								oldImgWrapper.removeClass("in");
								jQuery(".tg-img-wrapper", placeHolder).not(".in").remove();
							});
						}, 100);

					}).attr({src: imageToShowURL});
				},

				next: function () {

					slideShow.effect = slideShow.effectNext;

					if (grid.isAnimating && jQuery.browser.msie)
						return;

					var imagesList = grid.elements;
					++grid.slideShowIdx;
					if (grid.slideShowIdx == $(imagesList).length) {
						grid.slideShowIdx = 0;
					}
					slideShow.goTo(true);
				},

				prev: function () {

					slideShow.effect = slideShow.effectPrev;

					if (grid.isAnimating && jQuery.browser.msie)
						return;

					var imagesList = grid.elements;
					--grid.slideShowIdx;
					if (grid.slideShowIdx == -1) {
						grid.slideShowIdx = $(imagesList).length - 1;
					}
					slideShow.goTo(true);
				}

			};

			jQuery("body").append(overlay);
			overlay.CSSAnimate({opacity: 1}, 600, 0, function () {

				placeHolder.CSSAnimate({width: "100%", height: "100%", left: 0, top: 0, opacity: 1}, 400, 0, "cubic-bezier(.8,.07,.98,.06)", function () {
					slideShow.init(grid);
					jQuery(".tg-icon", overlay).fadeTo(200, 1);
				})

			});

		},

		closeSlideShow: function (el, idx) {

			jQuery("body").trigger("closeSlideShow");

			var grid = el,
					$grid = jQuery(grid),
					origin = $grid.find("[data-globalindex=" + idx + "]").parents("li"),
					pHleft = origin.offset().left - jQuery(window).scrollLeft(),
					pHtop = origin.offset().top - jQuery(window).scrollTop(),
					pHwidth = origin.outerWidth(),
					pHheight = origin.outerHeight();

			jQuery(".tg-icon").fadeTo(200, 0);
			jQuery(".tg-placeHolder > div").fadeOut(500);
			jQuery(".tg-placeHolder").CSSAnimate({width: pHwidth, height: pHheight, left: pHleft, top: pHtop, opacity: 1}, 800, 400, "cubic-bezier(0.19, 1, 0.22, 1)", function () {
				jQuery(".tg-overlay").CSSAnimate({opacity: 0}, 600, function () {
					$(this).remove();
					jQuery("body").css({overflow: "auto"});
				});
			});
		}
	};

	jQuery.fn.thumbGrid = jQuery.thumbGrid.init;

})(jQuery);

//fgnass.github.com/spin.js#v2.0.1
!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+100*(c/d),g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return l[e]||(m.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",m.cssRules.length),l[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<k.length;d++)if(c=k[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}m.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k=["webkit","Moz","ms","O"],l={},m=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),n={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",position:"absolute"};h.defaults={},f(h.prototype,{spin:function(b){this.stop();var c=this,d=c.opts,f=c.el=e(a(0,{className:d.className}),{position:d.position,width:0,zIndex:d.zIndex});if(d.radius+d.length+d.width,e(f,{left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var o=e(a("group"),{behavior:"url(#default#VML)"});return!d(o,"transform")&&o.adj?i():j=d(o,"animation"),h});
