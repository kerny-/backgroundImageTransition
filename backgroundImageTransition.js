/**
 * @author Kerny
 * @site http:/kerny.ru/
 * @version 1.1
 * @date 2013-07-31
 */

(function($) {
    var
        methods = {
        init: function(options) {
            return this.each(function() {

                var settings = $.extend({
                    "transition-duration": 0,
                    "transition-timing-function": "swing",
                    "transition-delay": 0,        
                    "pseudo-class" : ":hover",
                    "eventActivate" : "mouseenter",
                    "eventDeActivate" : "mouseleave",
                    "prefix" : "bit-"
                }, options);

                var objThis = $(this),
                        backgroundSourse = $("<div>", {
                    class: settings.prefix + "background"
                }),
                backgroundSourseTransition = $("<div>", {
                    class: settings.prefix + "background-transition"
                }),
                backgroundImage = objThis.css("background-image"),
                        backgroundImageTransition = objThis.css("background-image"),
                        sizeContainer = $.fn.backgroundImageTransition("calculateSize", objThis),
                        relative = false, top, left;

                objThis.parents().each(function(){
                    if($(this).css("position") == "relative"){
                        relative = true;
                        return false;
                    }
                });

                if(relative){
                    top = objThis.position().top
                    + parseInt(objThis.css("margin-top"))
                    + parseInt(objThis.css("border-top-width"));
                    left = objThis.position().left
                    + parseInt(objThis.css("margin-left"))
                    + parseInt(objThis.css("border-left-width"));
                }else{
                    top = objThis.offset().top 
                    + parseInt(objThis.css("border-top-width"));
                    left = objThis.offset().left 
                    + parseInt(objThis.css("border-left-width"));   
                }

                var cssRules = {
                    "background-image": backgroundImage,
                    "background-repeat": objThis.css("background-repeat"),
                    "background-attachment": objThis.css("background-attachment"),
                    "background-clip": objThis.css("background-clip"),
                    "background-origin": objThis.css("background-origin"),
                    "background-size": objThis.css("background-size"),
                    "background-position": objThis.css("background-position"),
                    "position": "absolute",
                    "top": top,
                    "left": left,
                    "height": sizeContainer.height + "px",
                    "width": sizeContainer.width + "px",
                    "display": "none",
                    "cursor" : objThis.css("cursor")
                };

                backgroundSourse.css(cssRules);
                backgroundSourseTransition.css(cssRules);

                var properties = {
                    "objThis": objThis,
                    "backgroundSourse": backgroundSourse,
                    "backgroundSourseTransition": backgroundSourseTransition,
                    "flag" : true
                };

                properties = $.extend(properties, settings);

                if(settings["pseudo-class"] == ":hover"){
                    settings.eventActivate = "mouseenter";
                    settings.eventDeActivate = "mouseleave";                    
                }
                if(settings["pseudo-class"] == ":focus"){
                    settings.eventActivate = "focus";
                    settings.eventDeActivate = "blur";   
                }
                if(settings["pseudo-class"] == ":active"){
                    settings.eventActivate = "mousedown";
                    settings.eventDeActivate = "mouseup";   
                }                
             
                if(settings.eventActivate == settings.eventDeActivate){
                    throw "Warning: the same event for the activation " 
                    + "and deactivation (eventActivate equally eventDeActivate). "
                    + "This can lead to erratic behavior!";
                }             

                objThis.on(settings.eventActivate, function(event){
                    if(properties.flag){
                        $.fn.backgroundImageTransition("activate", properties);
                    }
                });

                objThis.on(settings.eventDeActivate, function(event){
                    if(!properties.flag){
                        $.fn.backgroundImageTransition("deActivate", properties);
                    }
                });
            });
        },
        activate: function(properties) {

            var objThis = properties.objThis,
                backgroundSourse = properties.backgroundSourse,
                backgroundSourseTransition = properties.backgroundSourseTransition;               

            if (objThis.css("background-image") != "none") {
                backgroundImageTransition = objThis.css("background-image");
                backgroundSourseTransition.css({
                    "background-image": backgroundImageTransition,
                    "opacity": 0,
                    "background-position": objThis.css("background-position"),
                });
            }

            if(backgroundSourse.css("background-position") 
                != backgroundSourseTransition.css("background-position")
                || backgroundSourse.css("background-image") 
                != backgroundSourseTransition.css("background-image")){

                $.fn.backgroundImageTransition("insertLayer", properties);            
                backgroundSourse.show();
                backgroundSourseTransition.show();
                objThis.css({"background-image": "none"});

                $.fn.backgroundImageTransition("transition",
                                backgroundSourseTransition,
                                backgroundSourse,
                                function(){
                                    backgroundSourse.remove();
                                    backgroundSourseTransition.remove();
                                    objThis[0].style.removeProperty("background-image");
                                    properties.flag = false;
                                },
                                properties);

                }
        },
        deActivate: function(properties) {
            var objThis = properties.objThis,
                backgroundSourse = properties.backgroundSourse,
                backgroundSourseTransition = properties.backgroundSourseTransition;  

            if(backgroundSourse.css("background-position") 
            != backgroundSourseTransition.css("background-position")
            || backgroundSourse.css("background-image") 
            != backgroundSourseTransition.css("background-image")){

                $.fn.backgroundImageTransition("insertLayer", properties);          
                backgroundSourse.show();
                backgroundSourseTransition.show();
                objThis.css({"background-image": "none"});

                $.fn.backgroundImageTransition("transition",
                        backgroundSourse,
                        backgroundSourseTransition,
                        function(){
                            backgroundSourse.remove();
                            backgroundSourseTransition.remove();
                            objThis[0].style.removeProperty("background-image");
                            if(objThis.attr("style") == ""){
                                objThis.removeAttr("style");
                            }
                            properties.flag = true;
                        },
                        properties
                );
            }
        },
        transition: function(layer, _layer, fn, properties) {
            layer.delay(properties["transition-delay"])
                    .animate({opacity: 1},
            properties["transition-duration"],
                    properties["transition-timing-function"], fn);

            _layer.delay(properties["transition-delay"])
                    .animate({opacity: 0},
            properties["transition-duration"],
                    properties["transition-timing-function"], fn);
        },
        calculateSize: function(container) {
            return { "width": container[0].clientWidth,
                    "height": container[0].clientHeight };
        },
        insertLayer: function(properties) {
            if(properties["pseudo-class"] == ":focus"){
                properties.objThis.after(properties.backgroundSourse);
                properties.objThis.after(properties.backgroundSourseTransition); 
            }else{
                properties.objThis.prepend(properties.backgroundSourse);
                properties.objThis.prepend(properties.backgroundSourseTransition);   
            }
        }
    };

    $.fn.backgroundImageTransition = function(method) {
        if (methods[method]) {
            return methods[method].apply(
                    this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method name "
                    + method +
                    "does not exist for jQuery.backgroundImageTransition");
        }
        return $(this);
    };
})(jQuery);