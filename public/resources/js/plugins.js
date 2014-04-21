_DATE = "April 21, 2013 00:00:00";
_BACKGROUND = "rgba(255, 255, 255, 0.50)";
_FOREGROUND = "rgba(255, 255, 255, 0.75)";
_TEXT = "rgba(0, 0, 0, 1.00)";
_CAPTION = true;
_LATITUDE = -20.463881;
_LONGITUDE =  -54.609234;

(function ($) {
	$.fn.spinload = function (opts) {
		var element = this;
		var spinner = new Spinner({
			"lines": 10,
			"length": 10,
			"width": 5,
			"radius": 20,
			"corners": 1,
			"rotate": 0,
			"direction": 1,
			"color": "#FFFFFF",
			"speed": 1,
			"trail": 50,
			"shadow": false,
			"hwaccel": false,
			"className": "spinner",
			"zIndex": 0,
			"top": "auto",
			"left": "auto"
		}).spin($(element).find("#spinload").get(0));
		
		$(window).bind("load", function (event) {
			setTimeout(function () {
				$(element).find("#spinload").remove();
			}, 1000);
		});
		return (this);
	}
})(jQuery);

(function ($) {
	$.fn.placeholder = function (opts) {
		var element = this;

		$("form").bind("submit", function (event) {
			$("[placeholder]").each(function (index) {
				var selection = this;
				
				$(selection).val($(selection).val() == $(selection).attr("placeholder") ? "" : $(selection).val());
			});
		});
		$(window).bind("load", function (event) {
			$("[placeholder]").each(function (index) {
				var selection = this;
				
				$(selection).val($(selection).val() == "" ? $(selection).attr("placeholder") : $(selection).val());
			});
			$("[placeholder]").bind("focus", function (event) {
				var selection = this;
				
				$(selection).val($(selection).val() == $(selection).attr("placeholder") ? "" : $(selection).val());
			});
			$("[placeholder]").bind("blur", function (event) {
				var selection = this;
				
				$(selection).val($(selection).val() == "" ? $(selection).attr("placeholder") : $(selection).val());
			});
		});
		return (this);
	}
})(jQuery);

(function ($) {
	$.fn.autoslide = function (opts) {
		var element = this;
		var delay = 5000;
		var current = 0;
		var size = 4;
		var fn = function () {
			if ($(window).scrollTop() == 0) {
				$(element).find(".slide").each(function (index) {
					var selection = this;
				
					if (index == current) {
						$(selection).css({"z-index": 1000000, "opacity": 0.5});
					}
					else {
						$(selection).css({"z-index": 0, "opacity": 0});
					}
				});
				current = current + 1;
				current = current == size ? 0 : current;
			}
			setTimeout(function () {fn();}, delay);
		};

		$(window).bind("load", function () {
			fn();	
		});
		return (this);
	}
})(jQuery);

