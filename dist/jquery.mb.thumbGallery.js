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
	version: "1.3.1",
	build  : "555",
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
;
/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.CSSAnimate.min.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 26/03/14 21.40
 *  *****************************************************************************
 */

function uncamel(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function setUnit(a,b){return"string"!=typeof a||a.match(/^[\-0-9\.]+jQuery/)?""+a+b:a}function setFilter(a,b,c){var d=uncamel(b),e=jQuery.browser.mozilla?"":jQuery.CSS.sfx;a[e+"filter"]=a[e+"filter"]||"",c=setUnit(c>jQuery.CSS.filters[b].max?jQuery.CSS.filters[b].max:c,jQuery.CSS.filters[b].unit),a[e+"filter"]+=d+"("+c+") ",delete a[b]}jQuery.support.CSStransition=function(){var a=document.body||document.documentElement,b=a.style;return void 0!==b.transition||void 0!==b.WebkitTransition||void 0!==b.MozTransition||void 0!==b.MsTransition||void 0!==b.OTransition}(),jQuery.CSS={name:"mb.CSSAnimate",author:"Matteo Bicocchi",version:"2.0.0",transitionEnd:"transitionEnd",sfx:"",filters:{blur:{min:0,max:100,unit:"px"},brightness:{min:0,max:400,unit:"%"},contrast:{min:0,max:400,unit:"%"},grayscale:{min:0,max:100,unit:"%"},hueRotate:{min:0,max:360,unit:"deg"},invert:{min:0,max:100,unit:"%"},saturate:{min:0,max:400,unit:"%"},sepia:{min:0,max:100,unit:"%"}},normalizeCss:function(a){var b=jQuery.extend(!0,{},a);jQuery.browser.webkit||jQuery.browser.opera?jQuery.CSS.sfx="-webkit-":jQuery.browser.mozilla?jQuery.CSS.sfx="-moz-":jQuery.browser.msie&&(jQuery.CSS.sfx="-ms-");for(var c in b){"transform"===c&&(b[jQuery.CSS.sfx+"transform"]=b[c],delete b[c]),"transform-origin"===c&&(b[jQuery.CSS.sfx+"transform-origin"]=a[c],delete b[c]),"filter"!==c||jQuery.browser.mozilla||(b[jQuery.CSS.sfx+"filter"]=a[c],delete b[c]),"blur"===c&&setFilter(b,"blur",a[c]),"brightness"===c&&setFilter(b,"brightness",a[c]),"contrast"===c&&setFilter(b,"contrast",a[c]),"grayscale"===c&&setFilter(b,"grayscale",a[c]),"hueRotate"===c&&setFilter(b,"hueRotate",a[c]),"invert"===c&&setFilter(b,"invert",a[c]),"saturate"===c&&setFilter(b,"saturate",a[c]),"sepia"===c&&setFilter(b,"sepia",a[c]);var d="";"x"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" translateX("+setUnit(a[c],"px")+")",delete b[c]),"y"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" translateY("+setUnit(a[c],"px")+")",delete b[c]),"z"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" translateZ("+setUnit(a[c],"px")+")",delete b[c]),"rotate"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" rotate("+setUnit(a[c],"deg")+")",delete b[c]),"rotateX"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" rotateX("+setUnit(a[c],"deg")+")",delete b[c]),"rotateY"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" rotateY("+setUnit(a[c],"deg")+")",delete b[c]),"rotateZ"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" rotateZ("+setUnit(a[c],"deg")+")",delete b[c]),"scale"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" scale("+setUnit(a[c],"")+")",delete b[c]),"scaleX"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" scaleX("+setUnit(a[c],"")+")",delete b[c]),"scaleY"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" scaleY("+setUnit(a[c],"")+")",delete b[c]),"scaleZ"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" scaleZ("+setUnit(a[c],"")+")",delete b[c]),"skew"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" skew("+setUnit(a[c],"deg")+")",delete b[c]),"skewX"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" skewX("+setUnit(a[c],"deg")+")",delete b[c]),"skewY"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" skewY("+setUnit(a[c],"deg")+")",delete b[c]),"perspective"===c&&(d=jQuery.CSS.sfx+"transform",b[d]=b[d]||"",b[d]+=" perspective("+setUnit(a[c],"px")+")",delete b[c])}return b},getProp:function(a){var b=[];for(var c in a)b.indexOf(c)<0&&b.push(uncamel(c));return b.join(",")},animate:function(a,b,c,d,e){return this.each(function(){function o(){f.called=!0,f.CSSAIsRunning=!1,g.off(jQuery.CSS.transitionEnd+"."+f.id),clearTimeout(f.timeout),g.css(jQuery.CSS.sfx+"transition",""),"function"==typeof e&&e.apply(f),"function"==typeof f.CSSqueue&&(f.CSSqueue(),f.CSSqueue=null)}var f=this,g=jQuery(this);f.id=f.id||"CSSA_"+(new Date).getTime();var h=h||{type:"noEvent"};if(f.CSSAIsRunning&&f.eventType==h.type&&!jQuery.browser.msie&&jQuery.browser.version<=9)return f.CSSqueue=function(){g.CSSAnimate(a,b,c,d,e)},void 0;if(f.CSSqueue=null,f.eventType=h.type,0!==g.length&&a){if(a=jQuery.normalizeCss(a),f.CSSAIsRunning=!0,"function"==typeof b&&(e=b,b=jQuery.fx.speeds._default),"function"==typeof c&&(d=c,c=0),"string"==typeof c&&(e=c,c=0),"function"==typeof d&&(e=d,d="cubic-bezier(0.65,0.03,0.36,0.72)"),"string"==typeof b)for(var i in jQuery.fx.speeds){if(b==i){b=jQuery.fx.speeds[i];break}b=jQuery.fx.speeds._default}if(b||(b=jQuery.fx.speeds._default),"string"==typeof e&&(d=e,e=null),!jQuery.support.CSStransition){for(var j in a){if("transform"===j&&delete a[j],"filter"===j&&delete a[j],"transform-origin"===j&&delete a[j],"auto"===a[j]&&delete a[j],"x"===j){var k=a[j],l="left";a[l]=k,delete a[j]}if("y"===j){var k=a[j],l="top";a[l]=k,delete a[j]}("-ms-transform"===j||"-ms-filter"===j)&&delete a[j]}return g.delay(c).animate(a,b,e),void 0}var m={"default":"ease","in":"ease-in",out:"ease-out","in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};m[d]&&(d=m[d]),g.off(jQuery.CSS.transitionEnd+"."+f.id);var n=jQuery.CSS.getProp(a),p={};jQuery.extend(p,a),p[jQuery.CSS.sfx+"transition-property"]=n,p[jQuery.CSS.sfx+"transition-duration"]=b+"ms",p[jQuery.CSS.sfx+"transition-delay"]=c+"ms",p[jQuery.CSS.sfx+"transition-timing-function"]=d,setTimeout(function(){g.one(jQuery.CSS.transitionEnd+"."+f.id,o),g.css(p)},1),f.timeout=setTimeout(function(){return f.called||!e?(f.called=!1,f.CSSAIsRunning=!1,void 0):(g.css(jQuery.CSS.sfx+"transition",""),e.apply(f),f.CSSAIsRunning=!1,"function"==typeof f.CSSqueue&&(f.CSSqueue(),f.CSSqueue=null),void 0)},b+c+10)}})}},jQuery.fn.CSSAnimate=jQuery.CSS.animate,jQuery.normalizeCss=jQuery.CSS.normalizeCss,jQuery.fn.css3=function(a){return this.each(function(){var b=jQuery(this),c=jQuery.normalizeCss(a);b.css(c)})};
;/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.browser.min.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matteo@open-lab.com
 *  site: 	http://pupunzi.com
 *  blog:	http://pupunzi.open-lab.com
 * 	http://open-lab.com
 *
 *  Licences: MIT, GPL
 *  http://www.opensource.org/licenses/mit-license.php
 *  http://www.gnu.org/licenses/gpl.html
 *
 *  last modified: 26/03/14 21.43
 *  *****************************************************************************
 */

var nAgt=navigator.userAgent;if(!jQuery.browser){jQuery.browser={},jQuery.browser.mozilla=!1,jQuery.browser.webkit=!1,jQuery.browser.opera=!1,jQuery.browser.safari=!1,jQuery.browser.chrome=!1,jQuery.browser.msie=!1,jQuery.browser.ua=nAgt,jQuery.browser.name=navigator.appName,jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var nameOffset,verOffset,ix;if(-1!=(verOffset=nAgt.indexOf("Opera")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=nAgt.substring(verOffset+6),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8));else if(-1!=(verOffset=nAgt.indexOf("OPR")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=nAgt.substring(verOffset+4);else if(-1!=(verOffset=nAgt.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",jQuery.browser.fullVersion=nAgt.substring(verOffset+5);else if(-1!=nAgt.indexOf("Trident")){jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer";var start=nAgt.indexOf("rv:")+3,end=start+4;jQuery.browser.fullVersion=nAgt.substring(start,end)}else-1!=(verOffset=nAgt.indexOf("Chrome"))?(jQuery.browser.webkit=!0,jQuery.browser.chrome=!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=nAgt.substring(verOffset+7)):-1!=(verOffset=nAgt.indexOf("Safari"))?(jQuery.browser.webkit=!0,jQuery.browser.safari=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("AppleWebkit"))?(jQuery.browser.webkit=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("Firefox"))?(jQuery.browser.mozilla=!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=nAgt.substring(verOffset+8)):(nameOffset=nAgt.lastIndexOf(" ")+1)<(verOffset=nAgt.lastIndexOf("/"))&&(jQuery.browser.name=nAgt.substring(nameOffset,verOffset),jQuery.browser.fullVersion=nAgt.substring(verOffset+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName));-1!=(ix=jQuery.browser.fullVersion.indexOf(";"))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix)),-1!=(ix=jQuery.browser.fullVersion.indexOf(" "))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix)),jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10),isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10)),jQuery.browser.version=jQuery.browser.majorVersion}jQuery.browser.android=/Android/i.test(nAgt),jQuery.browser.blackberry=/BlackBerry|BB|PlayBook/i.test(nAgt),jQuery.browser.ios=/iPhone|iPad|iPod|webOS/i.test(nAgt),jQuery.browser.operaMobile=/Opera Mini/i.test(nAgt),jQuery.browser.windowsMobile=/IEMobile|Windows Phone/i.test(nAgt),jQuery.browser.kindle=/Kindle|Silk/i.test(nAgt),jQuery.browser.mobile=jQuery.browser.android||jQuery.browser.blackberry||jQuery.browser.ios||jQuery.browser.windowsMobile||jQuery.browser.operaMobile||jQuery.browser.kindle,jQuery.isMobile=jQuery.browser.mobile,jQuery.isTablet=jQuery.browser.mobile&&jQuery(window).width()>765,jQuery.isAndroidDefault=jQuery.browser.android&&!/chrome/i.test(nAgt);
;//fgnass.github.com/spin.js#v2.0.1

!function(a,b){"object"==typeof exports?module.exports=b():"function"==typeof define&&define.amd?define(b):a.Spinner=b()}(this,function(){"use strict";function a(a,b){var c,d=document.createElement(a||"div");for(c in b)d[c]=b[c];return d}function b(a){for(var b=1,c=arguments.length;c>b;b++)a.appendChild(arguments[b]);return a}function c(a,b,c,d){var e=["opacity",b,~~(100*a),c,d].join("-"),f=.01+100*(c/d),g=Math.max(1-(1-a)/b*(100-f),a),h=j.substring(0,j.indexOf("Animation")).toLowerCase(),i=h&&"-"+h+"-"||"";return l[e]||(m.insertRule("@"+i+"keyframes "+e+"{0%{opacity:"+g+"}"+f+"%{opacity:"+a+"}"+(f+.01)+"%{opacity:1}"+(f+b)%100+"%{opacity:"+a+"}100%{opacity:"+g+"}}",m.cssRules.length),l[e]=1),e}function d(a,b){var c,d,e=a.style;for(b=b.charAt(0).toUpperCase()+b.slice(1),d=0;d<k.length;d++)if(c=k[d]+b,void 0!==e[c])return c;return void 0!==e[b]?b:void 0}function e(a,b){for(var c in b)a.style[d(a,c)||c]=b[c];return a}function f(a){for(var b=1;b<arguments.length;b++){var c=arguments[b];for(var d in c)void 0===a[d]&&(a[d]=c[d])}return a}function g(a,b){return"string"==typeof a?a:a[b%a.length]}function h(a){this.opts=f(a||{},h.defaults,n)}function i(){function c(b,c){return a("<"+b+' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">',c)}m.addRule(".spin-vml","behavior:url(#default#VML)"),h.prototype.lines=function(a,d){function f(){return e(c("group",{coordsize:k+" "+k,coordorigin:-j+" "+-j}),{width:k,height:k})}function h(a,h,i){b(m,b(e(f(),{rotation:360/d.lines*a+"deg",left:~~h}),b(e(c("roundrect",{arcsize:d.corners}),{width:j,height:d.width,left:d.radius,top:-d.width>>1,filter:i}),c("fill",{color:g(d.color,a),opacity:d.opacity}),c("stroke",{opacity:0}))))}var i,j=d.length+d.width,k=2*j,l=2*-(d.width+d.length)+"px",m=e(f(),{position:"absolute",top:l,left:l});if(d.shadow)for(i=1;i<=d.lines;i++)h(i,-2,"progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");for(i=1;i<=d.lines;i++)h(i);return b(a,m)},h.prototype.opacity=function(a,b,c,d){var e=a.firstChild;d=d.shadow&&d.lines||0,e&&b+d<e.childNodes.length&&(e=e.childNodes[b+d],e=e&&e.firstChild,e=e&&e.firstChild,e&&(e.opacity=c))}}var j,k=["webkit","Moz","ms","O"],l={},m=function(){var c=a("style",{type:"text/css"});return b(document.getElementsByTagName("head")[0],c),c.sheet||c.styleSheet}(),n={lines:12,length:7,width:5,radius:10,rotate:0,corners:1,color:"#000",direction:1,speed:1,trail:100,opacity:.25,fps:20,zIndex:2e9,className:"spinner",top:"50%",left:"50%",position:"absolute"};h.defaults={},f(h.prototype,{spin:function(b){this.stop();var c=this,d=c.opts,f=c.el=e(a(0,{className:d.className}),{position:d.position,width:0,zIndex:d.zIndex});if(d.radius+d.length+d.width,e(f,{left:d.left,top:d.top}),b&&b.insertBefore(f,b.firstChild||null),f.setAttribute("role","progressbar"),c.lines(f,c.opts),!j){var g,h=0,i=(d.lines-1)*(1-d.direction)/2,k=d.fps,l=k/d.speed,m=(1-d.opacity)/(l*d.trail/100),n=l/d.lines;!function o(){h++;for(var a=0;a<d.lines;a++)g=Math.max(1-(h+(d.lines-a)*n)%l*m,d.opacity),c.opacity(f,a*d.direction+i,g,d);c.timeout=c.el&&setTimeout(o,~~(1e3/k))}()}return c},stop:function(){var a=this.el;return a&&(clearTimeout(this.timeout),a.parentNode&&a.parentNode.removeChild(a),this.el=void 0),this},lines:function(d,f){function h(b,c){return e(a(),{position:"absolute",width:f.length+f.width+"px",height:f.width+"px",background:b,boxShadow:c,transformOrigin:"left",transform:"rotate("+~~(360/f.lines*k+f.rotate)+"deg) translate("+f.radius+"px,0)",borderRadius:(f.corners*f.width>>1)+"px"})}for(var i,k=0,l=(f.lines-1)*(1-f.direction)/2;k<f.lines;k++)i=e(a(),{position:"absolute",top:1+~(f.width/2)+"px",transform:f.hwaccel?"translate3d(0,0,0)":"",opacity:f.opacity,animation:j&&c(f.opacity,f.trail,l+k*f.direction,f.lines)+" "+1/f.speed+"s linear infinite"}),f.shadow&&b(i,e(h("#000","0 0 4px #000"),{top:"2px"})),b(d,b(i,h(g(f.color,k),"0 0 1px rgba(0,0,0,.1)")));return d},opacity:function(a,b,c){b<a.childNodes.length&&(a.childNodes[b].style.opacity=c)}});var o=e(a("group"),{behavior:"url(#default#VML)"});return!d(o,"transform")&&o.adj?i():j=d(o,"animation"),h});
;/*
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.6
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 *
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */
(function(a){if(typeof define==="function"&&define.amd&&define.amd.jQuery){define(["jquery"],a)}else{a(jQuery)}}(function(f){var p="left",o="right",e="up",x="down",c="in",z="out",m="none",s="auto",l="swipe",t="pinch",A="tap",j="doubletap",b="longtap",y="hold",D="horizontal",u="vertical",i="all",r=10,g="start",k="move",h="end",q="cancel",a="ontouchstart" in window,v=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled,d=window.navigator.pointerEnabled||window.navigator.msPointerEnabled,B="TouchSwipe";var n={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:true,triggerOnTouchLeave:false,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"label, button, input, select, textarea, a, .noSwipe",preventDefaultEvents:true};f.fn.swipe=function(G){var F=f(this),E=F.data(B);if(E&&typeof G==="string"){if(E[G]){return E[G].apply(this,Array.prototype.slice.call(arguments,1))}else{f.error("Method "+G+" does not exist on jQuery.swipe")}}else{if(!E&&(typeof G==="object"||!G)){return w.apply(this,arguments)}}return F};f.fn.swipe.defaults=n;f.fn.swipe.phases={PHASE_START:g,PHASE_MOVE:k,PHASE_END:h,PHASE_CANCEL:q};f.fn.swipe.directions={LEFT:p,RIGHT:o,UP:e,DOWN:x,IN:c,OUT:z};f.fn.swipe.pageScroll={NONE:m,HORIZONTAL:D,VERTICAL:u,AUTO:s};f.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,ALL:i};function w(E){if(E&&(E.allowPageScroll===undefined&&(E.swipe!==undefined||E.swipeStatus!==undefined))){E.allowPageScroll=m}if(E.click!==undefined&&E.tap===undefined){E.tap=E.click}if(!E){E={}}E=f.extend({},f.fn.swipe.defaults,E);return this.each(function(){var G=f(this);var F=G.data(B);if(!F){F=new C(this,E);G.data(B,F)}})}function C(a4,av){var az=(a||d||!av.fallbackToMouseEvents),J=az?(d?(v?"MSPointerDown":"pointerdown"):"touchstart"):"mousedown",ay=az?(d?(v?"MSPointerMove":"pointermove"):"touchmove"):"mousemove",U=az?(d?(v?"MSPointerUp":"pointerup"):"touchend"):"mouseup",S=az?null:"mouseleave",aD=(d?(v?"MSPointerCancel":"pointercancel"):"touchcancel");var ag=0,aP=null,ab=0,a1=0,aZ=0,G=1,aq=0,aJ=0,M=null;var aR=f(a4);var Z="start";var W=0;var aQ=null;var T=0,a2=0,a5=0,ad=0,N=0;var aW=null,af=null;try{aR.bind(J,aN);aR.bind(aD,a9)}catch(ak){f.error("events not supported "+J+","+aD+" on jQuery.swipe")}this.enable=function(){aR.bind(J,aN);aR.bind(aD,a9);return aR};this.disable=function(){aK();return aR};this.destroy=function(){aK();aR.data(B,null);aR=null};this.option=function(bc,bb){if(av[bc]!==undefined){if(bb===undefined){return av[bc]}else{av[bc]=bb}}else{f.error("Option "+bc+" does not exist on jQuery.swipe.options")}return null};function aN(bd){if(aB()){return}if(f(bd.target).closest(av.excludedElements,aR).length>0){return}var be=bd.originalEvent?bd.originalEvent:bd;var bc,bb=a?be.touches[0]:be;Z=g;if(a){W=be.touches.length}else{bd.preventDefault()}ag=0;aP=null;aJ=null;ab=0;a1=0;aZ=0;G=1;aq=0;aQ=aj();M=aa();R();if(!a||(W===av.fingers||av.fingers===i)||aX()){ai(0,bb);T=at();if(W==2){ai(1,be.touches[1]);a1=aZ=au(aQ[0].start,aQ[1].start)}if(av.swipeStatus||av.pinchStatus){bc=O(be,Z)}}else{bc=false}if(bc===false){Z=q;O(be,Z);return bc}else{if(av.hold){af=setTimeout(f.proxy(function(){aR.trigger("hold",[be.target]);if(av.hold){bc=av.hold.call(aR,be,be.target)}},this),av.longTapThreshold)}ao(true)}return null}function a3(be){var bh=be.originalEvent?be.originalEvent:be;if(Z===h||Z===q||am()){return}var bd,bc=a?bh.touches[0]:bh;var bf=aH(bc);a2=at();if(a){W=bh.touches.length}if(av.hold){clearTimeout(af)}Z=k;if(W==2){if(a1==0){ai(1,bh.touches[1]);a1=aZ=au(aQ[0].start,aQ[1].start)}else{aH(bh.touches[1]);aZ=au(aQ[0].end,aQ[1].end);aJ=ar(aQ[0].end,aQ[1].end)}G=a7(a1,aZ);aq=Math.abs(a1-aZ)}if((W===av.fingers||av.fingers===i)||!a||aX()){aP=aL(bf.start,bf.end);al(be,aP);ag=aS(bf.start,bf.end);ab=aM();aI(aP,ag);if(av.swipeStatus||av.pinchStatus){bd=O(bh,Z)}if(!av.triggerOnTouchEnd||av.triggerOnTouchLeave){var bb=true;if(av.triggerOnTouchLeave){var bg=aY(this);bb=E(bf.end,bg)}if(!av.triggerOnTouchEnd&&bb){Z=aC(k)}else{if(av.triggerOnTouchLeave&&!bb){Z=aC(h)}}if(Z==q||Z==h){O(bh,Z)}}}else{Z=q;O(bh,Z)}if(bd===false){Z=q;O(bh,Z)}}function L(bb){var bc=bb.originalEvent;if(a){if(bc.touches.length>0){F();return true}}if(am()){W=ad}a2=at();ab=aM();if(ba()||!an()){Z=q;O(bc,Z)}else{if(av.triggerOnTouchEnd||(av.triggerOnTouchEnd==false&&Z===k)){bb.preventDefault();Z=h;O(bc,Z)}else{if(!av.triggerOnTouchEnd&&a6()){Z=h;aF(bc,Z,A)}else{if(Z===k){Z=q;O(bc,Z)}}}}ao(false);return null}function a9(){W=0;a2=0;T=0;a1=0;aZ=0;G=1;R();ao(false)}function K(bb){var bc=bb.originalEvent;if(av.triggerOnTouchLeave){Z=aC(h);O(bc,Z)}}function aK(){aR.unbind(J,aN);aR.unbind(aD,a9);aR.unbind(ay,a3);aR.unbind(U,L);if(S){aR.unbind(S,K)}ao(false)}function aC(bf){var be=bf;var bd=aA();var bc=an();var bb=ba();if(!bd||bb){be=q}else{if(bc&&bf==k&&(!av.triggerOnTouchEnd||av.triggerOnTouchLeave)){be=h}else{if(!bc&&bf==h&&av.triggerOnTouchLeave){be=q}}}return be}function O(bd,bb){var bc=undefined;if((I()||V())||(P()||aX())){if(I()||V()){bc=aF(bd,bb,l)}if((P()||aX())&&bc!==false){bc=aF(bd,bb,t)}}else{if(aG()&&bc!==false){bc=aF(bd,bb,j)}else{if(ap()&&bc!==false){bc=aF(bd,bb,b)}else{if(ah()&&bc!==false){bc=aF(bd,bb,A)}}}}if(bb===q){a9(bd)}if(bb===h){if(a){if(bd.touches.length==0){a9(bd)}}else{a9(bd)}}return bc}function aF(be,bb,bd){var bc=undefined;if(bd==l){aR.trigger("swipeStatus",[bb,aP||null,ag||0,ab||0,W,aQ]);if(av.swipeStatus){bc=av.swipeStatus.call(aR,be,bb,aP||null,ag||0,ab||0,W,aQ);if(bc===false){return false}}if(bb==h&&aV()){aR.trigger("swipe",[aP,ag,ab,W,aQ]);if(av.swipe){bc=av.swipe.call(aR,be,aP,ag,ab,W,aQ);if(bc===false){return false}}switch(aP){case p:aR.trigger("swipeLeft",[aP,ag,ab,W,aQ]);if(av.swipeLeft){bc=av.swipeLeft.call(aR,be,aP,ag,ab,W,aQ)}break;case o:aR.trigger("swipeRight",[aP,ag,ab,W,aQ]);if(av.swipeRight){bc=av.swipeRight.call(aR,be,aP,ag,ab,W,aQ)}break;case e:aR.trigger("swipeUp",[aP,ag,ab,W,aQ]);if(av.swipeUp){bc=av.swipeUp.call(aR,be,aP,ag,ab,W,aQ)}break;case x:aR.trigger("swipeDown",[aP,ag,ab,W,aQ]);if(av.swipeDown){bc=av.swipeDown.call(aR,be,aP,ag,ab,W,aQ)}break}}}if(bd==t){aR.trigger("pinchStatus",[bb,aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchStatus){bc=av.pinchStatus.call(aR,be,bb,aJ||null,aq||0,ab||0,W,G,aQ);if(bc===false){return false}}if(bb==h&&a8()){switch(aJ){case c:aR.trigger("pinchIn",[aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchIn){bc=av.pinchIn.call(aR,be,aJ||null,aq||0,ab||0,W,G,aQ)}break;case z:aR.trigger("pinchOut",[aJ||null,aq||0,ab||0,W,G,aQ]);if(av.pinchOut){bc=av.pinchOut.call(aR,be,aJ||null,aq||0,ab||0,W,G,aQ)}break}}}if(bd==A){if(bb===q||bb===h){clearTimeout(aW);clearTimeout(af);if(Y()&&!H()){N=at();aW=setTimeout(f.proxy(function(){N=null;aR.trigger("tap",[be.target]);if(av.tap){bc=av.tap.call(aR,be,be.target)}},this),av.doubleTapThreshold)}else{N=null;aR.trigger("tap",[be.target]);if(av.tap){bc=av.tap.call(aR,be,be.target)}}}}else{if(bd==j){if(bb===q||bb===h){clearTimeout(aW);N=null;aR.trigger("doubletap",[be.target]);if(av.doubleTap){bc=av.doubleTap.call(aR,be,be.target)}}}else{if(bd==b){if(bb===q||bb===h){clearTimeout(aW);N=null;aR.trigger("longtap",[be.target]);if(av.longTap){bc=av.longTap.call(aR,be,be.target)}}}}}return bc}function an(){var bb=true;if(av.threshold!==null){bb=ag>=av.threshold}return bb}function ba(){var bb=false;if(av.cancelThreshold!==null&&aP!==null){bb=(aT(aP)-ag)>=av.cancelThreshold}return bb}function ae(){if(av.pinchThreshold!==null){return aq>=av.pinchThreshold}return true}function aA(){var bb;if(av.maxTimeThreshold){if(ab>=av.maxTimeThreshold){bb=false}else{bb=true}}else{bb=true}return bb}function al(bb,bc){if(av.preventDefaultEvents===false){return}if(av.allowPageScroll===m){bb.preventDefault()}else{var bd=av.allowPageScroll===s;switch(bc){case p:if((av.swipeLeft&&bd)||(!bd&&av.allowPageScroll!=D)){bb.preventDefault()}break;case o:if((av.swipeRight&&bd)||(!bd&&av.allowPageScroll!=D)){bb.preventDefault()}break;case e:if((av.swipeUp&&bd)||(!bd&&av.allowPageScroll!=u)){bb.preventDefault()}break;case x:if((av.swipeDown&&bd)||(!bd&&av.allowPageScroll!=u)){bb.preventDefault()}break}}}function a8(){var bc=aO();var bb=X();var bd=ae();return bc&&bb&&bd}function aX(){return !!(av.pinchStatus||av.pinchIn||av.pinchOut)}function P(){return !!(a8()&&aX())}function aV(){var be=aA();var bg=an();var bd=aO();var bb=X();var bc=ba();var bf=!bc&&bb&&bd&&bg&&be;return bf}function V(){return !!(av.swipe||av.swipeStatus||av.swipeLeft||av.swipeRight||av.swipeUp||av.swipeDown)}function I(){return !!(aV()&&V())}function aO(){return((W===av.fingers||av.fingers===i)||!a)}function X(){return aQ[0].end.x!==0}function a6(){return !!(av.tap)}function Y(){return !!(av.doubleTap)}function aU(){return !!(av.longTap)}function Q(){if(N==null){return false}var bb=at();return(Y()&&((bb-N)<=av.doubleTapThreshold))}function H(){return Q()}function ax(){return((W===1||!a)&&(isNaN(ag)||ag<av.threshold))}function a0(){return((ab>av.longTapThreshold)&&(ag<r))}function ah(){return !!(ax()&&a6())}function aG(){return !!(Q()&&Y())}function ap(){return !!(a0()&&aU())}function F(){a5=at();ad=event.touches.length+1}function R(){a5=0;ad=0}function am(){var bb=false;if(a5){var bc=at()-a5;if(bc<=av.fingerReleaseThreshold){bb=true}}return bb}function aB(){return !!(aR.data(B+"_intouch")===true)}function ao(bb){if(bb===true){aR.bind(ay,a3);aR.bind(U,L);if(S){aR.bind(S,K)}}else{aR.unbind(ay,a3,false);aR.unbind(U,L,false);if(S){aR.unbind(S,K,false)}}aR.data(B+"_intouch",bb===true)}function ai(bc,bb){var bd=bb.identifier!==undefined?bb.identifier:0;aQ[bc].identifier=bd;aQ[bc].start.x=aQ[bc].end.x=bb.pageX||bb.clientX;aQ[bc].start.y=aQ[bc].end.y=bb.pageY||bb.clientY;return aQ[bc]}function aH(bb){var bd=bb.identifier!==undefined?bb.identifier:0;var bc=ac(bd);bc.end.x=bb.pageX||bb.clientX;bc.end.y=bb.pageY||bb.clientY;return bc}function ac(bc){for(var bb=0;bb<aQ.length;bb++){if(aQ[bb].identifier==bc){return aQ[bb]}}}function aj(){var bb=[];for(var bc=0;bc<=5;bc++){bb.push({start:{x:0,y:0},end:{x:0,y:0},identifier:0})}return bb}function aI(bb,bc){bc=Math.max(bc,aT(bb));M[bb].distance=bc}function aT(bb){if(M[bb]){return M[bb].distance}return undefined}function aa(){var bb={};bb[p]=aw(p);bb[o]=aw(o);bb[e]=aw(e);bb[x]=aw(x);return bb}function aw(bb){return{direction:bb,distance:0}}function aM(){return a2-T}function au(be,bd){var bc=Math.abs(be.x-bd.x);var bb=Math.abs(be.y-bd.y);return Math.round(Math.sqrt(bc*bc+bb*bb))}function a7(bb,bc){var bd=(bc/bb)*1;return bd.toFixed(2)}function ar(){if(G<1){return z}else{return c}}function aS(bc,bb){return Math.round(Math.sqrt(Math.pow(bb.x-bc.x,2)+Math.pow(bb.y-bc.y,2)))}function aE(be,bc){var bb=be.x-bc.x;var bg=bc.y-be.y;var bd=Math.atan2(bg,bb);var bf=Math.round(bd*180/Math.PI);if(bf<0){bf=360-Math.abs(bf)}return bf}function aL(bc,bb){var bd=aE(bc,bb);if((bd<=45)&&(bd>=0)){return p}else{if((bd<=360)&&(bd>=315)){return p}else{if((bd>=135)&&(bd<=225)){return o}else{if((bd>45)&&(bd<135)){return x}else{return e}}}}}function at(){var bb=new Date();return bb.getTime()}function aY(bb){bb=f(bb);var bd=bb.offset();var bc={left:bd.left,right:bd.left+bb.outerWidth(),top:bd.top,bottom:bd.top+bb.outerHeight()};return bc}function E(bb,bc){return(bb.x>bc.left&&bb.x<bc.right&&bb.y>bc.top&&bb.y<bc.bottom)}}}));
