/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: jquery.mb.thumbGallery.src.js                                                                                                              _
 _ last modified: 24/05/15 21.53                                                                                                                    _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matteo@open-lab.com                                                                                                                       _
 _ site: http://pupunzi.com                                                                                                                         _
 _       http://open-lab.com                                                                                                                        _
 _ blog: http://pupunzi.open-lab.com                                                                                                                _
 _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
 _                                                                                                                                                  _
 _ Licences: MIT, GPL                                                                                                                               _
 _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
 _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
 _                                                                                                                                                  _
 _ Copyright (c) 2001-2015. Matteo Bicocchi (Pupunzi);                                                                                              _
 ___________________________________________________________________________________________________________________________________________________*/

/**
 *
 * @type {{name: string, version: string, build: string, author: string, defaults: {nav_effect: string, nav_delay: number, nav_timing: number, nav_pagination: number, display_nav: boolean, gallery_effectnext: string, gallery_effectprev: string, gallery_timing: number, gallery_cover: boolean, gallery_fullscreenw: string, gallery_fullscreenh: string, showIndexinFullscreen: boolean, ease: string, onSlide: onSlide, onFullScreen: onFullScreen, onExitFullScreen: onExitFullScreen, onFullscreenChange: onFullscreenChange}, transitions: {fade: {in: {opacity: number}, out: {opacity: number}}, slideUp: {in: {opacity: number}, out: {y: number, opacity: number}}, slideDown: {in: {opacity: number}, out: {y: number, opacity: number}}, slideLeft: {in: {opacity: number}, out: {x: number, opacity: number}, ease: string}, slideRight: {in: {opacity: number}, out: {x: number, opacity: number}, ease: string}, slideInverse: {in: {y: number, opacity: number}, out: {y: number, opacity: number}}, zoomIn: {in: {scale: number, opacity: number}, out: {scale: number, opacity: number}}, zoomOut: {in: {scale: number, opacity: number}, out: {scale: number, opacity: number}}, rotate: {in: {opacity: number}, out: {rotate: number, opacity: number}}, mobSlideLeft: {in: {opacity: number}, out: {x: number, opacity: number}, ease: string}, mobSlideRight: {in: {opacity: number}, out: {x: number, opacity: number}, ease: string}}, events: {start: string, move: string, end: string}, init: init, drawPage: drawPage, nextPage: nextPage, prevPage: prevPage, buildIndex: buildIndex, drawSlideShow: drawSlideShow, closeSlideShow: closeSlideShow}}
 */
