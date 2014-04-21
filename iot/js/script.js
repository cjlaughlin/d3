jQuery(document).ready(function($){
	var transition_time = 200,
		icons_pos 		= new Array(6),
		i 				= 1,
		queue_clear		= true;
	$('#industries a').on('click touchstart', function(e){
		prevent_and_stop(e);
		$('#industries a').each(function(){
			$(this).removeClass();
			$(this).css({'height':190});
			$('#industries').css({'height':190});
		});
		$(this).addClass('active');
		var id = $(this).attr('href');
		$('#advantage').animate({'margin-top':0, 'height':660},transition_time);
		$('#year-2020').slideUp(transition_time,function(){
			if($('#industries-content').hasClass('activated')){
				$('#industries-content div, #industries-content p a').not(id).fadeOut(transition_time);
				$('#industries-content div').promise().done(function(){
					$('#industries-content '+id).fadeIn(transition_time).promise().done(function(){
						$('#industries-content '+id+' p a').delay(transition_time/2).fadeIn(transition_time);
					});
				});
			}
			else {
				$('#industries-content '+id).slideDown(transition_time).promise().done(function(){
					$('#industries-content').addClass('activated');
					$('#industries-content '+id+' p a').delay(transition_time/2).fadeIn(transition_time);
				});
			}
		});
	});
	$('#industries-content p a').on('click touchstart', function(e){
		prevent_and_stop(e);
		var id = $(this).attr('href'),
			ic = '#industries-container',
			cn = '#industries-content';
		$(ic+' .industry').attr('id',id.substr(1));
		$('.nav.prev').attr('href',id);
		$(cn+' div, #advantage').fadeOut(transition_time, function(){
			$(cn).removeClass('activated');
		});
		$(cn+' div, #advantage').promise().done(function(){
			$('.main-container').removeClass('padded');
			$(ic).css({'display':'block'});
		});
		$(ic+' #content-shade').fadeIn(transition_time);
		$(ic+' .industry'+id).fadeIn(transition_time*2).promise().done(function(){
			$(ic).addClass('activated');
		});
		$(ic+' #instructions span').text($(this).attr('title'));
		$(ic+' #instructions').css({
			'margin-top':30,
			'opacity': 0,
			'display': 'block',
			boxShadow: '0 0 0 rgba(0,0,0,0.5)'
		}).animate({
			'margin-top':0,
			'opacity': 1,
			boxShadow: '12px 12px 0 rgba(0,0,0,0.25)'
		},transition_time*3);
	});
	$('#industries-container #content-shade, #industries-container #instructions:not(a)').not('#industries-container #instructions a').on('click touchstart', function(e){
		prevent_and_stop(e);
		ic = '#industries-container';
		$(ic+' #content-shade').fadeOut(transition_time);
		$(ic+' #instructions').animate({
			'margin-top':-30,
			'opacity': 0,
			boxShadow: '24px 24px 0 rgba(0,0,0,0)'
		},transition_time*2);
		$(ic+' #instructions').promise().done(function(){
			$(this).css({'display':'none'}).remove();
			$('#industries-container #content-shade').remove();
		});
	});
	$('#industries-container a.nav').on('click touchstart', function(e){
		prevent_and_stop(e);
		if(queue_clear){
			queue_clear = false;
			if($(this).hasClass('prev')){
				nav_backward();
			}
			else {
				nav_forward();
			}
		}
	});
	$('#industries-icons a').on('click touchstart', function(e){
		prevent_and_stop(e);
		var id = $(this).attr('href');
		$('#industries-content div[style]').removeAttr('style');
		$('#industries a').removeClass('active');
		$('#closing-slide').fadeOut(transition_time).promise().done(function(){
			$('#advantage').fadeIn(transition_time, function(){
				$('.main-container').addClass('padded');
			}).promise().done(function(){
				$('#industries-content p a').css({'display':'none'});
				$('#industries a'+id).trigger('click');
				$('#industries-content').addClass('activated');
			});
		});
	});
	$('#industries-content p a').css({'display':'none'});
	while(i<=6){
		icons_pos[(i-1)] = [$('#icon_'+i).css('left'), $('#icon_'+i).css('top')];
		$('.icon_'+i).draggable({
			containment: 	'#industries-container',
			cursor: 		'move',
			revert: 		'invalid',
			revertDuration: transition_time,
			scroll: 		false,
			start: 			start_function,
			stop: 			stop_function
		});
		var p = 0;
		switch(i){
			case 1 : p = 1; break;
			case 3 : p = 2; break;
			case 5 : p = 3; break;
		}
		if(p){
			$('#panel_'+p).droppable({
				accept: 		'.icon_'+i+', .icon_'+(i+1),
				tolerance: 		'touch',
				activeClass: 	'droppable-panel',
				drop: 			drop_function
			});
		}
		i++;
	}
	function start_function(event, ui){
		var index_n 	= $(this).index()+1,
			not_panel 	= (index_n <= 2) ? 1 : 2,
			not_panel 	= (index_n >= 5) ? 3 : not_panel;
		$('.panels .fade-overlay').not('.panel_'+not_panel).fadeIn(transition_time);
		$(this).addClass('dragged').css({'z-index':1000});
	}
	function drop_function(event, ui){
		place_icon(ui.draggable);
	}
	function stop_function(event, ui){
		$(this).not('.dropped').removeClass('dragged');
		$('.fade-overlay').fadeOut(transition_time);
	}
	function nav_forward(){
		$next_id 	= $('.icon').not('.dropped').first().index();
		var dropped = $('.icon.dropped').length;
		if($next_id >= 0 && dropped < 6){
			automate($next_id,'+');
		}
		else {
			go_to_end();
		}
	}
	function nav_backward(){
		$prev_id 	= $('.icon.dropped').last().index();
		var dropped = $('.icon.dropped').length;
		if($prev_id > -1 && dropped > 0){
			automate($prev_id,'-');
		}
		else {
			go_to_start();
		}
	}
	function automate(item_id,direction){
		$auto_icon = $('.icons .icon:eq('+item_id+')');
		if(direction == '+'){
			place_icon($auto_icon,2);
		}
		else {
			unplace_icon($auto_icon,2);
		}
	}
	function go_to_end(){
		$('#industries-container').hide('slide',{direction: 'left'},transition_time*2);
		$('#closing-slide').show('slide',{direction: 'right'},transition_time*2);
		$('.main-container').addClass('padded');
		$('#industries-container').promise().done(function(){
			reset_industries();
		});
	}
	function go_to_start(){
		var id = $('.nav.prev').attr('href');
		$('#industries-content div[style]').removeAttr('style');
		$('#industries a').removeClass('active');
		$('#industries-container').hide('slide',{direction: 'right'},transition_time*2).promise().done(function(){
			reset_industries();
			$('#industries-content p a').css({'display':'none'});
			$('#industries a'+id).trigger('click');
			$('#industries-content').addClass('activated');
		});
		$('.main-container').addClass('padded');
		$('#advantage').show('slide',{direction: 'left'},transition_time*2);
	}
	function reset_industries(){
		queue_clear = true;
		$('#industries-container').removeClass('activated')
		$('.icons .icon').removeClass('dragged dropped');
		$('.icons .icon[style]').removeAttr('style');
		$('.industry .content .text').not('.initial').hide();
		$('.industry .content .text.initial').removeAttr('style');
		$('.nav.next').removeClass('active');
		$('.nav.prev').attr('href','#');
	}
	function place_icon($icon_obj,speed){
		speed = speed ? speed : 1;
		if($icon_obj){
			var id 			= $icon_obj.attr('id'),
				pos 		= $('.'+id+'_snap').position(),
				parent_pos 	= $('.icons').offset(),
				y 			= pos.top-parent_pos.top,
				x 			= pos.left-parent_pos.left;
			$('#'+id).addClass('dropped dragged').animate({'top':y, 'left':x}, transition_time*speed);
			$('.industry .content .text').fadeOut(transition_time).promise().done(function(){
				$('.industry .'+$('.industry').attr('id')+'-content .text.'+id+'_text').fadeIn(transition_time);
				queue_clear = true;
			});
		}
		if ($('.icon.dropped').length == 6){
			$('.nav.next').addClass('active');
		}
	}
	function unplace_icon($icon_obj,speed){
		speed = speed ? speed : 1;
		if($icon_obj){
			var id 			= $icon_obj.attr('id'),
				index_n 	= $icon_obj.index(),
				prev_index 	= $('.icon.dropped').not('#'+id).last().index()+1,
				y 			= icons_pos[index_n][1],
				x 			= icons_pos[index_n][0];
			$('#'+id).removeClass('dropped dragged').animate({'top':y, 'left':x}, transition_time*speed);
			$('.industry .content .text').fadeOut(transition_time).promise().done(function(){
				$('.industry .'+$('.industry').attr('id')+'-content .text:eq('+prev_index+')').fadeIn(transition_time);
				queue_clear = true;
			});
		}
		$('.nav.next').removeClass('active');
	}
	function prevent_and_stop(event_){
		event_.preventDefault();
		event_.stopPropagation();
	}
});