(function ($) {
	$.fn.countdown = function (opts) {
		var element = this;
		var timeout = 0;
		var ratio = 2;
		var diff = (new Date(_DATE).getTime() - new Date().getTime()) / 1000;
		var cvs = $(element).find(".clock").get(0);
		var ctx = cvs.getContext("2d");
		var img = new Image();
		var circle = function (index, radius, caption, percent) {
			ctx.beginPath();
			ctx.arc((cvs.width / 2), (cvs.height / 1.5), (index * radius), (0 * Math.PI), (2 * Math.PI));
			ctx.lineWidth = (radius * 0.75);
			ctx.strokeStyle = _BACKGROUND;
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.arc((cvs.width / 2), (cvs.height / 1.5), (index * radius), (1.5 * Math.PI), (1.5 * Math.PI) + (2 * Math.PI * percent));
			ctx.lineWidth = (radius * 0.75);
			ctx.strokeStyle = _FOREGROUND;
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.font = (radius * 0.50) + "px OpenSans, Helvetica, Arial";
			ctx.textAlign = "center"; 
			ctx.fillStyle = _TEXT;
			ctx.fillText((_CAPTION ? caption : String()), (cvs.width / 2), (cvs.height / 1.5) + (index * radius) + (radius / 6));
			ctx.closePath();
		};
		var fn = function (d, h, m, s) {
			cvs.style.width = $(element).width();
			cvs.style.height = $(element).height();
			cvs.width = $(element).width() * ratio;
			cvs.height = $(element).height() * ratio;
			ctx.clearRect(0, 0, cvs.width, cvs.height);
			setTimeout(function () {
				img.src = "resources/images/arrow.png";
				ctx.drawImage(img, (cvs.width / 2) - (100 / 2), (cvs.height / 1) - (100 / 1), 100, 100);
			}, 500);
			circle(4, cvs.width <= cvs.height ? cvs.width / 2 / 10 : cvs.height / 2 / 10, ("00" + d).slice(-3) + "d", d * (1 / 365));
			circle(3, cvs.width <= cvs.height ? cvs.width / 2 / 10 : cvs.height / 2 / 10, ("00" + h).slice(-2) + "h", h * (1 / 24));
			circle(2, cvs.width <= cvs.height ? cvs.width / 2 / 10 : cvs.height / 2 / 10, ("00" + m).slice(-2) + "m", m * (1 / 60));
			circle(1, cvs.width <= cvs.height ? cvs.width / 2 / 10 : cvs.height / 2 / 10, ("00" + s).slice(-2) + "s", s * (1 / 60));
			timeout = setTimeout(function () {fn(d, h, m, s);}, 1000);
			if (--s < 0 && (s = s + 60)) {
				if (--m < 0 && (m = m + 60)) {
					if (--h < 0 && (h = h + 24)) {
						if (--d < 0 && (d = d + 365)) {
							clearTimeout(timeout);
						}
					}	
				}
			}
		};
		
		fn(parseInt(diff / 86400), parseInt(diff % 86400 / 3600), parseInt(diff % 86400 % 3600 / 60), parseInt(diff % 86400 % 3600 % 60 / 1));
		$(window).bind("load scroll resize", function () {
			var opacity = Math.round((1 - 2 / $(element).height() * $(window).scrollTop()) * 100) / 100;
		
			$(element).find(".content").css({"margin": $(element).height() / 10 - $(window).scrollTop() / 4 + "px 0 0 0"});
			$(element).find(".content").css({"opacity": opacity >= 0 ? opacity <= 1 ? opacity : 1 : 0});
			$(element).find(".clock").css({"opacity": opacity >= 0 ? opacity <= 1 ? opacity : 1 : 0});
		});
		return (this);
	}
})(jQuery);

(function ($) {
	$.fn.substitute = function (html) {
		var element = this;
		var status = false;
		
		$(element).find(".button").bind("click", function (event) {
			if ($(element).find(".data").find(".field").size() != 0) {
				$(element).find(".data").find(".field").each(function (index) {
					var selection = this;
				
					$(selection).attr("class", $(selection).val() == $(selection).attr("placeholder") ? "field error" : "field");
				});
			}
			if ($(element).find(".data").find(".error").size() == 0) {
				if (status == false) {
					status = true;
					if (html) {
						$.ajax({
							"url": $(element).find(".data").attr("action"),
							"type": $(element).find(".data").attr("method"),
							"data": $(element).find(".data").serialize(),
							"success": function (data) {								
								if ($(html).size() != 0) {
									$(element).find(".button").replaceWith(html);
									status = false;
								}
							}
						});
					}
					else {
						$(element).find(".data").submit();
					}
				}
			}
			return (false);
		});
		return (this);
	};
})(jQuery);

(function ($) {
	$.fn.draw = function (opts) {
		var element = this;
		var latitude = _LATITUDE;
		var longitude = _LONGITUDE;
		
		$(window).bind("load resize", function (event) {
			new google.maps.Marker({
				"icon": {
					"url": "resources/images/marker.png",
					"size": new google.maps.Size(64, 64),
					"scaledSize": new google.maps.Size(64, 64)
				},
				"position": new google.maps.LatLng(latitude, longitude),
				"map": new google.maps.Map($(element).find(".content").get(0), {
					"center": new google.maps.LatLng(latitude, longitude),
					"zoom": 10,
					"mapTypeId": google.maps.MapTypeId.ROADMAP,
					"mapTypeControl": false,
					"scrollwheel": false
				})
			});
			$(element).find(".content").width($(element).width());
			$(element).find(".content").height($(element).height());
		});
		return (this);
	};
})(jQuery);

$(function () {
	$(document).placeholder();
	$(document).spinload();
	$(window).bind("load resize", function (event) {
		if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1)
		{
			 //Do Firefox-related activities
		}
		else
		{
			$("#frame").css({"margin": $(window).height() + "px 0 0 0"});
		}
	});
});