
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
            projectSource: `https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg`,
            projectImageArray: [{
                imageTitle: `TestTitle1`,
                imageSubTitle: `testSubTitle1`,
                imageSource: `https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg`
            },
            {
                imageTitle: `TestTitle2`,
                imageSubTitle: `testSubTitle1`,
                imageSource: `https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg`
            }]
        },
        {
            projectTitle: `TestTitle2`,
            projectSubTitle: `testDescription2`,
            projectSource: `https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg`,
            projectImageArray: [{
                imageTitle: `TestTitle1`,
                imageSubTitle: `testSubTitle1`,
                imageSource: `https://mdbootstrap.com/img/Photos/Slides/img%20(15).jpg`
            }]
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

    let skillObject = {
        programmingLanguagesArray: [
            {
                skillTitle: `Python`,
                skillProficiency: 4
            },
            {
                skillTitle: `JavaScript`,
                skillProficiency: 3
            },
        ],
        softSkillsArray:
            [
                {
                    skillTitle: `Python`,
                    skillProficiency: 4
                }
            ],
        languagesArray:
            [
                {
                    skillTitle: `English`,
                    skillProficiency: 5
                },
                {
                    skillTitle: `Chinese`,
                    skillProficiency: 2
                },
            ]
    }


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
        for (var x = 0;5 > x; x++) {
            returnString += (proficiency > x ? `<div class="bar col-md-1"></div>` : `<div class="inactivebar col-md-1"></div>`)
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

        $('#project' + x).hover(
            () => {
                $('#project' + x).animate({
                    'background-color': '#e8e8e8'
                }, {
                    duration: 500,
                    queue: false
                })
            },
            () => {
                $('#project' + x).animate({
                    'backgroundColor': '#FFFFFF'
                }, {
                    duration: 500,
                    queue: false
                });
            }
        )

        $('#project' + x).click(() => {
            $('.projectMini').css("background-color", `#FFFFFF`)

            for (let x = 0; projectArray.length > x; x++) { //Regerates all hover events. Ineffecient but wtv
                $('#project' + x).hover(
                    () => {
                        $('#project' + x).animate({
                            'background-color': '#e8e8e8'
                        }, {
                            duration: 500,
                            queue: false
                        })
                    },
                    () => {
                        $('#project' + x).animate({
                            'backgroundColor': '#FFFFFF'
                        }, {
                            duration: 500,
                            queue: false
                        });
                    }
                )
            }

            $('#project' + x).stop().css('background-color', '#cfcfcf').unbind('mouseenter mouseleave');

            $('#projectImageContainer').animate({
                "margin-left": "50%",
                "opacity": "0%"
            }, {
                duration: 500,
                queue: false,
                complete: function () {


                    $('#projectCarouselContent').empty()
                    $('#projectCarouselIndicators').empty()
                    for (let y = 0; projectArray[x].projectImageArray.length > y; y++) {
                        if (!y) {
                            $('#projectCarouselIndicators').append(`
                            <li data-bs-target="#projectsCarouselExampleControls" data-bs-slide-to="${y}" class="active"}></li>
                            `)
                        } else {
                            $('#projectCarouselIndicators').append(`
                            <li data-bs-target="#projectsCarouselExampleControls" data-bs-slide-to="${y}"}></li>
                           `)
                        }
                        $('#projectCarouselContent').append(`
                            <div class="carousel-item ${y == 0 ? "active" : ""}">
                        <img src="${projectArray[x].projectImageArray[y].imageSource}" class="d-block w-100" alt="..." />
                        <div class="carousel-caption d-none d-md-block">
                            <h5>${projectArray[x].projectImageArray[y].imageTitle}</h5>
                            <p>${projectArray[x].projectImageArray[y].imageSubTitle}</p>
                        </div>
                    </div>`)
                    }

                    $('#projectImageContainer').css("margin-left", "-10%")
                    $('#projectImageContainer').animate({
                        "opacity": "100%",
                        "margin-left": "0%",
                    }, 500)
                }
            })

            $('#projectInfoHeader').animate({
                "margin-left": "50%",
                "opacity": "0%"
            }, {
                duration: 500,
                queue: false,
                complete: function () {
                    $(`#projectInfoHeader`).html(`
                    <div id="selectedImageContainer">
                    <img
                      src="${projectArray[x].projectSource}"
                      height="120rem" width="120rem" style="border-radius: 10%;background: grey;">
                  </div>
                  <div id="selectedText" class="mx-4">
                    <div id="selectedTitle">
                        ${projectArray[x].projectTitle}
                    </div>
                    <div id="selectedSubText">
                        ${projectArray[x].projectSubTitle}
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
                    $('#headerDivider').css("margin-left", "-10%")
                    $('#headerDivider').animate({
                        "opacity": "25%",
                        "margin-left": ".75rem",
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

    $('#rightSkillContainer').append(`<div class="skillGroupDescription text-center my-1" id="softSkillsTitle">Soft Skills</div>`)

    for (let x = 0; skillObject.softSkillsArray.length > x; x++) {
        $('#rightSkillContainer').append(`
            <div class="skillRow row d-flex my-3 justify-content-end">
              <div class="skillTitle col-md-4">
                ${skillObject.softSkillsArray[x].skillTitle}
              </div>
              <div class="skillBar row col-md-8">
                ${returnProficiencyHTML(skillObject.softSkillsArray[x].skillProficiency)}
              </div>
            </div>`)
    }

    $('#rightSkillContainer').append(`
    <hr id="softSkillDivider" class="divider mx-auto my-2" style="margin-right: 0.75rem;"></hr>
    <div class="skillGroupDescription text-center my-1" id="hardSkillsTitle">Programming Languages</div>`
    )
    
    for (let x = 0; skillObject.programmingLanguagesArray.length > x; x++) {
        $('#rightSkillContainer').append(`
            <div class="skillRow row d-flex my-3 justify-content-end">
              <div class="skillTitle col-md-4">
                ${skillObject.programmingLanguagesArray[x].skillTitle}
              </div>
              <div class="skillBar row col-md-8">
                ${returnProficiencyHTML(skillObject.programmingLanguagesArray[x].skillProficiency)}
              </div>
            </div>`)
    }

    $('#rightSkillContainer').append(`
    <hr id="softSkillDivider" class="divider mx-auto my-2" style="margin-right: 0.75rem;"></hr>
    <div class="skillGroupDescription text-center my-1" id="hardSkillsTitle">Languages</div>`
    )

    for (let x = 0; skillObject.languagesArray.length > x; x++) {
        $('#rightSkillContainer').append(`
            <div class="skillRow row d-flex my-3 justify-content-end">
              <div class="skillTitle col-md-4">
                ${skillObject.languagesArray[x].skillTitle}
              </div>
              <div class="skillBar row col-md-8">
                ${returnProficiencyHTML(skillObject.languagesArray[x].skillProficiency)}
              </div>
            </div>`)
    }



    for (let x = 0; imageArray.length > x; x++) {
        if (!x) {
            $('#meCarouselIndicators').append(`
            <li data-bs-target="#meCarouselExampleControls" data-bs-slide-to="${x}" class="active"}></li>
            `)
        } else {
            $('#meCarouselIndicators').append(`
            <li data-bs-target="#meCarouselExampleControls" data-bs-slide-to="${x}"}></li>
            `)
        }

        $('#meCarouselContent').append(`
            <div class="carousel-item ${x == 0 ? "active" : ""}">
                <img src="${imageArray[x].imageSource}" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                    <h5>${imageArray[x].imageTitle}</h5>
                    <p>${imageArray[x].imageSubTitle}</p>
                </div>
            </div>`)
    }

});