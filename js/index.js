import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, child } from "firebase/database";

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

function returnProficiencyHTML(proficiency) {
    let returnString = ``;
    for (var x = 0; 5 > x; x++) {
        returnString += (proficiency > x ? `<div class="bar col-md-1"></div>` : `<div class="inactivebar col-md-1"></div>`)
    }
    return returnString;
}

function generateSkills(skillObject) {

    //I have decided to use .html and 1 single skillHTML string instead of clear->appending for simplicity
    let keysArray = Object.keys(skillObject)
    let skillHTML = "";
    for (let x = 0; x < keysArray.length; x++) {
        if (x) {
            skillHTML += `<hr id="softSkillDivider" class="divider mx-auto my-2" style="margin-right: 0.75rem;"></hr>`
        }
        skillHTML += `<div class="skillGroupDescription text-center my-1" id="softSkillsTitle">${keysArray[x]}</div>`

        let currentSkillObject = skillObject[keysArray[x].toString()];
        for (let y = 0; y < currentSkillObject.length; y++) {

            skillHTML += `<div class="skillRow row d-flex my-3 justify-content-end">
              <div class="skillTitle col-md-4">
                ${currentSkillObject[y].skillTitle}
              </div>
              <div class="skillBar row col-md-8">
                ${returnProficiencyHTML(currentSkillObject[y].skillProficiency)}
              </div>
            </div>`
        }
    }
    $('#rightSkillContainer').html(skillHTML)
}

function generateMeCarouselImages(meImageArray) {
    let meCarouselIndicatorHTML = "";
    let meCarouselContentHTML = "";

    for (let x = 0; meImageArray.length > x; x++) {
        if (!x) {
            meCarouselIndicatorHTML += `<li data-bs-target="#meCarouselExampleControls" data-bs-slide-to="${x}" class="active"}></li>`
        } else {
            meCarouselIndicatorHTML += `<li data-bs-target="#meCarouselExampleControls" data-bs-slide-to="${x}"}></li>`
        }

        meCarouselContentHTML += `
            <div class="carousel-item ${x == 0 ? "active" : ""}">
                <img src="${meImageArray[x].imageSource}" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                    <h5>${meImageArray[x].imageTitle}</h5>
                    <p>${meImageArray[x].imageSubTitle}</p>
                </div>
            </div>`
    }

    $('#meCarouselIndicators').html(meCarouselIndicatorHTML)
    $('#meCarouselContent').html(meCarouselContentHTML)
}

$(document).ready(function () {

    const firebaseConfig = {
        apiKey: "AIzaSyAuZ5UQ-hhmzen645TayrsRgXxP6l0ZvJ8",
        authDomain: "personalwebsite-b90a5.firebaseapp.com",
        databaseURL: "https://personalwebsite-b90a5-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "personalwebsite-b90a5",
        storageBucket: "personalwebsite-b90a5.appspot.com",
        messagingSenderId: "890357492051",
        appId: "1:890357492051:web:4e13b85be606badd5bd9a6"
    };

    initializeApp(firebaseConfig)

    var database = ref(getDatabase())

    //==================================== ME tab ==========================
    //Handles if a User focuses on tab
    var changeGreetingInterval = setInterval(function () {
        titleArrayIterable == titleArray.length - 1 ? titleArrayIterable = 0 : titleArrayIterable++;
        changeLargeTextHeader(titleArray[titleArrayIterable])
    }, 15000)

    $(window).focus(function () {
        changeGreetingInterval = setInterval(function () {
            titleArrayIterable == titleArray.length - 1 ? titleArrayIterable = 0 : titleArrayIterable++;
            changeLargeTextHeader(titleArray[titleArrayIterable])
        }, 15000)
    })

    $(window).blur(function () {
        clearInterval(changeGreetingInterval)
    })

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


    //On normal Startup, start animations and call stuff for me page
    $('.contentContainer').hide();
    $('.divider').css({ width: '0%' })
    $('#meTabContent').fadeIn('slow')
    $('#descDivider').animate({ width: "97%" }, 1000)
    $('#titleDivider').animate({ width: "40%" }, 1000)
    $('#softSkillDivider').animate({ width: "82%" }, 1000)
    get(child(database, "mePage")).then((snapshot) => {
        
        setTimeout(() => {
            if (snapshot.exists()) {
                generateMeCarouselImages(snapshot.val().meImages)
                generateSkills(snapshot.val().meSkillObject)
            } else {
                throw new Error("Data does not exist!")
            }
        }, 1000)
    }).catch((error) => {
        console.error(error);
    }).finally(() => {
    });

    $('.navbar-nav li a').click(function () {
        var clickedID = $(this).attr('id');
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

                    get(child(database, "mePage")).then((snapshot) => {//Apis will be recalled every time it is clicked
                        if (snapshot.exists()) {
                            $("#leftImageGalleryContainer").hide()
                            generateMeCarouselImages(snapshot.val().meImages)
                            generateSkills(snapshot.val().meSkillObject)
                        } else {
                            throw new Error("Data does not exist!")
                        }
                    }).catch((error) => {
                        console.error(error);
                    }).finally(() => {
                        $(`#leftImageGallerySpinner`).hide()
                        $("#leftImageGalleryContainer").show()
                    });
                    break;

                case "projectsTab":
                    $('#headerDivider').animate({ width: "97%" }, 1000)

                    get(child(database, "projectsPage")).then((snapshot) => {
                        if (snapshot.exists()) {
                            let projectArray = snapshot.val().projects
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
                        } else {
                            throw new Error("Data does not exist!")
                        }
                    }).catch((error) => {
                        console.error(error);
                    }).finally(() => {//Would remove spinner here, but .html removes it for us already 🤷 

                    });

                    break;

                case "jobsTab":

                    break;

            }
            $('#' + clickedID.slice(0, clickedID.length - 4) + 'Content').fadeIn('slow')
        }
    });
});