
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

    let projectArray = [
        {
            projectTitle: `TestTitle1`,
            projectSubTitle: `testDescription`,
            projectSource: `https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg`
        }
    ]

    let imageArray = [
        {
            imageTitle: `TestTitle1`,
            imageSubTitle: `testSubTitle1`,
            imageSource: `https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg`
        },
        {
            imageTitle: `TestTitle2`,
            imageSubTitle: `testSubTitle2`,
            imageSource: `https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg`
        }
    ]

    let skillArray = [
        {
            skillTitle: `Python`,
            skillProficiency: 4
        },
        {
            skillTitle: `JavaScript`,
            skillProficiency: 3
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
                    $('#headerDivider').animate({ width: "97%" }, 1000)
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

    for (let x = 0; projectArray.length > x; x++) {
        $('#projectMiniColumn').append(`
        <div class="projectMini d-flex" id="project${x}">
        <div class="projectMiniPortraitContainer m-3">
          <!--Photos should be Square with slight border radius or circles-->
          <img
            src="${projectArray[x].projectSource}"
            height="90rem" width="90rem" style="border-radius: 10%;background: grey;">
        </div>
        <div class="textContainer my-3">
          <div class="projectMiniTitle">
          ${projectArray[x].projectTitle}
          </div>
          <div class="projectMiniDescription">
            ${projectArray[x].projectSubTitle}
          </div>
        </div>
    </div>`)

        $('#project' + x).click(() => {

            $('#projectInfoHeader').animate({
                "margin-left": "50%",
                "opacity": "0%"
            }, {
                duration: 500,
                queue: false,
                complete: function () {
                    $(`#projectInfoHeader`).empty()
                    $(`#projectInfoHeader`).html(`
                    <div id="selectedImageContainer">
                    <img
                      src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/9db370bc-c5c2-4934-be16-964f759f20f2/dc79c49-ae9456ae-1a9b-4909-aff2-6f8231c9bcfa.png/v1/fill/w_1024,h_1151,strp/soyboy_by_tullamoredew_dc79c49-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTE1MSIsInBhdGgiOiJcL2ZcLzlkYjM3MGJjLWM1YzItNDkzNC1iZTE2LTk2NGY3NTlmMjBmMlwvZGM3OWM0OS1hZTk0NTZhZS0xYTliLTQ5MDktYWZmMi02ZjgyMzFjOWJjZmEucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.FRGOZdzZ4TjuvzjzFdTA7XowilgW4JrCLS-bBOA1WvE"
                      height="120rem" width="120rem" style="border-radius: 10%;background: grey;">
                  </div>
                  <div id="selectedText" class="mx-4">
            <div id="selectedTitle">
              Selected Title
            </div>
            <div id="selectedSubText">
              Selected Sub Text
            </div>
                    </div>`)
                    $('#projectInfoHeader').css("margin-left", "-10%")
                    $('#projectInfoHeader').animate({
                        "opacity": "100%",
                        "margin-left": "0%",
                    }, 500)
                }
            })

            $('#headerDivider').animate({
                "margin-left": "50%",
                "opacity": "0%"
            }, {
                duration: 600,
                queue: false,
                complete: function () {
                    $(`#headerDivider`).empty()
                    $('#headerDivider').css("margin-left", "-10%")
                    $('#headerDivider').animate({
                        "opacity": "25%",
                        "margin-left": "0%",
                    }, 500)
                }
            })

            $('#projectInfoDescription').animate({
                "margin-left": "50%",
                "opacity": "0%"
            }, {
                duration: 700,
                queue: false,
                complete: function () {
                    $(`#projectInfoDescription`).empty()
                    $(`#projectInfoDescription`).html(`
                    <div id="projectInfoDescription">Description Description Description Description Description Description
                    Description Description Description
                  </div>`)
                    $('#projectInfoDescription').css("margin-left", "-10%")
                    $('#projectInfoDescription').animate({
                        "opacity": "100%",
                        "margin-left": "0%",
                    }, 500)
                }
            })
        })
    }

    for (let x = 0; skillArray.length > x; x++) {
        $('#rightSkillContainer').append(`
        <div class="skillRow row d-flex my-3 justify-content-end">
          <div class="skillTitle col-md-5">
            ${skillArray[x].skillTitle}
          </div>
          <div class="skillBar row col-md-7">
            ${returnProficiencyHTML(skillArray[x].skillProficiency)}
          </div>
        </div>`)
    }

    for (let x = 0; imageArray.length > x; x++) {
        $('#carouselContent').append(`
            <div class="carousel-item ${x == 0 ? "active" : ""}">
                <img src="${imageArray[x].imageSource}" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                    <h5>${imageArray[x].imageTitle}</h5>
                    <p>${imageArray[x].imageSubTitle}</p>
                </div>
            </div>`)
    }

});