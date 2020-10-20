"use strict";
(function () {
	// Global variables
	var
			userAgent = navigator.userAgent.toLowerCase(),
			initialDate = new Date(),

			$document = $(document),
			$window = $(window),
			$html = $("html"),
			$body = $("body"),

			isDesktop = $html.hasClass("desktop"),
			isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
			isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
			windowReady = false,
			isNoviBuilder = false,
			livedemo = false,

			plugins = {
				bootstrapModal:          $( '.modal '),
				captcha:                 $( '.recaptcha '),
				campaignMonitor:         $( '.campaign-mailform '),
				copyrightYear:           $( '.copyright-year '),
				materialParallax:        $( '.parallax-container '),
				mailchimp:               $( '.mailchimp-mailform '),
				owl:                     $( '.owl-carousel '),
				preloader:               $( '.preloader '),
				rdNavbar:                $( '.rd-navbar '),
				rdMailForm:              $( '.rd-mailform '),
				rdInputLabel:            $( '.form-label '),
				regula:                  $( '[data-constraints] '),
				search:                  $( '.rd-search '),
				wow:                     $( '.wow '),
				parallaxJs:              $( '.parallax-scene' ),
				swiper:                  document.querySelectorAll( '.swiper-container '),
				counter:                 document.querySelectorAll( '.counter '),
				multiToggles:            document.querySelectorAll( '[data-multitoggle] '),
				vide:                     $( '.vide '),
				buttonNuka:               $( '.button-nuka ')
			};

	/**
	 * @desc Check the element was been scrolled into the view
	 * @param {object} elem - jQuery object
	 * @return {boolean}
	 */
	function isScrolledIntoView(elem) {
		if (isNoviBuilder) return true;
		return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
	}

	// Initialize scripts that require a loaded window
	$window.on('load', function () {
		// Page loader & Page transition
		if (plugins.preloader.length && !isNoviBuilder) {
			pageTransition({
				target:            document.querySelector('.page'),
				delay:             0,
				duration:          500,
				classIn:           'fadeIn',
				classOut:          'fadeOut',
				classActive:       'animated',
				conditions:        function (event, link) {
					return link && !/(\#|javascript:void\(0\)|callto:|tel:|mailto:|:\/\/)/.test(link) && !event.currentTarget.hasAttribute('data-lightgallery');
				},
				onTransitionStart: function (options) {
					setTimeout(function () {
						plugins.preloader.removeClass('loaded');
					}, options.duration * .75);
				},
				onReady:           function () {
					plugins.preloader.addClass('loaded');
					windowReady = true;
				}
			});
		}

		// Counter
		if (plugins.counter) {
			for (let i = 0; i < plugins.counter.length; i++) {
				let
						node = plugins.counter[i],
						counter = aCounter({
							node:      node,
							duration:  node.getAttribute('data-duration') || 1000,
							formatter: node.hasAttribute('data-formatter') ? function (value) {

								return Number(value.toFixed()).toLocaleString(node.getAttribute('data-formatter'));

							} : null
						}),
						scrollHandler = (function () {
							if (Util.inViewport(this) && !this.classList.contains('animated-first')) {
								this.counter.run();
								this.classList.add('animated-first');
							}
						}).bind(node),
						blurHandler = (function () {
							this.counter.params.to = parseInt(this.textContent, 10);
							this.counter.run();
						}).bind(node);

				if (isNoviBuilder) {
					node.counter.run();
					node.addEventListener('blur', blurHandler);
				} else {
					scrollHandler();
					window.addEventListener('scroll', scrollHandler);
				}
			}
		}

		// Material Parallax
		if (plugins.materialParallax.length) {
			if (!isNoviBuilder && !isIE && !isMobile) {
				plugins.materialParallax.parallax();
			} else {
				for (var i = 0; i < plugins.materialParallax.length; i++) {
					var $parallax = $(plugins.materialParallax[i]);

					$parallax.addClass('parallax-disabled');
					$parallax.css({"background-image": 'url(' + $parallax.data("parallax-img") + ')'});
				}
			}
		}
	});

	// Initialize scripts that require a finished document
	$(function () {
		isNoviBuilder = window.xMode;

		// Multitoggles
		function toggleElementsVisibility(targets) {
			for (var z = 0; z < targets.length; z++) {
				var hiddenElements = targets[z].querySelectorAll('[aria-hidden="true"]'),
						visibleElements = targets[z].querySelectorAll('[aria-hidden="false"]');

				for (var k = 0; k < hiddenElements.length; k++) {
					hiddenElements[k].setAttribute('aria-hidden', 'false');
				}

				for (var k = 0; k < visibleElements.length; k++) {
					visibleElements[k].setAttribute('aria-hidden', 'true');
				}
			}
		}

		/**
		 * @desc Sets the actual previous index based on the position of the slide in the markup. Should be the most recent action.
		 * @param {object} swiper - swiper instance
		 */
		function setRealPrevious(swiper) {
			var element = swiper.$wrapperEl[0].children[swiper.activeIndex];
			swiper.realPrevious = Array.prototype.indexOf.call(element.parentNode.children, element);
		}

		/**
		 * @desc Sets slides background images from attribute 'data-slide-bg'
		 * @param {object} swiper - swiper instance
		 */
		function setBackgrounds(swiper) {
			let swiperSlides = swiper.el.querySelectorAll('[data-slide-bg]');
			for (let i = 0; i < swiperSlides.length; i++) {
				let swiperSlide = swiperSlides[i];
				swiperSlide.style.backgroundImage = 'url(' + swiperSlide.getAttribute('data-slide-bg') + ')';
			}
		}

		/**
		 * @desc Animate captions on active slides
		 * @param {object} swiper - swiper instance
		 */
		function initCaptionAnimate(swiper) {
			var
					animate = function (caption) {
						return function () {
							var duration;
							if (duration = caption.getAttribute('data-caption-duration')) caption.style.animationDuration = duration + 'ms';
							caption.classList.remove('not-animated');
							caption.classList.add(caption.getAttribute('data-caption-animate'));
							caption.classList.add('animated');
						};
					},
					initializeAnimation = function (captions) {
						for (var i = 0; i < captions.length; i++) {
							var caption = captions[i];
							caption.classList.remove('animated');
							caption.classList.remove(caption.getAttribute('data-caption-animate'));
							caption.classList.add('not-animated');
						}
					},
					finalizeAnimation = function (captions) {
						for (var i = 0; i < captions.length; i++) {
							var caption = captions[i];
							if (caption.getAttribute('data-caption-delay')) {
								setTimeout(animate(caption), Number(caption.getAttribute('data-caption-delay')));
							} else {
								animate(caption)();
							}
						}
					};

			// Caption parameters
			swiper.params.caption = {
				animationEvent: 'slideChangeTransitionEnd'
			};

			initializeAnimation(swiper.$wrapperEl[0].querySelectorAll('[data-caption-animate]'));
			finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));

			if (swiper.params.caption.animationEvent === 'slideChangeTransitionEnd') {
				swiper.on(swiper.params.caption.animationEvent, function () {
					initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
					finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
				});
			} else {
				swiper.on('slideChangeTransitionEnd', function () {
					initializeAnimation(swiper.$wrapperEl[0].children[swiper.previousIndex].querySelectorAll('[data-caption-animate]'));
				});

				swiper.on(swiper.params.caption.animationEvent, function () {
					finalizeAnimation(swiper.$wrapperEl[0].children[swiper.activeIndex].querySelectorAll('[data-caption-animate]'));
				});
			}
		}

		/**
		 * @desc Initialize owl carousel plugin
		 * @param {object} carousel - carousel jQuery object
		 */
		function initOwlCarousel(carousel) {
			var
					aliaces = ['-', '-sm-', '-md-', '-lg-', '-xl-', '-xxl-'],
					values = [0, 576, 768, 992, 1200, 1600],
					responsive = {};

			for (var j = 0; j < values.length; j++) {
				responsive[values[j]] = {};
				for (var k = j; k >= -1; k--) {
					if (!responsive[values[j]]['items'] && carousel.attr('data' + aliaces[k] + 'items')) {
						responsive[values[j]]['items'] = k < 0 ? 1 : parseInt(carousel.attr('data' + aliaces[k] + 'items'), 10);
					}
					if (!responsive[values[j]]['stagePadding'] && responsive[values[j]]['stagePadding'] !== 0 && carousel.attr('data' + aliaces[k] + 'stage-padding')) {
						responsive[values[j]]['stagePadding'] = k < 0 ? 0 : parseInt(carousel.attr('data' + aliaces[k] + 'stage-padding'), 10);
					}
					if (!responsive[values[j]]['margin'] && responsive[values[j]]['margin'] !== 0 && carousel.attr('data' + aliaces[k] + 'margin')) {
						responsive[values[j]]['margin'] = k < 0 ? 30 : parseInt(carousel.attr('data' + aliaces[k] + 'margin'), 10);
					}
				}
			}

			// Initialize lightgallery items in cloned owl items
			carousel.on('initialized.owl.carousel', function () {
				initLightGalleryItem(carousel.find('[data-lightgallery="item"]'), 'lightGallery-in-carousel');
			});

			carousel.owlCarousel({
				autoplay:           isNoviBuilder ? false : carousel.attr('data-autoplay') !== 'false',
				autoplayTimeout:    carousel.attr("data-autoplay-time-out") ? Number(carousel.attr("data-autoplay-time-out")) : 3000,
				smartSpeed:         carousel.attr("data-smart-speed") ? Number(carousel.attr("data-smart-speed")) : 250,
				autoplayHoverPause: carousel.attr("data-autoplay-hover-pause") === 'true',
				URLhashListener:    carousel.attr('data-hash-navigation') === 'true' || false,
				startPosition:      'URLHash',
				slideTransition:    carousel.attr("data-slide-transition") ? carousel.attr("data-slide-transition") : '',
				loop:               isNoviBuilder ? false : carousel.attr('data-loop') !== 'false',
				items:              1,
				autoHeight:         carousel.attr('data-auto-height') === 'true',
				center:             carousel.attr('data-center') === 'true',
				dotsContainer:      carousel.attr('data-pagination-class') || false,
				navContainer:       carousel.attr('data-navigation-class') || false,
				mouseDrag:          isNoviBuilder ? false : carousel.attr('data-mouse-drag') !== 'false',
				nav:                carousel.attr('data-nav') === 'true',
				dots:               carousel.attr('data-dots') === 'true',
				dotsEach:           carousel.attr('data-dots-each') ? parseInt(carousel.attr('data-dots-each'), 10) : false,
				animateIn:          carousel.attr('data-animation-in') ? carousel.attr('data-animation-in') : false,
				animateOut:         carousel.attr('data-animation-out') ? carousel.attr('data-animation-out') : false,
				responsive:         responsive,
				navText:            carousel.attr('data-nav-text') ? $.parseJSON(carousel.attr('data-nav-text')) : [],
				navClass:           carousel.attr('data-nav-class') ? $.parseJSON(carousel.attr('data-nav-class')) : ['owl-prev', 'owl-next']
			});
		}

		/**
		 * @desc Attach form validation to elements
		 * @param {object} elements - jQuery object
		 */
		function attachFormValidator(elements) {
			// Custom validator - phone number
			regula.custom({
				name:           'PhoneNumber',
				defaultMessage: 'Invalid phone number format',
				validator:      function () {
					if (this.value === '') return true;
					else return /^(\+\d)?[0-9\-\(\) ]{5,}$/i.test(this.value);
				}
			});

			for (var i = 0; i < elements.length; i++) {
				var o = $(elements[i]), v;
				o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
				v = o.parent().find(".form-validation");
				if (v.is(":last-child")) o.addClass("form-control-last-child");
			}

			elements.on('input change propertychange blur', function (e) {
				var $this = $(this), results;

				if (e.type !== "blur") if (!$this.parent().hasClass("has-error")) return;
				if ($this.parents('.rd-mailform').hasClass('success')) return;

				if ((results = $this.regula('validate')).length) {
					for (i = 0; i < results.length; i++) {
						$this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error");
					}
				} else {
					$this.siblings(".form-validation").text("").parent().removeClass("has-error")
				}
			}).regula('bind');

			var regularConstraintsMessages = [
				{
					type:       regula.Constraint.Required,
					newMessage: "The text field is required."
				},
				{
					type:       regula.Constraint.Email,
					newMessage: "The email is not a valid email."
				},
				{
					type:       regula.Constraint.Numeric,
					newMessage: "Only numbers are required"
				},
				{
					type:       regula.Constraint.Selected,
					newMessage: "Please choose an option."
				}
			];


			for (var i = 0; i < regularConstraintsMessages.length; i++) {
				var regularConstraint = regularConstraintsMessages[i];

				regula.override({
					constraintType: regularConstraint.type,
					defaultMessage: regularConstraint.newMessage
				});
			}
		}

		/**
		 * @desc Check if all elements pass validation
		 * @param {object} elements - object of items for validation
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function isValidated(elements, captcha) {
			var results, errors = 0;

			if (elements.length) {
				for (var j = 0; j < elements.length; j++) {

					var $input = $(elements[j]);
					if ((results = $input.regula('validate')).length) {
						for (k = 0; k < results.length; k++) {
							errors++;
							$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
						}
					} else {
						$input.siblings(".form-validation").text("").parent().removeClass("has-error")
					}
				}

				if (captcha) {
					if (captcha.length) {
						return validateReCaptcha(captcha) && errors === 0
					}
				}

				return errors === 0;
			}
			return true;
		}

		/**
		 * @desc Validate google reCaptcha
		 * @param {object} captcha - captcha object for validation
		 * @return {boolean}
		 */
		function validateReCaptcha(captcha) {
			var captchaToken = captcha.find('.g-recaptcha-response').val();

			if (captchaToken.length === 0) {
				captcha
				.siblings('.form-validation')
				.html('Please, prove that you are not robot.')
				.addClass('active');
				captcha
				.closest('.form-wrap')
				.addClass('has-error');

				captcha.on('propertychange', function () {
					var $this = $(this),
							captchaToken = $this.find('.g-recaptcha-response').val();

					if (captchaToken.length > 0) {
						$this
						.closest('.form-wrap')
						.removeClass('has-error');
						$this
						.siblings('.form-validation')
						.removeClass('active')
						.html('');
						$this.off('propertychange');
					}
				});

				return false;
			}

			return true;
		}

		/**
		 * @desc Initialize Google reCaptcha
		 */
		window.onloadCaptchaCallback = function () {
			for (var i = 0; i < plugins.captcha.length; i++) {
				var
						$captcha = $(plugins.captcha[i]),
						resizeHandler = (function () {
							var
									frame = this.querySelector('iframe'),
									inner = this.firstElementChild,
									inner2 = inner.firstElementChild,
									containerRect = null,
									frameRect = null,
									scale = null;

							inner2.style.transform = '';
							inner.style.height = 'auto';
							inner.style.width = 'auto';

							containerRect = this.getBoundingClientRect();
							frameRect = frame.getBoundingClientRect();
							scale = containerRect.width / frameRect.width;

							if (scale < 1) {
								inner2.style.transform = 'scale(' + scale + ')';
								inner.style.height = (frameRect.height * scale) + 'px';
								inner.style.width = (frameRect.width * scale) + 'px';
							}
						}).bind(plugins.captcha[i]);

				grecaptcha.render(
						$captcha.attr('id'),
						{
							sitekey:  $captcha.attr('data-sitekey'),
							size:     $captcha.attr('data-size') ? $captcha.attr('data-size') : 'normal',
							theme:    $captcha.attr('data-theme') ? $captcha.attr('data-theme') : 'light',
							callback: function () {
								$('.recaptcha').trigger('propertychange');
							}
						}
				);

				$captcha.after("<span class='form-validation'></span>");

				if (plugins.captcha[i].hasAttribute('data-auto-size')) {
					resizeHandler();
					window.addEventListener('resize', resizeHandler);
				}
			}
		};

		/**
		 * @desc Initialize the gallery with set of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initLightGallery(itemsToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemsToInit).lightGallery({
					thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
					selector:  "[data-lightgallery='item']",
					autoplay:  $(itemsToInit).attr("data-lg-autoplay") === "true",
					pause:     parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
					addClass:  addClass,
					mode:      $(itemsToInit).attr("data-lg-animation") || "lg-slide",
					loop:      $(itemsToInit).attr("data-lg-loop") !== "false"
				});
			}
		}

		/**
		 * @desc Initialize the gallery with dynamic addition of images
		 * @param {object} itemsToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initDynamicLightGallery(itemsToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemsToInit).on("click", function () {
					$(itemsToInit).lightGallery({
						thumbnail: $(itemsToInit).attr("data-lg-thumbnail") !== "false",
						selector:  "[data-lightgallery='item']",
						autoplay:  $(itemsToInit).attr("data-lg-autoplay") === "true",
						pause:     parseInt($(itemsToInit).attr("data-lg-autoplay-delay")) || 5000,
						addClass:  addClass,
						mode:      $(itemsToInit).attr("data-lg-animation") || "lg-slide",
						loop:      $(itemsToInit).attr("data-lg-loop") !== "false",
						dynamic:   true,
						dynamicEl: JSON.parse($(itemsToInit).attr("data-lg-dynamic-elements")) || []
					});
				});
			}
		}

		/**
		 * @desc Initialize the gallery with one image
		 * @param {object} itemToInit - jQuery object
		 * @param {string} [addClass] - additional gallery class
		 */
		function initLightGalleryItem(itemToInit, addClass) {
			if (!isNoviBuilder) {
				$(itemToInit).lightGallery({
					selector:            "this",
					addClass:            addClass,
					counter:             false,
					youtubePlayerParams: {
						modestbranding: 1,
						showinfo:       0,
						rel:            0,
						controls:       0
					},
					vimeoPlayerParams:   {
						byline:   0,
						portrait: 0
					}
				});
			}
		}

		// Google ReCaptcha
		if (plugins.captcha.length) {
			$.getScript("//www.google.com/recaptcha/api.js?onload=onloadCaptchaCallback&render=explicit&hl=en");
		}

		// Additional class on html if mac os.
		if (navigator.platform.match(/(Mac)/i)) {
			$html.addClass("mac-os");
		}

		// Adds some loosing functionality to IE browsers (IE Polyfills)
		if (isIE) {
			if (isIE === 12) $html.addClass("ie-edge");
			if (isIE === 11) $html.addClass("ie-11");
			if (isIE < 10) $html.addClass("lt-ie-10");
			if (isIE < 11) $html.addClass("ie-10");
		}

		// Bootstrap Modal
		if (plugins.bootstrapModal.length) {
			for (var i = 0; i < plugins.bootstrapModal.length; i++) {
				var modalItem = $(plugins.bootstrapModal[i]);

				modalItem.on('hidden.bs.modal', $.proxy(function () {
					var activeModal = $(this),
							rdVideoInside = activeModal.find('video'),
							youTubeVideoInside = activeModal.find('iframe');

					if (rdVideoInside.length) {
						rdVideoInside[0].pause();
					}

					if (youTubeVideoInside.length) {
						var videoUrl = youTubeVideoInside.attr('src');

						youTubeVideoInside
						.attr('src', '')
						.attr('src', videoUrl);
					}
				}, modalItem))
			}
		}

		// Copyright Year (Evaluates correct copyright year)
		if (plugins.copyrightYear.length) {
			plugins.copyrightYear.text(initialDate.getFullYear());
		}

		// UI To Top
		if (isDesktop && !isNoviBuilder) {
			$().UItoTop({
				easingType:     'easeOutQuad',
				containerClass: 'ui-to-top fa fa-angle-up'
			});
		}

		// RD Navbar
		if (plugins.rdNavbar.length) {
			var
					navbar = plugins.rdNavbar,
					aliases = {
						'-':     0,
						'-sm-':  576,
						'-md-':  768,
						'-lg-':  992,
						'-xl-':  1200,
						'-xxl-': 1600
					},
					responsive = {};

			for (var alias in aliases) {
				var link = responsive[aliases[alias]] = {};
				if (navbar.attr('data' + alias + 'layout')) link.layout = navbar.attr('data' + alias + 'layout');
				if (navbar.attr('data' + alias + 'device-layout')) link.deviceLayout = navbar.attr('data' + alias + 'device-layout');
				if (navbar.attr('data' + alias + 'hover-on')) link.focusOnHover = navbar.attr('data' + alias + 'hover-on') === 'true';
				if (navbar.attr('data' + alias + 'auto-height')) link.autoHeight = navbar.attr('data' + alias + 'auto-height') === 'true';
				if (navbar.attr('data' + alias + 'stick-up-offset')) link.stickUpOffset = navbar.attr('data' + alias + 'stick-up-offset');
				if (navbar.attr('data' + alias + 'stick-up')) link.stickUp = navbar.attr('data' + alias + 'stick-up') === 'true';
				if (isNoviBuilder) link.stickUp = false;
				else if (navbar.attr('data' + alias + 'stick-up')) link.stickUp = navbar.attr('data' + alias + 'stick-up') === 'true';
			}

			plugins.rdNavbar.RDNavbar({
				anchorNav:    !isNoviBuilder,
				stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
				responsive:   responsive,
				callbacks:    {
					onStuck:        function () {
						var navbarSearch = this.$element.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
						}
					},
					onDropdownOver: function () {
						return !isNoviBuilder;
					},
					onUnstuck:      function () {
						if (this.$clone === null)
							return;

						var navbarSearch = this.$clone.find('.rd-search input');

						if (navbarSearch) {
							navbarSearch.val('').trigger('propertychange');
							navbarSearch.trigger('blur');
						}

					}
				}
			});
		}

		// Swiper
		if (plugins.swiper.length) {
			for (var i = 0; i < plugins.swiper.length; i++) {
				var
						sliderMarkup = plugins.swiper[i],
						swiper,
						options = {
							loop:                           sliderMarkup.getAttribute('data-loop') === 'true' || false,
							effect:                         isIE ? 'slide' : sliderMarkup.getAttribute('data-effect') || 'slide',
							direction:                      sliderMarkup.getAttribute('data-direction') || 'horizontal',
							speed:                          sliderMarkup.getAttribute('data-speed') ? Number(sliderMarkup.getAttribute('data-speed')) : 1000,
							allowTouchMove:                 false,
							preventIntercationOnTransition: true,
							runCallbacksOnInit:             false,
							separateCaptions:               sliderMarkup.getAttribute('data-separate-captions') === 'true' || false,
							centeredSlides:                 sliderMarkup.getAttribute('data-centered-slides') === 'true' || false,
							slidesPerView:                  sliderMarkup.getAttribute('data-slides-per-view') || 1,
							initialSlide:                   sliderMarkup.getAttribute('data-initial-slide') || 0,
							coverflowEffect: {
								rotate: 0,
								stretch: 280,
								depth: 80,
								slideShadows: false
							}
						};

				if (sliderMarkup.getAttribute('data-autoplay')) {
					options.autoplay = {
						delay:                Number(sliderMarkup.getAttribute('data-autoplay')) || 3000,
						stopOnLastSlide:      false,
						disableOnInteraction: true,
						reverseDirection:     false,
					};
				}

				if (sliderMarkup.getAttribute('data-keyboard') === 'true') {
					options.keyboard = {
						enabled:        sliderMarkup.getAttribute('data-keyboard') === 'true',
						onlyInViewport: true
					};
				}

				if (sliderMarkup.getAttribute('data-mousewheel') === 'true') {
					options.mousewheel = {
						releaseOnEdges: true,
						sensitivity:    .1
					};
				}

				if (sliderMarkup.querySelector('.swiper-button-next, .swiper-button-prev')) {
					options.navigation = {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					};
				}

				if (sliderMarkup.querySelector('.swiper-pagination')) {
					options.pagination = {
						el:        '.swiper-pagination',
						type:      'bullets',
						clickable: true
					};
				}

				if (sliderMarkup.querySelector('.swiper-scrollbar')) {
					options.scrollbar = {
						el:        '.swiper-scrollbar',
						hide:      true,
						draggable: true
					};
				}

				options.on = {
					init: function () {
						setBackgrounds(this);
						setRealPrevious(this);
						initCaptionAnimate(this);

						// Real Previous Index must be set recent
						this.on('slideChangeTransitionEnd', function () {
							setRealPrevious(this);
						});
					}
				};

				swiper = new Swiper(plugins.swiper[i], options);
			}
		}

		// Owl carousel
		if (plugins.owl.length) {
			for (var i = 0; i < plugins.owl.length; i++) {
				var carousel = $(plugins.owl[i]);
				plugins.owl[i].owl = carousel;
				initOwlCarousel(carousel);
			}
		}

		// WOW
		if ($html.hasClass("wow-animation") && plugins.wow.length && !isNoviBuilder && isDesktop) {
			new WOW().init();
		}

		// RD Input Label
		if (plugins.rdInputLabel.length) {
			plugins.rdInputLabel.RDInputLabel();
		}

		// Regula
		if (plugins.regula.length) {
			attachFormValidator(plugins.regula);
		}

		// MailChimp Ajax subscription
		if (plugins.mailchimp.length) {
			for (i = 0; i < plugins.mailchimp.length; i++) {
				var $mailchimpItem = $(plugins.mailchimp[i]),
						$email = $mailchimpItem.find('input[type="email"]');

				// Required by MailChimp
				$mailchimpItem.attr('novalidate', 'true');
				$email.attr('name', 'EMAIL');

				$mailchimpItem.on('submit', $.proxy(function ($email, event) {
					event.preventDefault();

					var $this = this;

					var data = {},
							url = $this.attr('action').replace('/post?', '/post-json?').concat('&c=?'),
							dataArray = $this.serializeArray(),
							$output = $("#" + $this.attr("data-form-output"));

					for (i = 0; i < dataArray.length; i++) {
						data[dataArray[i].name] = dataArray[i].value;
					}

					$.ajax({
						data:       data,
						url:        url,
						dataType:   'jsonp',
						error:      function (resp, text) {
							$output.html('Server error: ' + text);

							setTimeout(function () {
								$output.removeClass("active");
							}, 4000);
						},
						success:    function (resp) {
							$output.html(resp.msg).addClass('active');
							$email[0].value = '';
							var $label = $('[for="' + $email.attr('id') + '"]');
							if ($label.length) $label.removeClass('focus not-empty');

							setTimeout(function () {
								$output.removeClass("active");
							}, 6000);
						},
						beforeSend: function (data) {
							var isNoviBuilder = window.xMode;

							var isValidated = (function () {
								var results, errors = 0;
								var elements = $this.find('[data-constraints]');
								var captcha = null;
								if (elements.length) {
									for (var j = 0; j < elements.length; j++) {

										var $input = $(elements[j]);
										if ((results = $input.regula('validate')).length) {
											for (var k = 0; k < results.length; k++) {
												errors++;
												$input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
											}
										} else {
											$input.siblings(".form-validation").text("").parent().removeClass("has-error")
										}
									}

									if (captcha) {
										if (captcha.length) {
											return validateReCaptcha(captcha) && errors === 0
										}
									}

									return errors === 0;
								}
								return true;
							})();

							// Stop request if builder or inputs are invalide
							if (isNoviBuilder || !isValidated)
								return false;

							$output.html('Submitting...').addClass('active');
						}
					});

					return false;
				}, $mailchimpItem, $email));
			}
		}

		// Campaign Monitor ajax subscription
		if (plugins.campaignMonitor.length) {
			for (i = 0; i < plugins.campaignMonitor.length; i++) {
				var $campaignItem = $(plugins.campaignMonitor[i]);

				$campaignItem.on('submit', $.proxy(function (e) {
					var data = {},
							url = this.attr('action'),
							dataArray = this.serializeArray(),
							$output = $("#" + plugins.campaignMonitor.attr("data-form-output")),
							$this = $(this);

					for (i = 0; i < dataArray.length; i++) {
						data[dataArray[i].name] = dataArray[i].value;
					}

					$.ajax({
						data:       data,
						url:        url,
						dataType:   'jsonp',
						error:      function (resp, text) {
							$output.html('Server error: ' + text);

							setTimeout(function () {
								$output.removeClass("active");
							}, 4000);
						},
						success:    function (resp) {
							$output.html(resp.Message).addClass('active');

							setTimeout(function () {
								$output.removeClass("active");
							}, 6000);
						},
						beforeSend: function (data) {
							// Stop request if builder or inputs are invalide
							if (isNoviBuilder || !isValidated($this.find('[data-constraints]')))
								return false;

							$output.html('Submitting...').addClass('active');
						}
					});

					// Clear inputs after submit
					var inputs = $this[0].getElementsByTagName('input');
					for (var i = 0; i < inputs.length; i++) {
						inputs[i].value = '';
						var label = document.querySelector('[for="' + inputs[i].getAttribute('id') + '"]');
						if (label) label.classList.remove('focus', 'not-empty');
					}

					return false;
				}, $campaignItem));
			}
		}

		// RD Mailform
		if (plugins.rdMailForm.length) {
			var i, j, k,
					msg = {
						'MF000': 'Successfully sent!',
						'MF001': 'Recipients are not set!',
						'MF002': 'Form will not work locally!',
						'MF003': 'Please, define email field in your form!',
						'MF004': 'Please, define type of your form!',
						'MF254': 'Something went wrong with PHPMailer!',
						'MF255': 'Aw, snap! Something went wrong.'
					};

			for (i = 0; i < plugins.rdMailForm.length; i++) {
				var $form = $(plugins.rdMailForm[i]),
						formHasCaptcha = false;

				$form.attr('novalidate', 'novalidate').ajaxForm({
					data:         {
						"form-type": $form.attr("data-form-type") || "contact",
						"counter":   i
					},
					beforeSubmit: function (arr, $form, options) {
						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
								inputs = form.find("[data-constraints]"),
								output = $("#" + form.attr("data-form-output")),
								captcha = form.find('.recaptcha'),
								captchaFlag = true;

						output.removeClass("active error success");

						if (isValidated(inputs, captcha)) {

							// veify reCaptcha
							if (captcha.length) {
								var captchaToken = captcha.find('.g-recaptcha-response').val(),
										captchaMsg = {
											'CPT001': 'Please, setup you "site key" and "secret key" of reCaptcha',
											'CPT002': 'Something wrong with google reCaptcha'
										};

								formHasCaptcha = true;

								$.ajax({
									method: "POST",
									url:    "bat/reCaptcha.php",
									data:   {'g-recaptcha-response': captchaToken},
									async:  false
								})
								.done(function (responceCode) {
									if (responceCode !== 'CPT000') {
										if (output.hasClass("snackbars")) {
											output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + captchaMsg[responceCode] + '</span></p>')

											setTimeout(function () {
												output.removeClass("active");
											}, 3500);

											captchaFlag = false;
										} else {
											output.html(captchaMsg[responceCode]);
										}

										output.addClass("active");
									}
								});
							}

							if (!captchaFlag) {
								return false;
							}

							form.addClass('form-in-process');

							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Sending</span></p>');
								output.addClass("active");
							}
						} else {
							return false;
						}
					},
					error:        function (result) {
						if (isNoviBuilder)
							return;

						var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output")),
								form = $(plugins.rdMailForm[this.extraData.counter]);

						output.text(msg[result]);
						form.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}
					},
					success:      function (result) {
						if (isNoviBuilder)
							return;

						var form = $(plugins.rdMailForm[this.extraData.counter]),
								output = $("#" + form.attr("data-form-output")),
								select = form.find('select');

						form
						.addClass('success')
						.removeClass('form-in-process');

						if (formHasCaptcha) {
							grecaptcha.reset();
						}

						result = result.length === 5 ? result : 'MF255';
						output.text(msg[result]);

						if (result === "MF000") {
							if (output.hasClass("snackbars")) {
								output.html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active success");
							}
						} else {
							if (output.hasClass("snackbars")) {
								output.html(' <p class="snackbars-left"><span class="icon icon-xxs mdi mdi-alert-outline text-middle"></span><span>' + msg[result] + '</span></p>');
							} else {
								output.addClass("active error");
							}
						}

						form.clearForm();

						if (select.length) {
							select.select2("val", "");
						}

						form.find('input, textarea').trigger('blur');

						setTimeout(function () {
							output.removeClass("active error success");
							form.removeClass('success');
						}, 3500);
					}
				});
			}
		}

		// lightGallery
		plugins.lightGallery = $('[data-lightgallery="group"]');
		if (plugins.lightGallery.length) {
			for (var i = 0; i < plugins.lightGallery.length; i++) {
				initLightGallery(plugins.lightGallery[i]);
			}
		}

		// lightGallery item
		plugins.lightGalleryItem = $('[data-lightgallery="item"]');
		if ( plugins.lightGalleryItem.length ) {
			for (var i = 0; i < plugins.lightGalleryItem.length; i++) {
				initLightGalleryItem(plugins.lightGalleryItem[i]);
			}
		}

		// Dynamic lightGallery
		plugins.lightDynamicGalleryItem = $('[data-lightgallery="dynamic"]');
		if (plugins.lightDynamicGalleryItem.length) {
			for (var i = 0; i < plugins.lightDynamicGalleryItem.length; i++) {
				initDynamicLightGallery(plugins.lightDynamicGalleryItem[i]);
			}
		}

		// Multi Toggles
		if (plugins.multiToggles.length) {
			for (var i = 0; i < plugins.multiToggles.length; i++) {
				var
						node = plugins.multiToggles[i],
						toggle = new Toggle({
							node:    node,
							targets: document.querySelectorAll(node.getAttribute('data-multitoggle')),
							scope:   document.querySelectorAll(node.getAttribute('data-scope')),
							isolate: document.querySelectorAll(node.getAttribute('data-isolate'))
						});

				if (plugins.multiToggles[i].classList.contains('content-toggle')) {
					node.addEventListener('click', function () {
						toggleElementsVisibility(this.mt.targets);
					});
				}
			}
		}

		// Parallax JS
		if (plugins.parallaxJs.length && !isNoviBuilder) {
			for (var i = 0; i < plugins.parallaxJs.length; i++) {
				var scene = plugins.parallaxJs[i];
				new Parallax(scene);
			}
		}

		// Vide
		if ( plugins.vide.length ) {
			for ( var i = 0; i < plugins.vide.length; i++ ) {
				var $element = $(plugins.vide[i]),
					options = $element.data('vide-options'),
					path = $element.data('vide-bg');

				$element.vide( path, options );

				var
					videObj = $element.data('vide').getVideoObject(),
					scrollHandler = (function( $element ) {
						if ( isScrolledIntoView( $element ) ) this.play();
						else this.pause();
					}).bind( videObj, $element );
				scrollHandler();
				if ( isNoviBuilder ) videObj.pause();
				else document.addEventListener( 'scroll', scrollHandler );
			}
		}

		// Button Nuka
		if ( plugins.buttonNuka.length ) {
			plugins.buttonNuka.on( 'mouseenter', function( e ) {
					var parentOffset = $( this ).offset(),
						relX = e.pageX - parentOffset.left,
						relY = e.pageY - parentOffset.top;
					$( this ).find( '.button-overlay' ).css({ top:relY, left:relX })
				})
				.on( 'mouseout', function(e) {
					var parentOffset = $( this ).offset(),
						relX = e.pageX - parentOffset.left,
						relY = e.pageY - parentOffset.top;
					$( this ).find( '.button-overlay' ).css({ top:relY, left:relX })
				});
		}
	});
}());
