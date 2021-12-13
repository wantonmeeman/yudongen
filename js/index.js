
// $(window).on('scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove', function () {
//     var top_of_element = $("#meHeaderLargeText").offset().top;
//     var bottom_of_element = $("#meHeaderLargeText").offset().top + $("#meHeaderLargeText").outerHeight();
//     var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
//     var top_of_screen = $(window).scrollTop();

//     if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
//         // the element is visible, do something
//         console.log('in')
//     } else {
//         // the element is not visible, do something else
//         console.log('out')
//         $('#meHeaderLargeText').stop();
//     }
// });

// $.fn.isInViewport = function() {
//     var elementTop = $(this).offset().top;
//     var elementBottom = elementTop + $(this).outerHeight();

//     var viewportTop = $(window).scrollTop();
//     var viewportBottom = viewportTop + $(window).height();

//     return elementBottom > viewportTop && elementTop < viewportBottom;
// };  
var iterateHello;

var titleArrayIterable = 0;

var titleArray = [
    "Hi there!",
    "你好",
    "नमस्ते",
    "Hai"
]


function changeLargeTextHeader(content) {
    $('#meHeaderLargeText').animate({
        "margin-left": "50%",
        "opacity": "0%"
    }, {
        duration: 500,
        complete: function () {
            $('#meHeaderLargeText').css("margin-left", "-10%")
            $('#meHeaderLargeText').animate({
                "opacity": "100%",
                "margin-left": ".75rem",
            }, 500)
            $('#meHeaderLargeText').html(content)
        }
    })
}


$(document).ready(function () {


    //==================================== ME tab ==========================
    //Handles if a User focuses on tab
    var changeGreetingInterval = setInterval(function () {
        console.log(`titleArray`, titleArrayIterable)//Jquery requires functions to be wrapped
        titleArrayIterable == titleArray.length - 1 ? titleArrayIterable = 0 : titleArrayIterable++;
        changeLargeTextHeader(titleArray[titleArrayIterable])
    }, 15000)

    $(window).focus(function () {
        changeGreetingInterval = setInterval(function () {
            console.log(`titleArray`, titleArrayIterable)//Jquery requires functions to be wrapped
            titleArrayIterable == titleArray.length - 1 ? titleArrayIterable = 0 : titleArrayIterable++;
            changeLargeTextHeader(titleArray[titleArrayIterable])
        }, 15000)
    })

    $(window).blur(function () {
        clearInterval(changeGreetingInterval)
    })



    let imageArray = [
        {
            title: `TestTitle1`,
            subTitle: `testSubTitle1`,
            source: `https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg`
        },
        {
            title: `TestTitle2`,
            subTitle: `testSubTitle2`,
            source: `https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg`
        }
    ]

    let skillArray = [
        {
            title: `Python`,
            proficiency: 4
        },
        {
            title: `JavaScript`,
            proficiency: 3
        },
    ]

    $('.nav-link').mouseenter(
        (x) => {
            $("#" + x.target.id).animate({
                opacity: 1,
                // borderWidth: `0 0 0.2rem 0`
            }, 300)
        }).mouseleave(
            (x) => {
                $("#" + x.target.id).animate({
                    opacity: .75,
                }, 300)
                // console.log(x.target.id)
            });

    //On normal Startup, start animations
    $('.contentContainer').hide();
    $('.divider').css({ width: '0%' })
    $('#meTabContent').fadeIn('slow')
    $('#descDivider').animate({ width: "97%" }, 1000)
    $('#titleDivider').animate({ width: "40%" }, 1000)
    $('#softSkillDivider').animate({ width: "82%" }, 1000)

    $('.navbar-nav li a').click(function () {
        var clickedID = $(this).attr('id');
        console.log(clickedID)
        if ($(this).hasClass('inactive')) { //this is the start of our condition 
            $('.navbar-nav li a').removeClass('active')
            $('.navbar-nav li a').addClass('inactive');

            $(this).addClass(`active`)

            $('.contentContainer').hide();
            $('.divider').animate({ width: '0%' })
            switch (clickedID.slice(0, clickedID.length - 4)) {
                case "meTab":
                    $('#descDivider').animate({ width: "97%" }, 1000)
                    $('#titleDivider').animate({ width: "40%" }, 1000)
                    $('#softSkillDivider').animate({ width: "82%" }, 1000)
                    break;

                case "projectsTab":

                    break;

                case "jobsTab":

                    break;

            }
            $('#' + clickedID.slice(0, clickedID.length - 4) + 'Content').fadeIn('slow')
        }
    });

    function returnProficiencyHTML(proficiency) {
        let returnString = ``;
        for (var x = 0; proficiency > x; x++) {
            returnString += `<div class="bar col-md-1"></div>`
        }
        return returnString;
    }

    for (let x = 0; skillArray.length > x; x++) {
        $('#rightSkillContainer').append(`
        <div class="skillRow row d-flex my-3 justify-content-end">
          <div class="skillTitle col-md-5">
            ${skillArray[x].title}
          </div>
          <div class="skillBar row col-md-7">
            ${returnProficiencyHTML(skillArray[x].proficiency)}
          </div>
        </div>`)
    }

    for (let x = 0; imageArray.length > x; x++) {
        $('#carouselContent').append(`
            <div class="carousel-item ${x == 0 ? "active" : ""}">
                <img src="${imageArray[x].source}" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                    <h5>${imageArray[x].title}</h5>
                    <p>${imageArray[x].subTitle}</p>
                </div>
            </div>`)
    }

});