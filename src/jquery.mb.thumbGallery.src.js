/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 jquery.mb.components

 file: jquery.mb.thumbGallery.src.js
 last modified: 24/11/17 21.40
 Version:  {{ version }}
 Build:  {{ buildnum }}

 Open Lab s.r.l., Florence - Italy
 email:  matteo@open-lab.com
 blog: 	http://pupunzi.open-lab.com
 site: 	http://pupunzi.com
 http://open-lab.com

 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html

 Copyright (c) 2001-2017. Matteo Bicocchi (Pupunzi)
 :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

( function( $ ) {
	jQuery.thumbGallery = {

		name: "jquery.mb.thumbGallery",
		version: "{{ version }}",
		build: "{{ build }}",
		author: "Matteo Bicocchi",

		defaults: {
			nav_effect: "slide_horizontal",
			nav_delay: 60,
			nav_delay_inverse: 1,
			nav_timing: 800,
			nav_pagination: 6,
			nav_show: true,
			gallery_effect: "slide_horizontal",
			gallery_timing: 500,
			gallery_cover: false,
			thumb_fit: false,

			full_inline: false,
			full_inline_height: 500,

			gallery_fullscreen_w: "100%",
			gallery_fullscreen_h: "100%",
			showIndexinFullscreen: false,
			clever_transition: true,
			ease: "cubic-bezier(0.19, 1, 0.22, 1)",
			thumb_ratio: 1,


			onSlide: function( grid ) {},
			onFullScreen: function( grid ) {},
			onExitFullScreen: function( grid ) {},
			onFullscreenChange: function( grid ) {}
		},

		transitions: {
			fade: {
				prev: { in: {
						opacity: 0
					},
					out: {
						opacity: 0
					},
					nav_delay_inverse: false
				},
				next: { in: {
						opacity: 0
					},
					out: {
						opacity: 0
					},
					nav_delay_inverse: false
				}
			},
			fade_zoom: {
				prev: { in: {
						x: "0",
						opacity: 0,
						scale: 0.9
					},
					out: {
						x: 0,
						opacity: 0
					},
					nav_delay_inverse: false
				},
				next: { in: {
						x: "0",
						opacity: 0
					},
					out: {
						x: 0,
						scale: 0.9,
						opacity: 0
					},
					nav_delay_inverse: false
				}
			},
			slide_vertical: {
				prev: { in: {
						opacity: 0
					},
					out: {
						y: -200,
						opacity: 0
					},
					nav_delay_inverse: false
				},
				next: { in: {
						opacity: 0
					},
					out: {
						y: 200,
						opacity: 0
					},
					nav_delay_inverse: false
				}
			},
			slide_horizontal: {
				prev: { in: {
						opacity: 0
					},
					out: {
						x: $( window ).width( ),
						opacity: 0
					},
					ease: "cubic-bezier(.43,.18,.81,1.07)",
					sequence: true,
					nav_delay_inverse: true
				},
				next: { in: {
						opacity: 0
					},
					out: {
						x: -$( window ).width( ),
						opacity: 0
					},
					ease: "cubic-bezier(.43,.18,.81,1.07)",
					sequence: true,
					nav_delay_inverse: false
				}
			},
			slide_inverse: {
				prev: { in: {
						y: 200,
						opacity: 0
					},
					out: {
						y: 200,
						opacity: 0
					},
					nav_delay_inverse: false
				},
				next: { in: {
						y: 200,
						opacity: 0
					},
					out: {
						y: 200,
						opacity: 0
					},
					nav_delay_inverse: false
				}
			},
			zoom: {
				prev: { in: {
						scale: .1,
						opacity: 0
					},
					out: {
						scale: 2,
						opacity: 0
					},
					nav_delay_inverse: false
				},
				next: { in: {
						scale: 2,
						opacity: 0
					},
					out: {
						scale: .1,
						opacity: 0
					},
					nav_delay_inverse: false
				}
			},
			rotate: {
				prev: { in: {
						opacity: 0,
						rotate: -179
					},
					out: {
						rotate: 179,
						opacity: 0
					},
					nav_delay_inverse: false
				},
				next: { in: {
						opacity: 0,
						rotate: 179
					},
					out: {
						rotate: -179,
						opacity: 0
					},
					nav_delay_inverse: false
				}
			},
			mobSlide: {
				prev: { in: {
						opacity: 0
					},
					out: {
						x: 200,
						opacity: 0
					},
					ease: "cubic-bezier(0,.01,1,1)",
					nav_delay_inverse: false
				},
				next: { in: {
						opacity: 0
					},
					out: {
						x: -200,
						opacity: 0
					},
					ease: "cubic-bezier(0,.01,1,1)",
					nav_delay_inverse: true
				}
			}
		},

		/**
		 * Mouse / touch events
		 */
		events: {
			start: jQuery.isMobile ? "touchstart" : "mousedown",
			move: jQuery.isMobile ? "touchmove" : "mousemove",
			end: jQuery.isMobile ? "click" : "click"
		},

		/**
		 *
		 * @param options
		 * @returns {*}
		 */
		init: function( options ) {
			return this.each( function( ) {
				var grid = this;
				var $grid = jQuery( grid );

				$grid.addClass( "tg-container" );
				grid.opt = {};
				jQuery.extend( grid.opt, jQuery.thumbGallery.defaults, options );
				$grid.hide( );

				grid.isAnimating = false;
				grid.pageIndex = 0;

				grid.id = grid.id ? grid.id : "thumbGallery_" + new Date( ).getTime( );
				grid.setAttribute( "gid", "thumbGallery_" + new Date( ).getTime( ) );

				grid.nav_effect = $grid.data( "nav_effect" ) || grid.opt.nav_effect;
				grid.nav_delay = $grid.data( "nav_delay" ) || grid.opt.nav_delay;
				grid.nav_delay_inverse = $grid.data( "nav_delay_inverse" ) || grid.opt.nav_delay_inverse;
				grid.nav_timing = $grid.data( "nav_timing" ) || opt.nav_timing;
				grid.nav_pagination = typeof $grid.data( "nav_pagination" ) != "undefined" ? $grid.data( "nav_pagination" ) : grid.opt.nav_pagination;
				grid.nav_pagination = jQuery.isMobile && !jQuery.isTablet ? 1 : grid.nav_pagination;
				grid.gallery_fullscreen_w = $grid.data( "gallery_fullscreen_w" ) || grid.opt.gallery_fullscreen_w;
				grid.gallery_fullscreen_h = $grid.data( "gallery_fullscreen_h" ) || grid.opt.gallery_fullscreen_h;
				grid.gallery_cover = $grid.data( "gallery_cover" ) || grid.opt.gallery_cover;
				grid.thumb_fit = $grid.data( "thumb_fit" ) || grid.opt.thumb_fit;
				grid.thumb_ratio = eval( $grid.data( "thumb_ratio" ) ) || grid.opt.thumb_ratio;
				grid.gallery_effect = $grid.data( "gallery_effect" ) || grid.nav_effect;
				grid.gallery_timing = $grid.data( "gallery_timing" ) || 1000;
				grid.nav_show = typeof $grid.data( "nav_show" ) != "undefined" ? $grid.data( "nav_show" ) : grid.opt.nav_show;
				grid.clever_transition = typeof $grid.data( "clever_transition" ) != "undefined" ? $grid.data( "clever_transition" ) : grid.opt.clever_transition;
				grid.full_inline = typeof $grid.data( "full_inline" ) != "undefined" ? $grid.data( "full_inline" ) : grid.opt.full_inline;
				grid.full_inline_height = typeof $grid.data( "full_inline_height" ) != "undefined" ? parseFloat( $grid.data( "full_inline_height" ) ) : grid.opt.full_inline_height;

				if ( jQuery.isMobile )
					grid.full_inline = false;

				jQuery.extend( grid.opt, $grid.data( ) );

				grid.elements = $grid.children( ).clone( true );
				$grid.children( ).hide( );

				if ( grid.nav_pagination == 0 )
					grid.nav_pagination = grid.elements.length;

				grid.elements.each( function( i ) {
					jQuery( this ).attr( "data-globalindex", i );
				} );

				grid.pages = [ ];
				grid.totPages = Math.ceil( grid.elements.length / grid.nav_pagination );
				var thumbIdx = 0;
				for ( var p = 0; p < grid.totPages; p++ ) {
					var page = [ ];
					for ( var x = 0; x < grid.nav_pagination; x++ ) {
						if ( !grid.elements[ thumbIdx ] )
							break;
						var thumb = grid.elements[ thumbIdx ];
						page.push( thumb );
						thumbIdx++;
					}
					grid.pages.push( page );
				}

				jQuery.thumbGallery.drawPage( grid, false );

				if ( grid.full_inline )
					jQuery.thumbGallery.drawFullInline( grid );

				jQuery( window ).resize( );

			} );
		},
		/**
		 *
		 * @param el
		 */
		drawFullInline: function( el ) {
			var grid = el;
			var $grid = jQuery( grid );
			/* Create the full-image container*/
			grid.fullInlineBox = jQuery( "<div/>" ).addClass( "inline-full-box" );
			grid.fullInlineBox.css( {
				height: grid.full_inline_height,
				width: "100%",
				position: "absolute",
				padding: 5,
				top: 0,
				left: 0
			} );

			/* Create the full-image*/
			grid.fullInlineImg = jQuery( "<div/>" ).addClass( "inline-full-img" );
			var fullImage_src = $( grid.pages[ 0 ][ 0 ] ).data( "highres" );
			grid.fullInlineImg.css( {
				height: "calc(100% - 10px)",
				width: "calc(100% - 10px)",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				margin: "auto",
				position: "absolute",
				background: "#000",
				backgroundImage: "url(" + fullImage_src + ")",
				backgroundSize: grid.thumb_fit ? "contain" : "cover",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center center"
			} );

			jQuery.thumbGallery.showFullInline( grid, 0 );

			/* Set the correct height to the gallery*/
			/*
						$grid.css( {
							height: grid.full_inline_height + ( grid.thumbSize.h + 5 )
						} );
			*/

			grid.fullInlineBox.prepend( grid.fullInlineImg );
			$grid.prepend( grid.fullInlineBox );
		},

		/**
		 *
		 * @param el
		 * @param applyEffect
		 */
		drawPage: function( el, applyEffect ) {

			if ( typeof applyEffect === "undefined" )
				applyEffect = true;

			var grid = el;
			var $grid = jQuery( grid );

			grid.nav_delay = $grid.data( "nav_delay" ) || 100;
			grid.nav_delay_inverse = $grid.data( "nav_delay_inverse" ) || 0;
			grid.nav_timing = $grid.data( "nav_timing" ) || 2000;
			grid.isAnimating = true;
			var pageElements = grid.pages[ el.pageIndex ];
			var $page = jQuery( "<ul/>" ).addClass( "thumb-grid" );
			grid.page = $page;
			if ( grid.full_inline )
				$page.addClass( "full-inline" );
			if ( typeof grid.opt.onSlide == "function" ) {
				grid.opt.onSlide( grid )
			}

			for ( var x = 0; x < grid.nav_pagination; x++ ) {
				var thumb = jQuery( pageElements[ x ] );
				var thumb_box = jQuery( "<div/>" ).addClass( "thumb_box" );
				var thumb_src = jQuery( pageElements[ x ] ).attr( "src" );
				thumb_box.css( {
					backgroundImage: "url(" + thumb_src + ")",
					backgroundSize: grid.thumb_fit ? "contain" : "cover",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center center"
				} );

				thumb_box.attr( {
					"data-type": thumb.data( "type" ) || "image",
					"data-highres": thumb.data( "highres" ),
					"data-globalindex": thumb.data( "globalindex" ),
					"data-caption": thumb.data( "caption" )
				} );

				thumb_box.css( {
					width: "100%",
					height: "100%"
				} );

				if ( thumb.length ) {
					var thumbWrapper = jQuery( "<li/>" ).addClass( "thumbWrapper" ).append( thumb_box );
					if ( grid.nav_pagination == 1 && thumb.data( "caption" ) ) {
						var captionBox = jQuery( "<div/>" ).addClass( "tg-captionBox" ).html( thumb.data( "caption" ) );
						thumb_box.after( captionBox );
					} else {
						jQuery( ".tg-captionBox", thumb_box ).remove( );
					}
					thumbWrapper.data( "idx", x );
					thumbWrapper.on( jQuery.thumbGallery.events.end, function( e ) {
						if ( grid.isAnimating )
							return;

						var idx = jQuery( ".thumb_box", this ).data( "globalindex" );

						if ( grid.full_inline ) {
							jQuery.thumbGallery.showFullInline( grid, idx );
						} else {
							jQuery.thumbGallery.drawSlideShow( grid, idx );
						}
						e.originalEvent.preventDefault( );
					} );

					if ( applyEffect ) {
						thumbWrapper.css( {
							opacity: 0
						} );
						grid.direction = grid.direction || "next";
						var transitionIn = jQuery.normalizeCss( jQuery.thumbGallery.transitions[ $grid.data( "nav_effect" ) ][ grid.direction ].in );
						thumbWrapper.css( transitionIn );
					} else {
						var displayProperties = jQuery.normalizeCss( {
							top: 0,
							left: 0,
							opacity: 1,
							x: 0,
							y: 0,
							scale: 1,
							rotate: 0,
							skew: 0,
							filter: " blur(0)"
						} );
						thumbWrapper.css( displayProperties ).show( );
					}
					$page.append( thumbWrapper );
					jQuery( ".tg-next, .tg-prev", $page ).remove( );
					var next = jQuery( "<div/>" ).addClass( "tg-next tg-icon" ).on( jQuery.thumbGallery.events.end, function( e ) {
						jQuery.thumbGallery.nextPage( grid );
						e.originalEvent.preventDefault( );
					} );
					var prev = jQuery( "<div/>" ).addClass( "tg-prev tg-icon" ).on( jQuery.thumbGallery.events.end, function( e ) {
						jQuery.thumbGallery.prevPage( grid );
						e.originalEvent.preventDefault( );
					} );
					if ( grid.elements.length > grid.nav_pagination )
						$page.append( next ).append( prev );
					$page.addClass( "active" );
				} else {
					break;
				}
			}
			grid.thumbSize = jQuery.thumbGallery.setThumbSize( grid, jQuery( ".thumbWrapper", $page ) );
			jQuery( window ).off( "resize.thumbgallery_" + grid.id ).on( "resize.thumbgallery_" + grid.id, function( ) {

				var el = jQuery( ".thumbWrapper", $page );
				grid.thumbSize = jQuery.thumbGallery.setThumbSize( grid, el );
				$grid.css( {
					height: grid.full_inline ? grid.full_inline_height + ( grid.thumbSize.h + 5 ) : grid.thumbSize.h
				} );

			} ).resize( );

			if ( applyEffect )
				$page.addClass( "in" );

			$grid.find( ".thumb-grid" ).addClass( "out" ).removeClass( "in" );
			$grid.prepend( $page );
			if ( jQuery.isMobile ) {
				$page.swipe( {
					allowPageScroll: "auto",
					threshold: 75,
					triggerOnTouchEnd: false,
					swipeStatus: function( event, phase, direction, distance ) {

						if ( phase == "move" ) {
							event.preventDefault( );
							event.stopPropagation( );
						}

						if ( grid.isAnimating )
							return;

						if ( phase == "end" ) {

							event.preventDefault( );
							event.stopPropagation( );

							if ( direction == "left" ) {

								grid.nav_effect = jQuery.thumbGallery.transitions[ "mobSlide" ];
								jQuery.thumbGallery.nextPage( grid );

							} else if ( direction == "right" ) {
								grid.nav_effect = jQuery.thumbGallery.transitions[ "mobSlide" ];
								jQuery.thumbGallery.prevPage( grid );
							}

							return false;
						}
					}
				} );
			}

			grid.direction = grid.direction || "next";

			var ease = jQuery.thumbGallery.transitions[ $grid.data( "nav_effect" ) ][ grid.direction ].ease || grid.opt.ease;

			setTimeout( function( ) {

				var displayProperties = {
					top: 0,
					left: 0,
					opacity: 1,
					x: 0,
					y: 0,
					scale: 1,
					rotate: 0,
					skew: 0,
					filter: " blur(0)"
				};

				// IN
				var delayIn = jQuery.thumbGallery.transitions[ $grid.data( "nav_effect" ) ][ grid.direction ].sequence ? grid.nav_delay * 3 : 0;
				var nav_delay_inverse = jQuery.thumbGallery.transitions[ $grid.data( "nav_effect" ) ][ grid.direction ].nav_delay_inverse;

				for ( var i = 0; i < jQuery( ".in .thumbWrapper", $grid )
					.length; i++ ) {
					var idxIn = nav_delay_inverse ? ( jQuery( ".in .thumbWrapper", $grid ).length - 1 ) - i : i;

					var elIn = jQuery( ".in .thumbWrapper", $grid ).eq( idxIn ).data( "idx", idxIn );
					elIn.CSSAnimate( displayProperties, grid.nav_timing, delayIn, ease );
					delayIn += grid.nav_delay;
				}

				// OUT
				var delayOut = 0;
				for ( var ii = 0; ii < jQuery( ".out .thumbWrapper", $grid )
					.length; ii++ ) {
					var idxOut = nav_delay_inverse ? ( jQuery( ".out .thumbWrapper", $grid ).length - 1 ) - ii : ii;

					var elOut = jQuery( ".out .thumbWrapper", $grid ).eq( idxOut );
					elOut.data( "islast", ( nav_delay_inverse ? idxOut == 0 : idxOut == jQuery( ".out .thumbWrapper", $grid ).length - 1 ) );
					var transitionOut = jQuery.thumbGallery.transitions[ $grid.data( "nav_effect" ) ][ grid.direction ].out;
					grid.nav.addClass( "waiting" );

					elOut.CSSAnimate( transitionOut, grid.nav_timing, delayOut, ease, function( ) {
						if ( elOut.data( "islast" ) ) {
							jQuery( ".out", $grid ).remove( );
							grid.isAnimating = false;
							grid.nav.removeClass( "waiting" );
						}
					} );
					delayOut += grid.nav_delay;
				}

				$grid.fadeIn( );

				if ( !applyEffect ) {
					//$grid.height( $page.height( ) );
					jQuery.thumbGallery.buildIndex( grid );
					grid.isAnimating = false;

					if ( typeof grid.nav != "undefined" && grid.nav_show )
						grid.nav.show( );
				}
			}, 100 );

			jQuery( window ).on( "resize.thumbGallery", function( ) {
				//$grid.height( $page.height( ) );
			} ).resize( );
		},

		/**
		 *
		 * @param grid
		 * @param el
		 * @returns {{w: number, h: number}}
		 */
		setThumbSize: function( grid, el ) {
			var $grid = jQuery( grid );
			if ( !$grid.is( ":visible" ) ) {
				$grid.css( {
					opacity: 0
				} ).show( );
				grid.width = $grid.outerWidth( );
				$grid.hide( ).css( {
					opacity: 1
				} );
			} else {
				grid.width = $grid.outerWidth( );
			}

			var w = ( grid.width / grid.nav_pagination ) - ( grid.nav_pagination == 1 ? 0 : 10 );
			if ( grid.nav_pagination > 6 )
				w = ( ( grid.width * 2 ) / grid.nav_pagination ) - 10;
			if ( grid.nav_pagination > 8 )
				w = ( ( grid.width * 2.5 ) / grid.nav_pagination ) - 10;
			if ( grid.width < 600 && grid.nav_pagination > 3 )
				w = ( grid.width / 2 ) - 10;

			var h = w / grid.thumb_ratio;

			el.each( function( ) {
				jQuery( this ).css( {
					width: w,
					height: h
				} );
			} );
			return {
				w: w,
				h: h
			};
		},

		getThumbSize: function( grid, el ) {
			return {
				h: el.outerHeight( ),
				w: jQuery( grid ).outerHeight( )
			};
		},

		/**
		 *
		 * @param grid
		 */
		nextPage: function( grid ) {

			if ( grid.isAnimating )
				return;

			++grid.pageIndex;

			grid.direction = "next";

			if ( grid.pageIndex > grid.totPages - 1 )
				grid.pageIndex = 0;

			jQuery.thumbGallery.drawPage( grid, true );

			if ( !grid.nav.length )
				return;

			jQuery( ".indexEl", grid.nav ).removeClass( "sel" );
			jQuery( ".indexEl", grid.nav ).eq( grid.pageIndex ).addClass( "sel" );

		},

		/**
		 *
		 * @param grid
		 */
		prevPage: function( grid ) {

			if ( grid.isAnimating )
				return;

			--grid.pageIndex;

			grid.direction = "prev";

			if ( grid.pageIndex < 0 )
				grid.pageIndex = grid.totPages - 1;

			jQuery.thumbGallery.drawPage( grid, true );

			if ( !grid.nav.length )
				return;

			jQuery( ".indexEl", grid.nav ).removeClass( "sel" );
			jQuery( ".indexEl", grid.nav ).eq( grid.pageIndex ).addClass( "sel" );

		},

		/**
		 *
		 * @param grid
		 */
		buildIndex: function( grid ) {

			var $grid = jQuery( grid );
			jQuery( "#" + grid.id + "+ .thumbGridNav" ).remove( );

			var nav = jQuery( "<nav/>" ).addClass( "thumbGridNav" );

			grid.nav = undefined;

			if ( grid.totPages <= 1 )
				return;

			for ( var x = 1; x <= grid.totPages; x++ ) {
				var idxPlaceHolder = jQuery( "<a/>" ).html( x ).attr( {
					idx: ( x - 1 )
				} );
				idxPlaceHolder.addClass( "indexEl" );
				idxPlaceHolder.on( jQuery.thumbGallery.events.end, function( e ) {
					var pageIndex = jQuery( this ).attr( "idx" );
					grid.direction = grid.pageIndex < pageIndex ? "next" : "prev";
					/*
					 console.debug( "grid.isAnimating ", grid.isAnimating )
					 console.debug( "grid.pageIndex ", grid.pageIndex )
					 console.debug( "pageIndex ", pageIndex )
					 */
					if ( grid.isAnimating || grid.pageIndex == pageIndex )
						return;
					if ( jQuery.isMobile ) {
						if ( pageIndex < grid.pageIndex )
							grid.nav_effect = jQuery.thumbGallery.transitions[ "mobSlide" ][ "prev" ];
						else
							grid.nav_effect = jQuery.thumbGallery.transitions[ "mobSlide" ][ "next" ];
					}
					grid.pageIndex = pageIndex;
					jQuery.thumbGallery.drawPage( grid );
					jQuery( ".indexEl", nav ).removeClass( "sel" );
					jQuery( ".indexEl", nav ).eq( grid.pageIndex ).addClass( "sel" );
					e.preventDefault( );
				} );
				nav.append( idxPlaceHolder );
				jQuery( ".indexEl", nav ).eq( grid.pageIndex ).addClass( "sel" );
			}
			nav.hide( );
			grid.nav = nav;
			if ( grid.nav_show && grid.totPages < 20 )
				$grid.after( nav );
		},

		/**
		 *
		 * @param idx
		 */
		showFullInline: function( el, idx ) {
			var grid = el;
			var newFullImg = grid.fullInlineImg.clone( ).css( {
				opacity: 0
			} );
			newFullImg.attr( "idx", idx );

			var imagesList = grid.elements;
			var image = jQuery( imagesList[ idx ] );
			var imageToShowURL = image.data( "highres" );
			newFullImg.css( {
				backgroundImage: "url(" + imageToShowURL + ")",
				backgroundSize: grid.gallery_cover && !jQuery.isMobile ? "cover" : "contain",
				backgroundPosition: "center center",
				backgroundRepeat: "no-repeat",
				zIndex: 1,
				cursor: "pointer"
			} );
			grid.fullInlineBox.append( newFullImg );
			newFullImg.CSSAnimate( {
				opacity: 1
			}, grid.gallery_timing / 1.5, "ease-out", function( ) {
				grid.fullInlineImg.remove( );
				grid.fullInlineImg = newFullImg;
			} ).off( jQuery.thumbGallery.events.end ).on( jQuery.thumbGallery.events.end, function( ) {
				jQuery.thumbGallery.drawSlideShow( grid, grid.fullInlineImg.attr( "idx" ) );
			} )

		},

		/**
		 *
		 * @param el
		 * @param idx
		 */
		drawSlideShow: function( el, idx ) {
			jQuery( "body" ).css( {
				overflow: "hidden"
			} ).trigger( "drawSlideShow" );

			var grid = el;
			var $grid = jQuery( grid );
			var overlay = jQuery( "<div/>" ).addClass( "tg-overlay" ).css( {
				opacity: 0
			} );
			var placeHolder = jQuery( "<div/>" ).addClass( "tg-placeHolder" );
			var slideShowClose = jQuery( "<div/>" ).addClass( "tg-close tg-icon" ).on( jQuery.thumbGallery.events.end, function( ) {
				jQuery.thumbGallery.closeSlideShow( el, idx )
			} );
			var slideShowNext = jQuery( "<div/>" ).addClass( "tg-next tg-icon" ).on( jQuery.thumbGallery.events.end, function( ) {
				grid.slideShow.next( )
			} );
			var slideShowPrev = jQuery( "<div/>" ).addClass( "tg-prev tg-icon" ).on( jQuery.thumbGallery.events.end, function( ) {
				grid.slideShow.prev( )
			} );
			var spinnerPh = jQuery( "<div/>" ).addClass( "tg-spinner" );
			var $origin = $grid.find( "[data-globalindex=" + idx + "]" ).parent( "li" );
			console.debug( idx, $origin );
			var pHleft = $origin.offset( ).left - jQuery( window ).scrollLeft( );
			var pHtop = $origin.offset( ).top - jQuery( window ).scrollTop( );
			var pHwidth = $origin.outerWidth( );
			var pHheight = $origin.outerHeight( );


			grid.nav_effect = jQuery.thumbGallery.transitions[ grid.nav_effect ] || jQuery.thumbGallery.transitions[ "fade" ];
			grid.nav_delay = $grid.data( "nav_delay" ) || 500;
			grid.nav_timing = parseFloat( $grid.data( "nav_timing" ) ) * 2 || 3000;

			grid.slideShowIdx = idx;

			placeHolder.css( {
				position: "fixed",
				left: pHleft,
				top: pHtop,
				width: pHwidth,
				height: pHheight
			} );

			overlay.append( placeHolder ).append( slideShowClose ).append( spinnerPh ).append( slideShowNext ).append( slideShowPrev );

			jQuery( ".tg-icon", overlay ).css( {
				opacity: 0
			} );

			var spinnerOpts = {
				lines: 11, // The number of lines to draw
				length: 6, // The length of each line
				width: 6, // The line thickness
				radius: 16, // The radius of the inner circle
				corners: 1, // Corner roundness (0..1)
				rotate: 16, // The rotation offset
				direction: 1, // 1: clockwise, -1: counterclockwise
				color: '#fff', // #rgb or #rrggbb or array of colors
				speed: 1.3, // Rounds per second
				trail: 52, // Afterglow percentage
				shadow: false, // Whether to render a shadow
				hwaccel: false, // Whether to use hardware acceleration
				className: 'spinner', // The CSS class to assign to the spinner
				zIndex: 2e9, // The z-index (defaults to 2000000000)
				top: '50%', // Top position relative to parent
				left: '50%' // Left position relative to parent
			};

			var target = spinnerPh.get( 0 ),
				spinner;

			spinner = new Spinner( spinnerOpts ).spin( target );
			spinnerPh.hide( );
			//spinnerPh.delay(800).fadeIn(1000);


			grid.slideShow = {

				init: function( ) {

					grid.slideShow.goTo( false );
					grid.slideShow.keyboard( true );
					grid.isAnimating = false;

					if ( typeof grid.opt.onFullScreen == "function" ) {
						grid.opt.onFullScreen( grid );
					}

				},

				effect: grid.gallery_effect,
				effectNext: jQuery.thumbGallery.transitions[ grid.gallery_effect ][ "next" ] || grid.gallery_effect[ "next" ],
				effectPrev: jQuery.thumbGallery.transitions[ grid.gallery_effect ][ "prev" ] || grid.gallery_effect[ "prev" ],

				/**
				 *
				 * @param on
				 */
				keyboard: function( on ) {

					if ( on ) {
						jQuery( document ).on( "keydown.thumbGallery", function( e ) {

							switch ( e.keyCode ) {

								case 27: //Esc
									jQuery.thumbGallery.closeSlideShow( el, idx );
									e.preventDefault( );
									break;

								case 32: //space
									e.preventDefault( );
									break;

								case 39: //arrow right
									grid.slideShow.next( );
									e.preventDefault( );
									break;

								case 37: //arrow left
									grid.slideShow.prev( );
									e.preventDefault( );
									break;
							}
						} );

						jQuery( "body" ).on( "closeSlideShow", function( ) {
							grid.slideShow.keyboard( false );
						} );

					} else {
						jQuery( document ).off( "keydown.thumbGallery" );
					}
				},

				/**
				 *
				 * @param animate
				 */
				goTo: function( animate ) {

					var oldImgWrapper = jQuery( ".tg-img-wrapper", placeHolder ).eq( 0 );
					oldImgWrapper.removeClass( "in" );

					var idx = grid.slideShowIdx,
						contentType = jQuery( grid.elements[ idx ] ).data( "type" ) || "image",
						imagesList = grid.elements,
						image = jQuery( imagesList[ idx ] ),
						imgWrapper = jQuery( "<div/>" ).addClass( "tg-img-wrapper" ),
						imageToShowURL = image.data( "highres" ),
						videoToShowURL = image.data( "videourl" ),
						contentToShowID = image.data( "contentid" ),
						imageCaption = jQuery( "<span/>" ).addClass( "tg-img-caption" ).html( image.data( "caption" ) ),
						imgContainer = jQuery( "<div/>" ).addClass( "tg-img-container" ),
						content;

					imgContainer.css( {
						position: "absolute",
						top: 0,
						left: 0,
						bottom: 0,
						right: 0,
						width: grid.gallery_fullscreen_w,
						height: grid.gallery_fullscreen_h,
						margin: "auto"
					} );

					imgWrapper.append( imgContainer );
					placeHolder.prepend( imgWrapper );
					imgWrapper.addClass( "in" );

					var img = jQuery( "<img/>" );

					var displayProperties = {
						top: 0,
						left: 0,
						opacity: 1,
						x: 0,
						y: 0,
						scale: 1,
						rotate: 0,
						skew: 0,
						filter: "blur(0)"
					};

					if ( animate ) {

						imgWrapper.css( jQuery.normalizeCss( grid.slideShow.effectNext.in ) );
						grid.slideShow.spinner = setTimeout( function( ) {
							spinner = new Spinner( spinnerOpts ).spin( target );
							spinnerPh.fadeIn( 300 );
						}, 1000 )
					} else {
						displayProperties = jQuery.normalizeCss( displayProperties );
						imgWrapper.css( displayProperties );
						imgWrapper.css( {
							opacity: 0
						} );
					}

					var showContent = function( ) {
						if ( animate ) {
							imgWrapper.css( jQuery.normalizeCss( grid.slideShow.effectNext.in ) );
						} else {
							displayProperties = jQuery.normalizeCss( displayProperties );
							imgWrapper.css( displayProperties );
							imgWrapper.css( {
								opacity: 0
							} );
						}

						clearTimeout( grid.slideShow.spinner );
						spinnerPh.fadeOut( 300, function( ) {
							spinnerPh.empty( );
						} );

						var imageIndex = grid.opt.showIndexinFullscreen ? jQuery( "<span/>" ).addClass( "tg-image-index" ).html( ( idx + 1 ) + "/" + imagesList.length + " " ) : "";
						var captionLabel = jQuery( "<label/>" ).html( imageCaption ).prepend( imageIndex );

						if ( image.data( "caption" ) )
							imgContainer.append( captionLabel );

						if ( animate )
							grid.isAnimating = true;

						setTimeout( function( ) {
							imgWrapper.CSSAnimate( displayProperties, grid.opt.gallery_timing, 50, grid.opt.ease );
							oldImgWrapper.CSSAnimate( grid.slideShow.effect.out, grid.opt.gallery_timing, 120, grid.opt.ease, function( ) {

								grid.isAnimating = false;
								oldImgWrapper.removeClass( "in" );
								jQuery( ".tg-img-wrapper", placeHolder ).not( ".in" ).remove( );
							} );
						}, 50 );

					};

					if ( contentType == "image" ) {

						img.one( "load", function( ) {

							var el = img.get( 0 );

							if ( el.loaded )
								return;

							el.loaded = true;

							showContent( );
							imgContainer.css( {
								backgroundImage: "url(" + imageToShowURL + ")",
								backgroundSize: grid.gallery_cover && !jQuery.isMobile ? "cover" : "contain",
								backgroundPosition: "center center",
								backgroundRepeat: "no-repeat"
							} );

						} ).attr( {
							src: imageToShowURL
						} );


					} else if ( contentType == "video" ) {
						showContent( );
						content = jQuery( "<iframe/>" ).attr( "src", videoToShowURL );
						content.css( {
							width: "100%",
							height: 300,
							marginTop: 50,
							border: "none"
						} );
						imgContainer.html( content );

					} else {

						showContent( );
						content = jQuery( "#" + contentToShowID ).clone( true );
						content.css( {
							width: "100%",
							height: "100%"
						} );
						imgContainer.html( content );
					}

				},

				/**
				 *
				 *
				 */
				next: function( ) {

					grid.slideShow.effect = grid.slideShow.effectNext;

					if ( grid.isAnimating && jQuery.browser.msie )
						return;

					var imagesList = grid.elements;
					++grid.slideShowIdx;
					if ( grid.slideShowIdx == jQuery( imagesList ).length ) {
						grid.slideShowIdx = 0;
					}
					grid.slideShow.goTo( true );
				},

				/**
				 *
				 */
				prev: function( ) {

					grid.slideShow.effect = grid.slideShow.effectPrev;

					if ( grid.isAnimating && jQuery.browser.msie )
						return;

					var imagesList = grid.elements;
					--grid.slideShowIdx;
					if ( grid.slideShowIdx == -1 ) {
						grid.slideShowIdx = jQuery( imagesList )
							.length - 1;
					}
					grid.slideShow.goTo( true );
				}

			};

			if ( jQuery.isMobile ) {

				grid.slideShow.effectNext = jQuery.thumbGallery.transitions[ "mobSlide" ][ "next" ];
				grid.slideShow.effectPrev = jQuery.thumbGallery.transitions[ "mobSlide" ][ "prev" ];

				overlay.swipe( {
					allowPageScroll: "auto",
					threshold: 75,
					triggerOnTouchEnd: false,

					swipeStatus: function( event, phase, direction, distance ) {

						if ( phase == "move" ) {
							event.preventDefault( );
							event.stopPropagation( );
						}

						if ( grid.isAnimating )
							return;

						if ( phase == "end" ) {

							if ( direction == "left" ) {
								grid.slideShow.next( );
							} else {
								grid.slideShow.prev( );
							}

							if ( typeof grid.opt.onFullscreenChange == "function" )
								grid.opt.onFullscreenChange( grid )
						}

					},
					swipe: function( event, direction, distance, duration, fingerCount, fingerData ) {}

				} );

			}

			jQuery( "body" ).append( overlay );
			overlay.CSSAnimate( {
				opacity: 1
			}, 600, 300, function( ) {

				placeHolder.CSSAnimate( {
					width: "100%",
					height: "100%",
					left: 0,
					top: 0,
					opacity: 1
				}, 400, 0, grid.opt.ease, function( ) {
					grid.slideShow.init( grid );
					jQuery( ".tg-icon", overlay ).fadeTo( 200, 1 );

				} )

			} );

		},

		/**
		 *
		 * @param el
		 * @param idx
		 */
		closeSlideShow: function( el, idx ) {

			jQuery( "body" ).trigger( "closeSlideShow" );

			var grid = el,
				$grid = jQuery( grid ),
				origin = $grid.find( "[data-globalindex=" + idx + "]" )
				.parents( "li" ),
				pHleft = origin.offset( )
				.left - jQuery( window )
				.scrollLeft( ),
				pHtop = origin.offset( )
				.top - jQuery( window )
				.scrollTop( ),
				pHwidth = origin.outerWidth( ),
				pHheight = origin.outerHeight( );

			jQuery( ".tg-overlay .tg-icon" ).fadeTo( 200, 0 );
			jQuery( ".tg-placeHolder > div" ).fadeOut( 500 );
			jQuery( ".tg-placeHolder" ).CSSAnimate( {
				width: pHwidth,
				height: pHheight,
				left: pHleft,
				top: pHtop,
				opacity: 1
			}, 800, 400, grid.opt.ease, function( ) {
				var overlay = jQuery( ".tg-overlay" );
				overlay.CSSAnimate( {
					opacity: 0
				}, 600, function( ) {
					overlay.remove( );
					jQuery( "body" ).css( {
						overflow: "auto"
					} );
				} );
			} );

			if ( typeof grid.opt.onExitFullScreen == "function" ) {
				grid.opt.onExitFullScreen( grid );
			}

		}
	};

	jQuery.fn.thumbGallery = jQuery.thumbGallery.init;
} )( jQuery );