/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
!function(a){function f(a,b){if(!(a.originalEvent.touches.length>1)){a.preventDefault();var c=a.originalEvent.changedTouches[0],d=document.createEvent("MouseEvents");d.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null),a.target.dispatchEvent(d)}}if(a.support.touch="ontouchend"in document,a.support.touch){var e,b=a.ui.mouse.prototype,c=b._mouseInit,d=b._mouseDestroy;b._touchStart=function(a){var b=this;!e&&b._mouseCapture(a.originalEvent.changedTouches[0])&&(e=!0,b._touchMoved=!1,f(a,"mouseover"),f(a,"mousemove"),f(a,"mousedown"))},b._touchMove=function(a){e&&(this._touchMoved=!0,f(a,"mousemove"))},b._touchEnd=function(a){e&&(f(a,"mouseup"),f(a,"mouseout"),this._touchMoved||f(a,"click"),e=!1)},b._mouseInit=function(){var b=this;b.element.bind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),c.call(b)},b._mouseDestroy=function(){var b=this;b.element.unbind({touchstart:a.proxy(b,"_touchStart"),touchmove:a.proxy(b,"_touchMove"),touchend:a.proxy(b,"_touchEnd")}),d.call(b)}}}(jQuery);

/*
 Shadow animation 1.11
 http://www.bitstorm.org/jquery/shadow-animation/
 Copyright 2011, 2013 Edwin Martin <edwin@bitstorm.org>
 Contributors: Mark Carver, Xavier Lepretre and Jason Redding
 Released under the MIT and GPL licenses.
*/
'use strict';jQuery(function(h){function r(b,m,d){var l=[];h.each(b,function(f){var g=[],e=b[f];f=m[f];e.b&&g.push("inset");"undefined"!==typeof f.left&&g.push(parseFloat(e.left+d*(f.left-e.left))+"px "+parseFloat(e.top+d*(f.top-e.top))+"px");"undefined"!==typeof f.blur&&g.push(parseFloat(e.blur+d*(f.blur-e.blur))+"px");"undefined"!==typeof f.a&&g.push(parseFloat(e.a+d*(f.a-e.a))+"px");if("undefined"!==typeof f.color){var p="rgb"+(h.support.rgba?"a":"")+"("+parseInt(e.color[0]+d*(f.color[0]-e.color[0]),
10)+","+parseInt(e.color[1]+d*(f.color[1]-e.color[1]),10)+","+parseInt(e.color[2]+d*(f.color[2]-e.color[2]),10);h.support.rgba&&(p+=","+parseFloat(e.color[3]+d*(f.color[3]-e.color[3])));g.push(p+")")}l.push(g.join(" "))});return l.join(", ")}function q(b){function m(){var a=/^inset\b/.exec(b.substring(c));return null!==a&&0<a.length?(k.b=!0,c+=a[0].length,!0):!1}function d(){var a=/^(-?[0-9\.]+)(?:px)?\s+(-?[0-9\.]+)(?:px)?(?:\s+(-?[0-9\.]+)(?:px)?)?(?:\s+(-?[0-9\.]+)(?:px)?)?/.exec(b.substring(c));
return null!==a&&0<a.length?(k.left=parseInt(a[1],10),k.top=parseInt(a[2],10),k.blur=a[3]?parseInt(a[3],10):0,k.a=a[4]?parseInt(a[4],10):0,c+=a[0].length,!0):!1}function l(){var a=/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/.exec(b.substring(c));if(null!==a&&0<a.length)return k.color=[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16),1],c+=a[0].length,!0;a=/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])/.exec(b.substring(c));if(null!==a&&0<a.length)return k.color=[17*parseInt(a[1],16),17*parseInt(a[2],
16),17*parseInt(a[3],16),1],c+=a[0].length,!0;a=/^rgb\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*\)/.exec(b.substring(c));if(null!==a&&0<a.length)return k.color=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),1],c+=a[0].length,!0;a=/^rgba\(\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*,\s*([0-9\.]+)\s*\)/.exec(b.substring(c));return null!==a&&0<a.length?(k.color=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3],10),parseFloat(a[4])],c+=a[0].length,!0):!1}function f(){var a=/^\s+/.exec(b.substring(c));
null!==a&&0<a.length&&(c+=a[0].length)}function g(){var a=/^\s*,\s*/.exec(b.substring(c));return null!==a&&0<a.length?(c+=a[0].length,!0):!1}function e(a){if(h.isPlainObject(a)){var b,e,c=0,d=[];h.isArray(a.color)&&(e=a.color,c=e.length);for(b=0;4>b;b++)b<c?d.push(e[b]):3===b?d.push(1):d.push(0)}return h.extend({left:0,top:0,blur:0,spread:0},a)}for(var p=[],c=0,n=b.length,k=e();c<n;)if(m())f();else if(d())f();else if(l())f();else if(g())p.push(e(k)),k={};else break;p.push(e(k));return p}h.extend(!0,
h,{support:{rgba:function(){var b=h("script:first"),m=b.css("color"),d=!1;if(/^rgba/.test(m))d=!0;else try{d=m!==b.css("color","rgba(0, 0, 0, 0.5)").css("color"),b.css("color",m)}catch(l){}b.removeAttr("style");return d}()}});var s=h("html").prop("style"),n;h.each(["boxShadow","MozBoxShadow","WebkitBoxShadow"],function(b,h){if("undefined"!==typeof s[h])return n=h,!1});n&&(h.Tween.propHooks.boxShadow={get:function(b){return h(b.elem).css(n)},set:function(b){var m=b.elem.style,d=q(h(b.elem)[0].style[n]||
h(b.elem).css(n)),l=q(b.end),f=Math.max(d.length,l.length),g;for(g=0;g<f;g++)l[g]=h.extend({},d[g],l[g]),d[g]?"color"in d[g]&&!1!==h.isArray(d[g].color)||(d[g].color=l[g].color||[0,0,0,0]):d[g]=q("0 0 0 0 rgba(0,0,0,0)")[0];b.run=function(b){b=r(d,l,b);m[n]=b}}})});