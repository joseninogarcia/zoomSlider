/*
    Plugin Name: ZoomSlider
    Date: 2/5/2015
    Developer: Jose Nino N. Garcia
    Description: This plugin is use to present the games to anybody who wants to read the details.
                 The plugin can also read the current time and presents to you current game available for
                 online, all you have to do is to modify the xml file by formatting the date to year, month and day.
    Version: 1.0
*/

var page_number = 0;
var page_visible = 0;
var countings = 0;

(function ($) {
    //ZOOM SLIDER PLUGIN
    $.fn.zoomSlider = function (options) {
       
        var settings = $.extend({
            allowButtons: true,
            imageFolder: 'images',
            monthFolder: 'feb',

        }, options);

        var ul = this.find("ul"),
            li = this.find("li"),
            img = this.find("img"),
            ul_width = ul.width(),
            ul_height = ul.height(),
            li_width = li.width(),
            li_height = li.height(),
            img_count = img.length,
            img_width = img.width();
        
        cssSelector(this, settings.containerWidth);

        if (settings.allowButtons) {
            AppendScroll(this);
        }

        var leftButton = $(".leftButton");
        var rightButton = $(".rightButton");
        var main = settings.contentWidth;
        var main_width = li.width() * 7;
        var last_point = img_width * img_count;
        var i = 0;
        var count = 0;
        var i = 1;

        //Check the current date and year.
        //Conditional statement if the year matches with the image name.
        //format of date should be 

        var getDate = new Date();
        var day = getDate.getDate();
        var newDay = "";
        var month = getDate.getMonth() + 1;
        var newMonth = "";
        var year = getDate.getFullYear();

        //Check the days 
        if (day < 10) {
            newDay = "0" + day;
        } else {
            newDay = day;
        }

        //Check the month
        if (month < 10) {
            newMonth = "0" + month;
        } else {
            newMonth = month;
        }

        //Gets the whole date and time
        var fulllDate = year + "" + newMonth + "" + newDay;
        
        //Register all of the images into the XML file and retrieve them all.
        GetXMLData(this, fulllDate);
        
        this.css("background", "#000000");
        this.css("margin-top","20px");

        return this;
    };
    
}(jQuery));

function pixels() {
    return "px";
}

function cssSelector(selector, sWidth) {
    selector.css("width", sWidth);
    selector.css("overflow", "hidden");
    selector.css("padding", "0" + pixels());
    selector.css("height", "310px");
}

function AppendScroll(selector) {

    var str = "<div class='container_button'>";
    str += "<div class='shrink_mid'>";
    str += "<div class='leftButton'></div>";
    str += "<div class='rightButton'></div>";
    str += "<div style='clear:both;'></div>";
    str += "</div>";
    str += "</div>";
    
    selector.after(str);
}

//GLOBAL VARIABLES FOR COUNTER
var k = 1; //id of the image
var count = 0;
var lastCount = 1;

