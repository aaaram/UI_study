/* FeCommon.js | DWFARMS */
var feUI = feUI || {};
;(function(feUI, $, window, document, undefined) {
	'use strict';
	// Common variable
	var $window = $(window),
		$document = $(document),
		$html = $('html').addClass('disableOutline'),
		$body = $document.find('body')
			.append('<div class="dimmedLayer"></div>'),
		$content = $body.find('#content'),
		$dimmedLayer = $body.find('.dimmedLayer'),
		winWidth = $window.width(),
		winHeight = $window.height(),
		currentClass = 'current',
		dimmedOpacity = 0.8;
	$dimmedLayer.css('opacity', dimmedOpacity);
	// Check view mode
	feUI.viewModeCheck = function() {
		var pcWidth = 1140,
			mobWidth = 900,
			pcViewClass = 'pcView',
			padViewClass = 'padView',
			mobViewClass = 'mobView';
		$html.removeClass(pcViewClass + ' ' + padViewClass + ' ' + mobViewClass);
		if ( winWidth <= mobWidth ) $html.addClass(mobViewClass);
		else if ( winWidth > pcWidth ) $html.addClass(pcViewClass);
		else $html.addClass(padViewClass);
	};
	// Document title
	feUI.setDocTitle = function() {
		var docTitle = $document.attr('title'),
			h2TitleTxt = $content.find('h2:first').text(),
			newTitle = h2TitleTxt + ' | ' + docTitle;
		$document.attr('title', newTitle);
	};
	feUI.setDocTitle();
	//
	feUI.fontSizeChange = function() {
		var $changeBtn = $content.find('[class*=btnType]'),
			$testTxt = $content.find('.txtWrap'),
			$this = $(this),
			$crrentTxtInfo = $content.find('.crrentTxtInfo'),
			currentFontSize = parseInt($testTxt.css("font-size"));
		$crrentTxtInfo.text(currentFontSize + 'px');
		$changeBtn.on('click', function() {
			/*if( $this.hasClass('btnTypeBig')) {
				console.log('크게');
			} else {
				console.log('작게');
			}*/
			if(this.id == "large"){
				console.log('크게');
				currentFontSize++;
				$testTxt.css('font-size',currentFontSize);
			} else if(this.id == "small") {
				console.log('작게');
				currentFontSize--;
				$testTxt.css('font-size',currentFontSize);
			}
			$crrentTxtInfo.text(currentFontSize + 'px');
			console.log($this);
			console.log($this.hasClass('btnTypeBig'));
		});
	};
	feUI.fontSizeChange();
	// Window Event
	$window.on({
		'resize': function() {
			if ( winWidth !== $window.width() ) {
				winWidth = $window.width();
			}
			if ( winHeight !== $window.height() ) {
				winHeight = $window.height();
			}
			feUI.viewModeCheck();
		}
	});
})(feUI, jQuery, window, document);