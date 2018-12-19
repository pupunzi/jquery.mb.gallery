/*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 jquery.mb.components
 
 file: jquery.mb.gallery.src.js
 last modified: 10/25/18 8:00 PM
 Version:  1.3.1
 Build:  {{ buildnum }}
 
 Open Lab s.r.l., Florence - Italy
 email:  matteo@open-lab.com
 blog: 	http://pupunzi.open-lab.com
 site: 	http://pupunzi.com
 	http://open-lab.com
 
 Licences: MIT, GPL
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl.html
 
 Copyright (c) 2001-2018. Matteo Bicocchi (Pupunzi)
 :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

( function( $ ) {
	jQuery.mbGallery = {

		name: "jquery.mb.mbGallery",
		version: "1.3.1",
		build: "942",
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
			thumb_cover: true,

			layout: "default", //or grid
			layout_cols: 3,
			layout_margin: 5,
			layout_has_caption: true,

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
						scale: 2,
						opacity: 0
					},
					out: {
						scale: 0.1,
						opacity: 0
					},
					nav_delay_inverse: false
				},
				next: { in: {
						scale: 0.1,
						opacity: 0
					},
					out: {
						scale: 2,
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
				jQuery.extend( grid.opt, jQuery.mbGallery.defaults, options );

				$grid.hide( );

				grid.isAnimating = false;
				grid.pageIndex = 0;

				grid.id = grid.id ? grid.id : "mbGallery_" + new Date( ).getTime( );
				grid.setAttribute( "gid", "mbGallery_" + new Date( ).getTime( ) );

				grid.nav_effect = $grid.data( "nav_effect" ) || grid.opt.nav_effect;
				grid.nav_delay = $grid.data( "nav_delay" ) || grid.opt.nav_delay;
				grid.nav_delay_inverse = $grid.data( "nav_delay_inverse" ) || grid.opt.nav_delay_inverse;
				grid.nav_timing = $grid.data( "nav_timing" ) || opt.nav_timing;
				grid.nav_pagination = typeof $grid.data( "nav_pagination" ) != "undefined" ? $grid.data( "nav_pagination" ) : grid.opt.nav_pagination;
				grid.nav_pagination = jQuery.isMobile && !jQuery.isTablet ? 1 : grid.nav_pagination;
				grid.gallery_fullscreen_w = $grid.data( "gallery_fullscreen_w" ) || grid.opt.gallery_fullscreen_w;
				grid.gallery_fullscreen_h = $grid.data( "gallery_fullscreen_h" ) || grid.opt.gallery_fullscreen_h;
				grid.gallery_cover = typeof( $grid.data( "gallery_cover" ) ) != "undefined" ? $grid.data( "gallery_cover" ) : grid.opt.gallery_cover;
				grid.thumb_cover = typeof( $grid.data( "thumb_cover" ) ) != "undefined" ? $grid.data( "thumb_cover" ) : grid.opt.thumb_cover;
				grid.thumb_ratio = eval( $grid.data( "thumb_ratio" ) ) || grid.opt.thumb_ratio;
				grid.gallery_effect = $grid.data( "gallery_effect" ) || grid.nav_effect;
				grid.gallery_timing = $grid.data( "gallery_timing" ) || 1000;
				grid.nav_show = typeof $grid.data( "nav_show" ) != "undefined" ? $grid.data( "nav_show" ) : grid.opt.nav_show;
				grid.nav_show = jQuery.isMobile ? true : grid.nav_show;

				grid.layout = $grid.data( "layout" ) || grid.opt.layout;
				grid.layout_cols = $grid.data( "layout_cols" ) || grid.opt.layout_cols;
				grid.layout_margin = $grid.data( "layout_margin" ) || grid.opt.layout_margin;
				grid.layout_has_caption = $grid.data( "layout_has_caption" ) || grid.opt.layout_has_caption;

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

				jQuery.mbGallery.drawPage( grid, false );

				if ( grid.full_inline )
					jQuery.mbGallery.drawFullInline( grid );

				if ( grid.opt.layout == "grid" )
					$grid.addClass( "grid-layout" );

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
				backgroundSize: "cover",
				backgroundRepeat: "no-repeat",
				backgroundPosition: "center center"
			} );

			jQuery.mbGallery.showFullInline( grid, 0 );

			/* Set the correct height to the mbGallery*/
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
			var layout = grid.opt.layout;
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
					backgroundSize: grid.thumb_cover ? "cover" : "contain",
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
					if ( ( grid.nav_pagination == 1 || grid.opt.layout_has_caption ) && thumb.data( "caption" ) ) {
						var captionBox = jQuery( "<div/>" ).addClass( "tg-captionBox" ).html( thumb.data( "caption" ) );
						thumb_box.after( captionBox );
					} else {
						jQuery( ".tg-captionBox", thumb_box ).remove( );
					}

					thumbWrapper.data( "idx", x );
					thumbWrapper.on( jQuery.mbGallery.events.end, function( e ) {

						if ( grid.isAnimating )
							return;

						var idx = jQuery( ".thumb_box", this ).data( "globalindex" );

						if ( grid.full_inline ) {
							jQuery.mbGallery.showFullInline( grid, idx );
						} else {
							jQuery.mbGallery.drawSlideShow( grid, idx );
						}
						e.originalEvent.preventDefault( );
					} );

					if ( applyEffect ) {
						thumbWrapper.css( {
							opacity: 0
						} );
						grid.direction = grid.direction || "next";
						var transitionIn = jQuery.normalizeCss( jQuery.mbGallery.transitions[ $grid.data( "nav_effect" ) ][ grid.direction ].in );
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
					var next = jQuery( "<div/>" ).addClass( "tg-next tg-icon" ).on( jQuery.mbGallery.events.end, function( e ) {
						jQuery.mbGallery.nextPage( grid );
						e.originalEvent.preventDefault( );
					} );
					var prev = jQuery( "<div/>" ).addClass( "tg-prev tg-icon" ).on( jQuery.mbGallery.events.end, function( e ) {
						jQuery.mbGallery.prevPage( grid );
						e.originalEvent.preventDefault( );
					} );
					if ( grid.elements.length > grid.nav_pagination && !grid.nav_show )
						$page.append( next ).append( prev );
					$page.addClass( "active" );
				} else {
					break;
				}
			}
			grid.thumbSize = jQuery.mbGallery.setThumbSize( grid, jQuery( ".thumbWrapper", $page ) );
			jQuery( window ).off( "resize.mbGallery_" + grid.id ).on( "resize.mbGallery_" + grid.id, function( ) {

				var el = jQuery( ".thumbWrapper", $page );
				grid.thumbSize = jQuery.mbGallery.setThumbSize( grid, el );
				/*
				        $grid.css( {
				          height: grid.full_inline ? grid.full_inline_height + ( grid.thumbSize.h + 5 ) : grid.thumbSize.h
				        } );
				*/

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

								grid.nav_effect = jQuery.mbGallery.transitions[ "mobSlide" ];
								jQuery.mbGallery.nextPage( grid );

							} else if ( direction == "right" ) {
								grid.nav_effect = jQuery.mbGallery.transitions[ "mobSlide" ];
								jQuery.mbGallery.prevPage( grid );
							}

							return false;
						}
					}
				} );
			}

			grid.direction = grid.direction || "next";

			var ease = jQuery.mbGallery.transitions[ $grid.data( "nav_effect" ) ][ grid.direction ].ease || grid.opt.ease;

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
				var delayIn = jQuery.mbGallery.transitions[ $grid.data( "nav_effect" ) ][ grid.direction ].sequence ? grid.nav_delay * 3 : 0;
				var nav_delay_inverse = jQuery.mbGallery.transitions[ $grid.data( "nav_effect" ) ][ grid.direction ].nav_delay_inverse;

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
					var transitionOut = jQuery.mbGallery.transitions[ $grid.data( "nav_effect" ) ][ grid.direction ].out;
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
					jQuery.mbGallery.buildIndex( grid );
					grid.isAnimating = false;

					if ( typeof grid.nav != "undefined" && grid.nav_show ) {
						grid.nav.show( );

					}
				}
			}, 100 );

			jQuery( window ).on( "resize.mbGallery", function( ) {
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

			if ( grid.opt.layout == "grid" && ( grid.width / grid.opt.layout_cols ) > w )
				// w = ( grid.width / grid.opt.layout_cols ) - ( grid.opt.layout_margin * grid.opt.layout_cols ) + ( grid.opt.layout_margin / grid.opt.layout_cols ) + grid.opt.layout_margin / 2;
				w = ( grid.width / grid.opt.layout_cols ) - ( grid.opt.layout_margin * grid.opt.layout_cols );

			var h = w / grid.thumb_ratio;

			el.each( function( ) {
				jQuery( this ).css( {
					width: w,
					height: h
				} );

				if ( grid.opt.layout == "grid" )
					jQuery( this ).css( {
						margin: grid.opt.layout_margin
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

			jQuery.mbGallery.drawPage( grid, true );

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

			jQuery.mbGallery.drawPage( grid, true );

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
				idxPlaceHolder.on( jQuery.mbGallery.events.end, function( e ) {
					var pageIndex = jQuery( this ).attr( "idx" );
					grid.direction = grid.pageIndex < pageIndex ? "next" : "prev";
					if ( grid.isAnimating || grid.pageIndex == pageIndex )
						return;
					if ( jQuery.isMobile ) {
						if ( pageIndex < grid.pageIndex )
							grid.nav_effect = jQuery.mbGallery.transitions[ "mobSlide" ][ "prev" ];
						else
							grid.nav_effect = jQuery.mbGallery.transitions[ "mobSlide" ][ "next" ];
					}
					grid.pageIndex = pageIndex;
					jQuery.mbGallery.drawPage( grid );
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
				backgroundSize: "cover",
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
			} ).off( jQuery.mbGallery.events.end ).on( jQuery.mbGallery.events.end, function( ) {
				jQuery.mbGallery.drawSlideShow( grid, grid.fullInlineImg.attr( "idx" ) );
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
			var slideShowClose = jQuery( "<div/>" ).addClass( "tg-close tg-icon" ).on( jQuery.mbGallery.events.end, function( ) {
				jQuery.mbGallery.closeSlideShow( el, idx )
			} );
			var slideShowNext = jQuery( "<div/>" ).addClass( "tg-next tg-icon" ).on( jQuery.mbGallery.events.end, function( ) {
				grid.slideShow.next( )
			} );
			var slideShowPrev = jQuery( "<div/>" ).addClass( "tg-prev tg-icon" ).on( jQuery.mbGallery.events.end, function( ) {
				grid.slideShow.prev( )
			} );
			var spinnerPh = jQuery( "<div/>" ).addClass( "tg-spinner" );
			var $origin = grid.full_inline ? jQuery( ".inline-full-box", $grid ) : jQuery( "[data-globalindex=" + idx + "]", $grid ).parent( "li" );
			var pHleft = $origin.offset( ).left - jQuery( window ).scrollLeft( );
			var pHtop = $origin.offset( ).top - jQuery( window ).scrollTop( );
			var pHwidth = $origin.outerWidth( );
			var pHheight = $origin.outerHeight( );

			grid.nav_effect = jQuery.mbGallery.transitions[ grid.nav_effect ] || jQuery.mbGallery.transitions[ "fade" ];
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
				effectNext: jQuery.mbGallery.transitions[ grid.gallery_effect ][ "next" ] || grid.gallery_effect[ "next" ],
				effectPrev: jQuery.mbGallery.transitions[ grid.gallery_effect ][ "prev" ] || grid.gallery_effect[ "prev" ],

				/**
				 *
				 * @param on
				 */
				keyboard: function( on ) {

					if ( on ) {
						jQuery( document ).on( "keydown.mbGallery", function( e ) {

							switch ( e.keyCode ) {

								case 27: //Esc
									jQuery.mbGallery.closeSlideShow( el, idx );
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
						jQuery( document ).off( "keydown.mbGallery" );
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
						var cssProp = jQuery.normalizeCss( grid.slideShow.effect.in );
						imgWrapper.css( cssProp );
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
							imgWrapper.css( jQuery.normalizeCss( grid.slideShow.effect.in ) );
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
							oldImgWrapper.CSSAnimate( grid.slideShow.effect.out, grid.opt.gallery_timing, 0, grid.opt.ease, function( ) {
								grid.isAnimating = false;
								slideShowPrev.removeClass( "disabled" );
								slideShowNext.removeClass( "disabled" );
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

					if ( grid.isAnimating )
						return;

					slideShowPrev.addClass( "disabled" );
					slideShowNext.addClass( "disabled" );

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
					if ( grid.isAnimating )
						return;

					slideShowPrev.addClass( "disabled" );
					slideShowNext.addClass( "disabled" );

					var imagesList = grid.elements;
					--grid.slideShowIdx;
					if ( grid.slideShowIdx == -1 ) {
						grid.slideShowIdx = jQuery( imagesList ).length - 1;
					}
					grid.slideShow.goTo( true );
				}

			};

			if ( jQuery.isMobile ) {

				grid.slideShow.effectNext = jQuery.mbGallery.transitions[ "mobSlide" ][ "next" ];
				grid.slideShow.effectPrev = jQuery.mbGallery.transitions[ "mobSlide" ][ "prev" ];

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
				origin = grid.full_inline ? jQuery( ".inline-full-box", $grid ) : jQuery( "[data-globalindex=" + idx + "]", $grid )
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

	jQuery.fn.mbGallery = jQuery.mbGallery.init;
} )( jQuery );;
/*
 * ******************************************************************************
 *  jquery.mb.components
 *  file: jquery.mb.CSSAnimate.min.js
 *
 *  Copyright (c) 2001-2014. Matteo Bicocchi (Pupunzi);
 *  Open lab srl, Firenze - Italy
 *  email: matbicoc@gmail.com
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

jQuery.support.CSStransition=function(){var d=(document.body||document.documentElement).style;return void 0!==d.transition||void 0!==d.WebkitTransition||void 0!==d.MozTransition||void 0!==d.MsTransition||void 0!==d.OTransition}();function uncamel(d){return d.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function setUnit(d,a){return"string"!==typeof d||d.match(/^[\-0-9\.]+jQuery/)?""+d+a:d}
function setFilter(d,a,b){var c=uncamel(a),g=jQuery.browser.mozilla?"":jQuery.CSS.sfx;d[g+"filter"]=d[g+"filter"]||"";b=setUnit(b>jQuery.CSS.filters[a].max?jQuery.CSS.filters[a].max:b,jQuery.CSS.filters[a].unit);d[g+"filter"]+=c+"("+b+") ";delete d[a]}
jQuery.CSS={name:"mb.CSSAnimate",author:"Matteo Bicocchi",version:"2.0.0",transitionEnd:"transitionEnd",sfx:"",filters:{blur:{min:0,max:100,unit:"px"},brightness:{min:0,max:400,unit:"%"},contrast:{min:0,max:400,unit:"%"},grayscale:{min:0,max:100,unit:"%"},hueRotate:{min:0,max:360,unit:"deg"},invert:{min:0,max:100,unit:"%"},saturate:{min:0,max:400,unit:"%"},sepia:{min:0,max:100,unit:"%"}},normalizeCss:function(d){var a=jQuery.extend(!0,{},d);jQuery.browser.webkit||jQuery.browser.opera?jQuery.CSS.sfx=
		"-webkit-":jQuery.browser.mozilla?jQuery.CSS.sfx="-moz-":jQuery.browser.msie&&(jQuery.CSS.sfx="-ms-");jQuery.CSS.sfx="";for(var b in a){"transform"===b&&(a[jQuery.CSS.sfx+"transform"]=a[b],delete a[b]);"transform-origin"===b&&(a[jQuery.CSS.sfx+"transform-origin"]=d[b],delete a[b]);"filter"!==b||jQuery.browser.mozilla||(a[jQuery.CSS.sfx+"filter"]=d[b],delete a[b]);"blur"===b&&setFilter(a,"blur",d[b]);"brightness"===b&&setFilter(a,"brightness",d[b]);"contrast"===b&&setFilter(a,"contrast",d[b]);"grayscale"===
b&&setFilter(a,"grayscale",d[b]);"hueRotate"===b&&setFilter(a,"hueRotate",d[b]);"invert"===b&&setFilter(a,"invert",d[b]);"saturate"===b&&setFilter(a,"saturate",d[b]);"sepia"===b&&setFilter(a,"sepia",d[b]);if("x"===b){var c=jQuery.CSS.sfx+"transform";a[c]=a[c]||"";a[c]+=" translateX("+setUnit(d[b],"px")+")";delete a[b]}"y"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" translateY("+setUnit(d[b],"px")+")",delete a[b]);"z"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" translateZ("+
		setUnit(d[b],"px")+")",delete a[b]);"rotate"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" rotate("+setUnit(d[b],"deg")+")",delete a[b]);"rotateX"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" rotateX("+setUnit(d[b],"deg")+")",delete a[b]);"rotateY"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" rotateY("+setUnit(d[b],"deg")+")",delete a[b]);"rotateZ"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" rotateZ("+setUnit(d[b],"deg")+")",delete a[b]);"scale"===b&&
(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" scale("+setUnit(d[b],"")+")",delete a[b]);"scaleX"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" scaleX("+setUnit(d[b],"")+")",delete a[b]);"scaleY"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" scaleY("+setUnit(d[b],"")+")",delete a[b]);"scaleZ"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" scaleZ("+setUnit(d[b],"")+")",delete a[b]);"skew"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" skew("+setUnit(d[b],
		"deg")+")",delete a[b]);"skewX"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" skewX("+setUnit(d[b],"deg")+")",delete a[b]);"skewY"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" skewY("+setUnit(d[b],"deg")+")",delete a[b]);"perspective"===b&&(c=jQuery.CSS.sfx+"transform",a[c]=a[c]||"",a[c]+=" perspective("+setUnit(d[b],"px")+")",delete a[b])}return a},getProp:function(d){var a=[],b;for(b in d)0>a.indexOf(b)&&a.push(uncamel(b));return a.join(",")},animate:function(d,a,b,c,g){return this.each(function(){function n(){e.called=
		!0;e.CSSAIsRunning=!1;h.off(jQuery.CSS.transitionEnd+"."+e.id);clearTimeout(e.timeout);h.css(jQuery.CSS.sfx+"transition","");"function"==typeof g&&g.apply(e);"function"==typeof e.CSSqueue&&(e.CSSqueue(),e.CSSqueue=null)}var e=this,h=jQuery(this);e.id=e.id||"CSSA_"+(new Date).getTime();var k=k||{type:"noEvent"};if(e.CSSAIsRunning&&e.eventType==k.type&&!jQuery.browser.msie&&9>=jQuery.browser.version)e.CSSqueue=function(){h.CSSAnimate(d,a,b,c,g)};else if(e.CSSqueue=null,e.eventType=k.type,0!==h.length&&
		d){d=jQuery.normalizeCss(d);e.CSSAIsRunning=!0;"function"==typeof a&&(g=a,a=jQuery.fx.speeds._default);"function"==typeof b&&(c=b,b=0);"string"==typeof b&&(g=b,b=0);"function"==typeof c&&(g=c,c="cubic-bezier(0.65,0.03,0.36,0.72)");if("string"==typeof a)for(var l in jQuery.fx.speeds)if(a==l){a=jQuery.fx.speeds[l];break}else a=jQuery.fx.speeds._default;a||(a=jQuery.fx.speeds._default);"string"===typeof g&&(c=g,g=null);if(jQuery.support.CSStransition){var f={"default":"ease","in":"ease-in",out:"ease-out",
	"in-out":"ease-in-out",snap:"cubic-bezier(0,1,.5,1)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",
	easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"};
	f[c]&&(c=f[c]);h.off(jQuery.CSS.transitionEnd+"."+e.id);f=jQuery.CSS.getProp(d);var m={};jQuery.extend(m,d);m[jQuery.CSS.sfx+"transition-property"]=f;m[jQuery.CSS.sfx+"transition-duration"]=a+"ms";m[jQuery.CSS.sfx+"transition-delay"]=b+"ms";m[jQuery.CSS.sfx+"transition-timing-function"]=c;setTimeout(function(){h.one(jQuery.CSS.transitionEnd+"."+e.id,n);h.css(m)},1);e.timeout=setTimeout(function(){e.called||!g?(e.called=!1,e.CSSAIsRunning=!1):(h.css(jQuery.CSS.sfx+"transition",""),g.apply(e),e.CSSAIsRunning=
			!1,"function"==typeof e.CSSqueue&&(e.CSSqueue(),e.CSSqueue=null))},a+b+10)}else{for(f in d)"transform"===f&&delete d[f],"filter"===f&&delete d[f],"transform-origin"===f&&delete d[f],"auto"===d[f]&&delete d[f],"x"===f&&(k=d[f],l="left",d[l]=k,delete d[f]),"y"===f&&(k=d[f],l="top",d[l]=k,delete d[f]),"-ms-transform"!==f&&"-ms-filter"!==f||delete d[f];h.delay(b).animate(d,a,g)}}})}};jQuery.fn.CSSAnimate=jQuery.CSS.animate;jQuery.normalizeCss=jQuery.CSS.normalizeCss;
jQuery.fn.css3=function(d){return this.each(function(){var a=jQuery(this),b=jQuery.normalizeCss(d);a.css(b)})};
;/*___________________________________________________________________________________________________________________________________________________
 _ jquery.mb.components                                                                                                                             _
 _                                                                                                                                                  _
 _ file: jquery.mb.browser.min.js                                                                                                                   _
 _ last modified: 24/05/17 19.56                                                                                                                    _
 _                                                                                                                                                  _
 _ Open Lab s.r.l., Florence - Italy                                                                                                                _
 _                                                                                                                                                  _
 _ email: matbicoc@gmail.com                                                                                                                       _
 _ site: http://pupunzi.com                                                                                                                         _
 _       http://open-lab.com                                                                                                                        _
 _ blog: http://pupunzi.open-lab.com                                                                                                                _
 _ Q&A:  http://jquery.pupunzi.com                                                                                                                  _
 _                                                                                                                                                  _
 _ Licences: MIT, GPL                                                                                                                               _
 _    http://www.opensource.org/licenses/mit-license.php                                                                                            _
 _    http://www.gnu.org/licenses/gpl.html                                                                                                          _
 _                                                                                                                                                  _
 _ Copyright (c) 2001-2017. Matteo Bicocchi (Pupunzi);                                                                                              _
 ___________________________________________________________________________________________________________________________________________________*/

var nAgt=navigator.userAgent;jQuery.browser=jQuery.browser||{};jQuery.browser.mozilla=!1;jQuery.browser.webkit=!1;jQuery.browser.opera=!1;jQuery.browser.safari=!1;jQuery.browser.chrome=!1;jQuery.browser.androidStock=!1;jQuery.browser.msie=!1;jQuery.browser.edge=!1;jQuery.browser.ua=nAgt;function isTouchSupported(){var a=nAgt.msMaxTouchPoints,e="ontouchstart"in document.createElement("div");return a||e?!0:!1}
var getOS=function(){var a={version:"Unknown version",name:"Unknown OS"};-1!=navigator.appVersion.indexOf("Win")&&(a.name="Windows");-1!=navigator.appVersion.indexOf("Mac")&&0>navigator.appVersion.indexOf("Mobile")&&(a.name="Mac");-1!=navigator.appVersion.indexOf("Linux")&&(a.name="Linux");/Mac OS X/.test(nAgt)&&!/Mobile/.test(nAgt)&&(a.version=/Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1],a.version=a.version.replace(/_/g,".").substring(0,5));/Windows/.test(nAgt)&&(a.version="Unknown.Unknown");/Windows NT 5.1/.test(nAgt)&&
(a.version="5.1");/Windows NT 6.0/.test(nAgt)&&(a.version="6.0");/Windows NT 6.1/.test(nAgt)&&(a.version="6.1");/Windows NT 6.2/.test(nAgt)&&(a.version="6.2");/Windows NT 10.0/.test(nAgt)&&(a.version="10.0");/Linux/.test(nAgt)&&/Linux/.test(nAgt)&&(a.version="Unknown.Unknown");a.name=a.name.toLowerCase();a.major_version="Unknown";a.minor_version="Unknown";"Unknown.Unknown"!=a.version&&(a.major_version=parseFloat(a.version.split(".")[0]),a.minor_version=parseFloat(a.version.split(".")[1]));return a};
jQuery.browser.os=getOS();jQuery.browser.hasTouch=isTouchSupported();jQuery.browser.name=navigator.appName;jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion);jQuery.browser.majorVersion=parseInt(navigator.appVersion,10);var nameOffset,verOffset,ix;
if(-1!=(verOffset=nAgt.indexOf("Opera")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=nAgt.substring(verOffset+6),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8));else if(-1!=(verOffset=nAgt.indexOf("OPR")))jQuery.browser.opera=!0,jQuery.browser.name="Opera",jQuery.browser.fullVersion=nAgt.substring(verOffset+4);else if(-1!=(verOffset=nAgt.indexOf("MSIE")))jQuery.browser.msie=!0,jQuery.browser.name="Microsoft Internet Explorer",
		jQuery.browser.fullVersion=nAgt.substring(verOffset+5);else if(-1!=nAgt.indexOf("Trident")){jQuery.browser.msie=!0;jQuery.browser.name="Microsoft Internet Explorer";var start=nAgt.indexOf("rv:")+3,end=start+4;jQuery.browser.fullVersion=nAgt.substring(start,end)}else-1!=(verOffset=nAgt.indexOf("Edge"))?(jQuery.browser.edge=!0,jQuery.browser.name="Microsoft Edge",jQuery.browser.fullVersion=nAgt.substring(verOffset+5)):-1!=(verOffset=nAgt.indexOf("Chrome"))?(jQuery.browser.webkit=!0,jQuery.browser.chrome=
		!0,jQuery.browser.name="Chrome",jQuery.browser.fullVersion=nAgt.substring(verOffset+7)):-1<nAgt.indexOf("mozilla/5.0")&&-1<nAgt.indexOf("android ")&&-1<nAgt.indexOf("applewebkit")&&!(-1<nAgt.indexOf("chrome"))?(verOffset=nAgt.indexOf("Chrome"),jQuery.browser.webkit=!0,jQuery.browser.androidStock=!0,jQuery.browser.name="androidStock",jQuery.browser.fullVersion=nAgt.substring(verOffset+7)):-1!=(verOffset=nAgt.indexOf("Safari"))?(jQuery.browser.webkit=!0,jQuery.browser.safari=!0,jQuery.browser.name=
		"Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("AppleWebkit"))?(jQuery.browser.webkit=!0,jQuery.browser.safari=!0,jQuery.browser.name="Safari",jQuery.browser.fullVersion=nAgt.substring(verOffset+7),-1!=(verOffset=nAgt.indexOf("Version"))&&(jQuery.browser.fullVersion=nAgt.substring(verOffset+8))):-1!=(verOffset=nAgt.indexOf("Firefox"))?(jQuery.browser.mozilla=
		!0,jQuery.browser.name="Firefox",jQuery.browser.fullVersion=nAgt.substring(verOffset+8)):(nameOffset=nAgt.lastIndexOf(" ")+1)<(verOffset=nAgt.lastIndexOf("/"))&&(jQuery.browser.name=nAgt.substring(nameOffset,verOffset),jQuery.browser.fullVersion=nAgt.substring(verOffset+1),jQuery.browser.name.toLowerCase()==jQuery.browser.name.toUpperCase()&&(jQuery.browser.name=navigator.appName));
-1!=(ix=jQuery.browser.fullVersion.indexOf(";"))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix));-1!=(ix=jQuery.browser.fullVersion.indexOf(" "))&&(jQuery.browser.fullVersion=jQuery.browser.fullVersion.substring(0,ix));jQuery.browser.majorVersion=parseInt(""+jQuery.browser.fullVersion,10);isNaN(jQuery.browser.majorVersion)&&(jQuery.browser.fullVersion=""+parseFloat(navigator.appVersion),jQuery.browser.majorVersion=parseInt(navigator.appVersion,10));
jQuery.browser.version=jQuery.browser.majorVersion;jQuery.browser.android=/Android/i.test(nAgt);jQuery.browser.blackberry=/BlackBerry|BB|PlayBook/i.test(nAgt);jQuery.browser.ios=/iPhone|iPad|iPod|webOS/i.test(nAgt);jQuery.browser.operaMobile=/Opera Mini/i.test(nAgt);jQuery.browser.windowsMobile=/IEMobile|Windows Phone/i.test(nAgt);jQuery.browser.kindle=/Kindle|Silk/i.test(nAgt);
jQuery.browser.mobile=jQuery.browser.android||jQuery.browser.blackberry||jQuery.browser.ios||jQuery.browser.windowsMobile||jQuery.browser.operaMobile||jQuery.browser.kindle;jQuery.isMobile=jQuery.browser.mobile;jQuery.isTablet=jQuery.browser.mobile&&765<jQuery(window).width();jQuery.isAndroidDefault=jQuery.browser.android&&!/chrome/i.test(nAgt);jQuery.mbBrowser=jQuery.browser;
jQuery.browser.versionCompare=function(a,e){if("stringstring"!=typeof a+typeof e)return!1;for(var c=a.split("."),d=e.split("."),b=0,f=Math.max(c.length,d.length);b<f;b++){if(c[b]&&!d[b]&&0<parseInt(c[b])||parseInt(c[b])>parseInt(d[b]))return 1;if(d[b]&&!c[b]&&0<parseInt(d[b])||parseInt(c[b])<parseInt(d[b]))return-1}return 0};
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