function GetXMLData(sel, _date) {

    sel.append("<ul></ul>");
    var ul = sel.find("ul");
    var arr2 = [];
    var banners = [];

    $.get('xml/banners.xml', function (data) {
        $(data).find("banners").each(function () {
            for (var i = 0; i < $(this).length; i++) {
                arr2.push($(this).find("imagename").text());
                sel.find('ul').append("<li style='float:left;'>" + "<img src='img/" + $(this).find("folder").text() + "/" + $(this).find("imagename").text() + "." + $(this).find("format").text() + "' height='" + $(this).find("height").text() + "' width='" + $(this).find("width").text() + "' id='imgLabel" + k++ + "' />" + "</li>");
            }
        });

        //Less the opacity of the images
        for (var l = 0; l < sel.find("img").length; l++) {
            $("#imgLabel" + (l + 1)).animate({
                'opacity': 0.1
            }, 200);
        }

        //Load the current banner based from the date
        var indexARR = arr2.indexOf(_date) + 1;

        //zoom out the current banner
        $("#imgLabel" + indexARR).animate({
            'zoom': 1.3,
            'margin-top': -25 + "px",
            'opacity': 10
        }, 200);

        //This automatically the huge banner
        $("#banner").hide().html("<img src='img/banners/" + arr2[indexARR - 1] + ".jpg' width='1024' height='274' />").fadeIn("slow");

        //Move the container to the left if needed
        sel.find("ul").animate({
            'margin-left': "-" + (indexARR - 1) * sel.find("img").width() + "px"
        });

        var count_1 = indexARR;
        var counter1 = 0;
        var counter2 = indexARR; //movement
        var counter3 = indexARR + 1;
        var counter8 = indexARR;

        //Moves back with the last banner
        $(".leftButton").click(function () {

            count_1 = count_1 - 1;
            counter2 = counter2 - 1;
            counter3 = counter3 - 1;
            counter8 = counter8 - 1;

            //Remove all of the animation from the banners
            for (var o = 1; o <= sel.find("li").length; o++) {
                $("#imgLabel" + (o)).animate({
                    'zoom': 1.0,
                    'margin-top': 0 + "px",
                    'opacity': 0.1
                }, 200);
            }

            if (count_1 == 0) {
                //Returns to first page
                sel.find("ul").animate({
                    'margin-left': "-0px"
                });

                //Remove all of the animation
                $("#imgLabel" + sel.find("img").length).animate({
                    'zoom': 1.0,
                    'margin-top': 0 + "px",
                }, 200);

                //Reduce opacity
                $("#imgLabel" + sel.find("img").length).animate({
                    'opacity': 0.1
                }, 200);

                //RESET
                count_1 = 1;
                counter1 = 1;
                counter2 = 1;
                counter3 = 1 + 1; //because the first one must skip upon clicking
                counter8 = 1;

                $("#imgLabel1").animate({
                    'zoom': 1.3,
                    'margin-top': -25 + "px",
                    'opacity': 10
                }, 300);

            } else {
                //Move next the page
                sel.find("ul").animate({
                    'margin-left': "-" + (counter2 - 1) * sel.find("img").width() + "px"
                });

                ////Zoom out all of the images
                $("#imgLabel" + (counter3 - 1)).animate({
                    'zoom': 1.3,
                    'margin-top': -25 + "px",
                    'opacity': 10
                }, 300);

                //Loads the huge banner from the upper part.
                $("#banner").hide().html("<img src='img/banners/" + arr2[(counter8 - 1)] + ".jpg' width='1024' height='274' />").fadeIn("slow");
            }
        });

        //Triggers all the code for the children.
        $(".rightButton").click(function () {

            //Remove all of the animation from the banners
            for (var o = 1; o <= sel.find("li").length; o++) {
                $("#imgLabel" + (o)).animate({
                    'zoom': 1.0,
                    'margin-top': 0 + "px",
                    'opacity' : 0.1
                }, 200);
            }

            if ((count_1++) > sel.find("img").length - 1) {

                //Returns to first page
                sel.find("ul").animate({
                    'margin-left': "-0px"
                });

                //Remove all of the animation
                $("#imgLabel" + sel.find("img").length).animate({
                    'zoom': 1.0,
                    'margin-top': 0 + "px",
                }, 200);

                //Reduce opacity
                $("#imgLabel" + sel.find("img").length).animate({
                    'opacity': 0.1
                }, 200);

                count_1 = 1;
                counter1 = 1;
                counter2 = 1;
                counter3 = 1 + 1; //because the first one must skip upon clicking
                counter8 = 1;

                //Animates the whole banners in a small pack.
                $("#imgLabel1").animate({
                    'zoom': 1.3,
                    'margin-top': -25 + "px",
                    'opacity' : 10
                }, 300);

                //
                $("#banner").hide().html("<img src='img/banners/" + arr2[0] + ".jpg' width='1024' height='274' />").fadeIn("slow");

            } else {
                //Move next the page
                sel.find("ul").animate({
                    'margin-left': "-" + (counter2++) * sel.find("img").width() + "px"
                });

                //Zoom out all of the images
                $("#imgLabel" + counter3++).animate({
                    'zoom': 1.3,
                    'margin-top': -25 + "px",
                    'opacity': 10
                }, 300);

                ///Loads the huge banner on the upper
                $("#banner").hide().html("<img src='img/banners/" + arr2[counter8++] + ".jpg' width='1024' height='274' />").fadeIn("slow");
            }
        });

        //Get the image root
        var image = sel.find("img");

        //This is used for pointer properties.
        image.css("cursor", "pointer");

        //This function is when it needs to hover each of the images
        //There would be no exception during this end.
        image.hover(function () {
            var index = image.index(this);

            if (index == null) {
                $("#banner").html("");
            } else {
                $("#banner").hide().html("<img src='img/banners/" + arr2[index] + ".jpg' width='1024' height='274' />").fadeIn("slow");
            }
        }, function () {
            //$("#banner").html("");
        });
    });

    ul.css("list-style-type", "none");
    ul.css("width", "10000" + pixels());
    ul.css("display", "block");
    ul.after("<div style='clear:both;'></div>");
    ul.css("position", "relative");
    ul.css("margin-top", "30" + pixels());
}