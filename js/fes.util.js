/**
 * util
 * @dependency :
		jquery
		fes.vendors.js
 *
 */

/**
 * FES 전역 객체
 *
*/
FES = {};

(function($) {

	'use strict'

	/**
	 * 쿠기 기능
	 *
	 */
	FES.cookie = function() {};

	FES.cookie.prototype = {

		/**
		 * 쿠키 생성
		 *
		 */
		set : function(name,value,days) {
			try {
				if (days) {
					var date = new Date();
					date.setTime(date.getTime()+(days*24*60*60*1000));
					var expires = "; expires="+date.toGMTString();
				}
				else var expires = "";
				document.cookie = name+"="+value+expires+"; path=/";
			} catch(e) {
				console.log('[Error Message] : ' + e.message);
			}
		}

		/**
		 * 인스턴트 쿠키 생성. 브라우저가 실행되고 있는 동만만 유지됨.
		 *
		 */
		, setInstant : function(name, value) {
			try {
				document.cookie = name + "=" + escape(value) + "; path=/;";
			} catch(e) {
				console.log('[Error Message] : ' + e.message);
			}
		}

		/**
		 * cookie 값 읽어오기
		 *
		 */
		, get : function(name) {
			try {
				var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				for(var i=0;i < ca.length;i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
				}
				return null;
			} catch(e) {
				console.log('[Error Message] : ' + e.message);
			}
		}

		/**
		 * cookie 값 지우기
		 *
		 */
		, remove : function(name) {
			try {
				FES.cookie.set(name,"",-1);
			} catch(e) {
				console.log('[Error Message] : ' + e.message);
			}
		}
	}

	/**
	 * 디자인 셀렉트
	 *
	*/
	FES.designSelect = function(opts) {

		try {

			var options = {
					target : opts.target
					, duration : 0.2
					, scrollInit : false
					, control : $(opts.target).hasAttr('data-control') ? true : false
					, addClass : opts.addClass ? opts.addClass : ''
				}

			$(options.target).each(function(originIndex) {

				var origin = $(this);

				// remove if module exist
				if ( origin.prev('.uiDesignSelect-wrap').length ) origin.prev('.uiDesignSelect-wrap').remove();

				var originOption = origin.find('option')
					, originDisplay = origin.attr('data-display') ? origin.attr('data-display') : 'inline-block'
					, originDisabled = origin.hasAttr('disabled') ? true : false
					, originWidth = origin.attr('data-width') ? parseInt(origin.attr('data-width'), 10) : null
					, originSelected = originOption.filter(':selected')
					, currentIdx = originSelected.index()
					, select = $('<div class="uiDesignSelect-wrap uiDesignSelect' + (originIndex+1) + ' ' + opts.addClass + '"></div>')
					, optionListWrap = $('<div class="uiDesignSelect-optionList"></div>').appendTo(select)
					, optionList = $('<div class="uiDesignSelect-ul"></div>').appendTo(optionListWrap);

				if ( options.control ) {

					var selected = $('<strong class="uiDesignSelect-selected"><button type="button" class="uiDesignSelect-prev"></button><a href="#" class="uiDesignSelect-trigger"><span class="uiDesignSelect-text">' + originSelected.html() + '</span><i class="uiDesignSelect-ico"></i></a><button type="button" class="uiDesignSelect-next"></button></strong>').prependTo(select)
						, btnPrev = selected.find('.uiDesignSelect-prev')
						, btnNext = selected.find('.uiDesignSelect-next');

				} else {
					var selected = $('<strong class="uiDesignSelect-selected"><a href="#" class="uiDesignSelect-trigger"><span class="uiDesignSelect-text">' + originSelected.html() + '</span><i class="uiDesignSelect-ico"></i></a></strong>').prependTo(select)
				}

				if ( originDisabled ) {
					select.addClass('disabled');
				}

				select.css({
					'zIndex' : 30-originIndex
					, 'display' : originDisplay
				});

				origin.addClass('uiOriginSelect uiOriginSelect'+(originIndex+1));
				originOption.each(function(i) {
					var thisHTML = $(this).html();
					$('<div class="uiDesignSelect-li"><a href="#" class="uiDesignSelect-listTrigger">' + thisHTML + '</a></div>').appendTo(optionList);
				});

				select.insertBefore(origin);

				optionListWrap.show().css('position','relative');

				// set Var
				var selectTrigger = selected.find('.uiDesignSelect-trigger')
					, selectedTriggerText = selectTrigger.find('.uiDesignSelect-text')
					, selectedIco = selectTrigger.find('.uiDesignSelect-ico')
					, optionLI = optionListWrap.find('.uiDesignSelect-li')
					, optionTrigger = optionList.find('.uiDesignSelect-listTrigger')
					, optionListWrapHeight = optionListWrap.outerHeight(true)
					, optionListWrapWidth = optionListWrap.outerWidth(true) + selectedIco.width();

				//console.log(originIndex + ' : ' + optionListWrapWidth );
				//console.log(parseInt(selected.find('a').css('border-left-width')));

				if ( originWidth != null ) {
					optionListWrapWidth = originWidth;
					optionListWrap.width(originWidth);
				}

				// scroll Init
				if ( options.scrollInit ) {
					optionListWrap.mCustomScrollbar({

					});
				}

				optionTrigger.css({
					width : optionListWrapWidth - 2
				});
				selected.css({
					width : optionListWrapWidth + parseInt(selectTrigger.css('border-left-width')) + parseInt(selectTrigger.css('border-right-width'))
				});

				optionTrigger.eq(currentIdx).addClass('uiSelect-active');

				// check slideUp or slideDown
				checkUpDown();

				// height to 0
				optionListWrap.height(0).css('position','absolute');

				// binding
				if ( !originDisabled ) {
					selectTrigger.on({
						click : function() {
							if ( optionListWrap.hasClass('uiSelect-state-open') ) {
								_hide();
							} else {
								_allHide();
								_show();
							}
							return false;
						}
					});
				}

				if ( options.control ) {
					btnPrev.on({
						click : function() {
							currentIdx -= 1;
							if ( currentIdx < 0 ) currentIdx = optionTrigger.length - 1;

							selectedTriggerText.text(optionTrigger.eq(currentIdx).html());
							_update();
						}
					});

					btnNext.on({
						click : function() {
							currentIdx += 1;
							if ( currentIdx >= optionTrigger.length ) currentIdx = 0;

							selectedTriggerText.text(optionTrigger.eq(currentIdx).html());
							_update();
						}
					});
				}

				optionTrigger.each(function(i) {
					$(this).on({
						click : function() {
							var _this = $(this)
								, thisText = _this.html();

							setTimeout(function() {
								selectedTriggerText.text(thisText);
							}, (options.duration*1000)/2);

							currentIdx = i;

							_hide();
							_update();

							return false;
						}
					});
				});

				$(document).on({
					click : function() {

						var e = e || window.event
							, target = $(e.target);

						if ( !target.parents('.uiDesignSelect-wrap').length ) {
							_hide();
						}
					}
				});

				// check slideUp or slideDown
				function checkUpDown() {
					var bodyHeight = $('body').height()
						, posY = select.offset().top
						, selectHeight = select.height() + optionListWrap.height() + 20;

					if ( bodyHeight < posY + selectHeight ) {
						select.addClass('upSlide');
					}
				}

				// show optionList
				function _show() {
					TweenMax.to(optionListWrap, options.duration, { height : optionListWrapHeight, ease : Power2.easeOut });
					optionListWrap.addClass('uiSelect-state-open');
					selected.addClass('uiSelect-state-open');
				}

				// other select hide
				function _allHide() {
					var otherSelect = $('.uiDesignSelect-wrap').not(select);

					otherSelect.each(function() {
						var thisList = $(this).find('.uiDesignSelect-optionList')
							, thisSelected = $(this).find('.uiDesignSelect-selected');

						TweenMax.to(thisList, options.duration, { height : 0, ease : Power2.easeOut });
						thisSelected.removeClass('uiSelect-state-open');
						thisList.removeClass('uiSelect-state-open');
					});
				}

				// hide optionList
				function _hide() {
					TweenMax.to(optionListWrap, options.duration, { height : 0, ease : Power2.easeOut });
					optionListWrap.removeClass('uiSelect-state-open');
					selected.removeClass('uiSelect-state-open');
				}

				// update to Origin
				function _update() {
					optionTrigger.removeClass('uiSelect-active');
					optionTrigger.eq(currentIdx).addClass('uiSelect-active');
					originOption.removeAttr('selected');
					originOption.eq(currentIdx).attr('selected','selected');
					origin.change();
				}

			});

		} catch(e) {
			console.log('[Error Message] : ' + e.message);
		}

	};

	/**
	 * hasAttr
	 *
	 */
	$.fn.hasAttr = function(name) {
		try {
			return this.attr(name) !== undefined;
		} catch(e) {
			console.log('[Error Message] : ' + e.message);
		}
	};

	/**
	 * @constructor String
	 * @prototype getBytes
	 *
	 */
	String.prototype.getBytes = function() {
		var contents = this;
		var str_character;
		var int_char_count;
		var int_contents_length;
		var k;

		int_char_count = 0;
		int_contents_length = contents.length;

		for (k = 0; k < int_contents_length; k++) {
			str_character = contents.charAt(k);
			if (escape(str_character).length > 4)
				int_char_count += 2;
			else
				int_char_count++;
		}
		return int_char_count;
	}

	/**
	 * openPopup
	 *
	 */
	FES.openPopup = function(opts) {

		/*
			opts = {
				url : url
				, title : title
				, width : width
				, height : height
				, scrollbar : 'yes' or 'no'
			}
		*/

		var left = (screen.width/2) - (opts.width/2)
			, top = 300;

		if ( opts.height > screen.height ) opts.height = screen.height - 600;

		window.open(opts.url, opts.title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=' + opts.scrollbar + ', resizable=no, copyhistory=no, width='+ opts.width+', height='+opts.height+', top='+top+', left='+left);

	}

})(jQuery);