jQuery.thumbGrid = {

	name   : "jquery.mb.thumbGrid",
	version: "{{ version }}",
	build  : "{{ build }}",
	author : "Matteo Bicocchi",

	defaults: {
		nav_effect           : "slideLeft",
		nav_delay            : 60,
		nav_timing           : 800,
		nav_pagination       : 6,
		display_nav          : true,
		gallery_effectnext   : "slideRight",
		gallery_effectprev   : "slideLeft",
		gallery_timing       : 500,
		gallery_cover        : false,
		gallery_fullscreenw  : "100%",
		gallery_fullscreenh  : "100%",
		showIndexinFullscreen: false,
		ease                 : "cubic-bezier(0.19, 1, 0.22, 1)",
		aspectRatio          : 1.5,

		onSlide           : function (grid) {},
		onFullScreen      : function (grid) {},
		onExitFullScreen  : function (grid) {},
		onFullscreenChange: function (grid) {}
	},

	transitions: {
		fade        : {in: {opacity: 0}, out: {opacity: 0}},
		slideUp     : {in: {opacity: 0}, out: {y: -200, opacity: 0}},
		slideDown   : {in: {opacity: 0}, out: {y: 200, opacity: 0}},
		slideLeft   : {in: {opacity: 0}, out: {x: -200, opacity: 0}, ease: "cubic-bezier(0,.01,1,1)"},
		slideRight  : {in: {opacity: 0}, out: {x: 200, opacity: 0}, ease: "cubic-bezier(0,.01,1,1)"},
		slideInverse: {in: {y: 200, opacity: 0}, out: {y: 200, opacity: 0}},
		zoomIn      : {in: {scale: .5, opacity: 0}, out: {scale: 2, opacity: 0}},
		zoomOut     : {in: {scale: 2, opacity: 0}, out: {scale: .1, opacity: 0}},
		rotate      : {in: { opacity: 0}, out: {rotate: 179, opacity: 0}},

		mobSlideLeft : {in: {opacity: 0}, out: {x: -200, opacity: 0}, ease: "cubic-bezier(0,.01,1,1)"},
		mobSlideRight: {in: {opacity: 0}, out: {x: 200, opacity: 0}, ease: "cubic-bezier(0,.01,1,1)"}

	},

	events: {
		start: jQuery.isMobile ? "touchstart" : "mousedown",
		move : jQuery.isMobile ? "touchmove" : "mousemove",
		end  : jQuery.isMobile ? "click" : "click"
	},

	/**
	 *
	 * @param options
	 * @returns {*}
	 */
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
			grid.nav_pagination = typeof $grid.data("nav_pagination") != "undefined" ?  $grid.data("nav_pagination") : opt.nav_pagination;
			grid.nav_pagination = jQuery.isMobile && !jQuery.isTablet ? 1 : grid.nav_pagination;
			grid.gallery_fullscreenw = $grid.data("gallery_fullscreenw") || opt.gallery_fullscreenw;
			grid.gallery_fullscreenh = $grid.data("gallery_fullscreenh") || opt.gallery_fullscreenh;
			grid.gallery_cover = $grid.data("gallery_cover") || opt.gallery_cover;
			grid.gallery_effectnext = $grid.data("gallery_effectnext") || grid.nav_effect;
			grid.gallery_effectprev = $grid.data("gallery_effectprev") || grid.nav_effect;
			grid.gallery_timing = $grid.data("gallery_timing") || 1000;
			grid.display_nav = typeof $grid.data("display_nav") != "undefined" ? $grid.data("display_nav") : opt.display_nav;

			jQuery.extend(opt, $grid.data());

			grid.opt = opt;

			grid.elements = $grid.children().clone(true);
			$grid.children().hide();


			if (grid.nav_pagination == 0)
				grid.nav_pagination = grid.elements.length;

			grid.elements.each(function (i) {
				jQuery(this).attr("data-globalindex", i);
			});

			grid.pages = [];

			grid.totPages = Math.ceil(grid.elements.length / grid.nav_pagination);

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
			jQuery(window).resize();
		})
	},

	/**
	 *
	 * @param el
	 * @param pageIdx
	 * @param applyEffect
	 */
	drawPage: function (el, pageIdx, applyEffect) {

		if (typeof applyEffect === "undefined")
			applyEffect = true;

		var grid = el;
		var $grid = jQuery(grid);

		if (!jQuery.isMobile)
			grid.nav_effect = $grid.data("nav_effect") || "fade";

		grid.nav_delay = $grid.data("nav_delay") || 100;
		grid.nav_timing = $grid.data("nav_timing") || 1000;
		grid.isAnimating = true;

		var pageElements = grid.pages[pageIdx];
		var $page = jQuery("<ul/>").addClass("thumb-grid");

		grid.setThumbsize = function (el) {

			if (!$grid.is(":visible")) {

				$grid.css({opacity: 0}).show();
				grid.width = $grid.outerWidth();
				$grid.hide().css({opacity: 1});

			} else {

				grid.width = $grid.outerWidth();

			}

			var w = (grid.width / grid.nav_pagination) - (grid.nav_pagination == 1 ? 0 : 10);

			if (grid.nav_pagination > 4)
				w = ((grid.width * 2) / grid.nav_pagination ) - 10;

			if (grid.nav_pagination > 8)
				w = ((grid.width * 2.5) / grid.nav_pagination ) - 10;

			if (grid.width < 600 && grid.nav_pagination > 3)
				w = (grid.width / 2) - 10;

			var h = w / grid.opt.aspectRatio;

			el.each(function () {
				jQuery(this).css({width: w, height: h});
			});
			return {w: w, h: h};
		};

		for (var x = 0; x < grid.nav_pagination; x++) {

			var thumb = jQuery(pageElements[x]);
			var thumb_box = jQuery("<div/>").addClass("thumb_box");
			var thumb_src = jQuery(pageElements[x]).attr("src");
			thumb_box.css({backgroundImage: "url(" + thumb_src + ")", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center"});

			thumb_box.attr({
				"data-type"       : thumb.data("type") || "image",
				"data-highres"    : thumb.data("highres"),
				"data-globalindex": thumb.data("globalindex")
			});

			thumb_box.css({width: "100%", height: "100%"});

			if (thumb.length) {
				var thumbWrapper = jQuery("<li/>").addClass("thumbWrapper").append(thumb_box);
				thumbWrapper.data("idx", x);

				thumbWrapper.on(jQuery.thumbGrid.events.end, function () {
					var idx = jQuery(".thumb_box", this).data("globalindex");
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

		grid.setThumbsize(jQuery(".thumbWrapper", $page));
		jQuery(window).off("resize.thumbgallery").on("resize.thumbgallery", function () {
			grid.setThumbsize(jQuery(".thumbWrapper", $page));
		});

		if (applyEffect)
			$page.addClass("in");

		$grid.find(".thumb-grid").addClass("out").removeClass("in");

		$grid.prepend($page);

		if (jQuery.isMobile) {

			$page.swipe({

				allowPageScroll  : "auto",
				threshold        : 75,
				triggerOnTouchEnd: false,

				swipeStatus: function (event, phase, direction, distance) {

					if (grid.isAnimating)
						return;

					if (phase == "end") {

						event.preventDefault();
						event.stopPropagation();

						if (direction == "left") {

							grid.nav_effect = "mobSlideLeft";
							jQuery.thumbGrid.nextPage(grid);

						} else if (direction == "right") {
							grid.nav_effect = "mobSlideRight";
							jQuery.thumbGrid.prevPage(grid);
						}

						return false;
					}
				}
			});

		}

		var ease = jQuery.thumbGrid.transitions[grid.nav_effect].ease || grid.opt.ease;

		setTimeout(function () {

			var displayProperties = {top: 0, left: 0, opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, skew: 0, filter: " blur(0)"};

			var delayIn = grid.nav_delay;
			for (var i = 0; i < jQuery(".in .thumbWrapper", $grid).length; i++) {
				var elIn = jQuery(".in .thumbWrapper", $grid).eq(i);

				elIn.CSSAnimate(displayProperties, grid.nav_timing, delayIn, ease, function () {});
				delayIn += grid.nav_delay;

			}

			var delayOut = grid.nav_delay;
			for (var ii = 0; ii < jQuery(".out .thumbWrapper", $grid).length; ii++) {
				var elOut = jQuery(".out .thumbWrapper", $grid).eq(ii);
				var transitionOut = jQuery.thumbGrid.transitions[grid.nav_effect].out;

				grid.nav.addClass("waiting");

				elOut.CSSAnimate(transitionOut, grid.nav_timing, delayOut, ease, function () {

					if (jQuery(this).index() == jQuery(".out .thumbWrapper", $grid).length - 1) {
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

				if (typeof grid.nav != "undefined" && grid.display_nav)
					grid.nav.show();
			}

		}, 50);

		jQuery(window).on("resize.thumbGrid", function () {
			grid.height = $page.height();
			$grid.height(grid.height);
		});

		if (typeof grid.opt.onSlide == "function") {
			grid.opt.onSlide(grid)
		}
	},

	/**
	 *
	 * @param grid
	 */
	nextPage: function (grid) {

		++grid.pageIndex;

		if (grid.pageIndex > grid.totPages - 1)
			grid.pageIndex = 0;

		jQuery.thumbGrid.drawPage(grid, grid.pageIndex, true);

		if (!grid.nav.length)
			return;

		jQuery(".indexEl", grid.nav).removeClass("sel");
		jQuery(".indexEl", grid.nav).eq(grid.pageIndex).addClass("sel");

	},

	/**
	 *
	 * @param grid
	 */
	prevPage: function (grid) {

		--grid.pageIndex;

		if (grid.pageIndex < 0)
			grid.pageIndex = grid.totPages - 1;

		jQuery.thumbGrid.drawPage(grid, grid.pageIndex, true);

		if (!grid.nav.length)
			return;

		jQuery(".indexEl", grid.nav).removeClass("sel");
		jQuery(".indexEl", grid.nav).eq(grid.pageIndex).addClass("sel");

	},

	/**
	 *
	 * @param grid
	 */
	buildIndex: function (grid) {
		var grid = grid;
		var $grid = jQuery(grid);
		var nav = jQuery("<nav/>").addClass("thumbGridNav");

		if (grid.totPages <= 1)
			return;

		for (var x = 1; x <= grid.totPages; x++) {
			var idxPlaceHolder = jQuery("<a/>").html(x).attr({idx: (x - 1)});
			idxPlaceHolder.addClass("indexEl");
			idxPlaceHolder.on(jQuery.thumbGrid.events.end, function () {

				var pageIndex = jQuery(this).attr("idx");

				if (grid.isAnimating || grid.pageIndex == pageIndex)
					return;

				if (jQuery.isMobile) {
					if (pageIndex < grid.pageIndex)
						grid.nav_effect = "mobSlideLeft";
					else
						grid.nav_effect = "mobSlideRight";
				}

				grid.pageIndex = pageIndex;
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

	/**
	 *
	 * @param el
	 * @param idx
	 */
	drawSlideShow: function (el, idx) {

		jQuery("body").css({overflow: "hidden"}).trigger("drawSlideShow");

		var grid = el,
				$grid = jQuery(grid),
				overlay = jQuery("<div/>").addClass("tg-overlay").css({opacity: 0}),
				placeHolder = jQuery("<div/>").addClass("tg-placeHolder"),
				slideShowClose = jQuery("<div/>").addClass("tg-close tg-icon").on(jQuery.thumbGrid.events.end, function () {jQuery.thumbGrid.closeSlideShow(el, idx)}),
				slideShowNext = jQuery("<div/>").addClass("tg-next tg-icon").on(jQuery.thumbGrid.events.end, function () {slideShow.next()}),
				slideShowPrev = jQuery("<div/>").addClass("tg-prev tg-icon").on(jQuery.thumbGrid.events.end, function () {slideShow.prev()}),
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

				if (typeof grid.opt.onFullScreen == "function") {
					grid.opt.onFullScreen(grid);
				}

			},

			/**
			 *
			 * @param on
			 */
			keyboard: function (on) {

				if (on) {
					jQuery(document).on("keydown.thumbGallery", function (e) {

						switch (e.keyCode) {

							case 27: //Esc
								jQuery.thumbGrid.closeSlideShow(el, idx);
								e.preventDefault();
								break;

							case 32: //space
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

			/**
			 *
			 * @param animate
			 */
			goTo: function (animate) {

				var oldImgWrapper = jQuery(".tg-img-wrapper", placeHolder).eq(0);

				var idx = grid.slideShowIdx,
						contentType = jQuery(grid.elements[idx]).data("type") || "image",
						imagesList = grid.elements,
						image = jQuery(imagesList[idx]),
						imgWrapper = jQuery("<div/>").addClass("tg-img-wrapper"),
						imageToShowURL = image.data("highres"),
						videoToShowURL = image.data("videourl"),
						contentToShowID = image.data("contentid"),
						imageCaption = jQuery("<span/>").addClass("tg-img-caption").html(image.data("caption")),
						imgContainer = jQuery("<div/>").addClass("tg-img-container"),
						content;

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


				function showContent() {
					if (animate) {
						imgWrapper.css(jQuery.normalizeCss(jQuery.thumbGrid.transitions[slideShow.effect].in));
					} else {
						displayProperties = jQuery.normalizeCss(displayProperties);
						imgWrapper.css(displayProperties);
						imgWrapper.css({opacity: 0});
					}

					clearTimeout(slideShow.spinner);
					spinnerPh.fadeOut(300, function () {spinnerPh.empty();});

					var imageIndex = grid.opt.showIndexinFullscreen ? jQuery("<span/>").addClass("tg-image-index").html((idx + 1) + "/" + imagesList.length + " ") : "";
					var captionLabel = jQuery("<label/>").html(imageCaption).prepend(imageIndex);

					if (image.data("caption"))
						imgContainer.append(captionLabel);

					if (animate)
						grid.isAnimating = true;

					setTimeout(function () {
						imgWrapper.CSSAnimate(displayProperties, grid.opt.gallery_timing, 50, grid.opt.ease, function () {});
						oldImgWrapper.CSSAnimate(jQuery.thumbGrid.transitions[slideShow.effect].out, grid.opt.gallery_timing, 80, grid.opt.ease, function () {
							grid.isAnimating = false;
							oldImgWrapper.removeClass("in");
							jQuery(".tg-img-wrapper", placeHolder).not(".in").remove();
						});
					}, 100);

				}

				if (contentType == "image") {

					img.one("load", function () {

						if (this.loaded)
							return;

						this.loaded = true;

						showContent();
						imgContainer.css({
							backgroundImage   : "url(" + imageToShowURL + ")",
							backgroundSize    : grid.gallery_cover && !jQuery.isMobile ? "cover" : "contain",
							backgroundPosition: "center center",
							backgroundRepeat  : "no-repeat"
						});

					}).attr({src: imageToShowURL});

				} else if (contentType == "video") {

					showContent();
					content = jQuery("<iframe/>").attr("src", videoToShowURL);
					content.css({width: "100%", height: 300, marginTop: 50, border: "none"});
					imgContainer.html(content);

				} else {

					showContent();
					content = jQuery("#" + contentToShowID).clone(true);
					content.css({width: "100%", height: "100%"});
					imgContainer.html(content);
				}

			},

			/**
			 *
			 *
			 */
			next: function () {

				slideShow.effect = slideShow.effectNext;

				if (grid.isAnimating && jQuery.browser.msie)
					return;

				var imagesList = grid.elements;
				++grid.slideShowIdx;
				if (grid.slideShowIdx == jQuery(imagesList).length) {
					grid.slideShowIdx = 0;
				}
				slideShow.goTo(true);
			},

			/**
			 *
			 */
			prev: function () {

				slideShow.effect = slideShow.effectPrev;

				if (grid.isAnimating && jQuery.browser.msie)
					return;

				var imagesList = grid.elements;
				--grid.slideShowIdx;
				if (grid.slideShowIdx == -1) {
					grid.slideShowIdx = jQuery(imagesList).length - 1;
				}
				slideShow.goTo(true);
			}

		};

		if (jQuery.isMobile) {

			slideShow.effectNext = "mobSlideLeft";
			slideShow.effectPrev = "mobSlideRight";

			overlay.swipe({
				allowPageScroll  : "auto",
				threshold        : 75,
				triggerOnTouchEnd: false,

				swipeStatus: function (event, phase, direction, distance) {

					if (grid.isAnimating)
						return;

					if (phase == "end") {

						if (direction == "left") {
							slideShow.next();
						} else {
							slideShow.prev();
						}

						if (typeof grid.opt.onFullscreenChange == "function")
							grid.opt.onFullscreenChange(grid)
					}

				},
				swipe      : function (event, direction, distance, duration, fingerCount, fingerData) {}

			});

		}

		jQuery("body").append(overlay);
		overlay.CSSAnimate({opacity: 1}, 600, 300, function () {

			placeHolder.CSSAnimate({width: "100%", height: "100%", left: 0, top: 0, opacity: 1}, 400, 0, grid.opt.ease, function () {
				slideShow.init(grid);
				jQuery(".tg-icon", overlay).fadeTo(200, 1);

			})

		});

	},

	/**
	 *
	 * @param el
	 * @param idx
	 */
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
		jQuery(".tg-placeHolder").CSSAnimate({width: pHwidth, height: pHheight, left: pHleft, top: pHtop, opacity: 1}, 800, 400, grid.opt.ease, function () {
			jQuery(".tg-overlay").CSSAnimate({opacity: 0}, 600, function () {
				jQuery(this).remove();
				jQuery("body").css({overflow: "auto"});
			});
		});

		if (typeof grid.opt.onExitFullScreen == "function") {
			grid.opt.onExitFullScreen(grid);
		}

	}
};

jQuery.fn.thumbGrid = jQuery.thumbGrid.init;
