import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, child } from "firebase/database";

const bucketLink = "https://dongenpersonalwebsite.s3.ap-southeast-1.amazonaws.com/"

const cssColorVariables = {//1st = light,2nd = dark//Take light val difference * 2.5
    mainTextColor: ["#000000", "#919191"],
    mainBackgroundColor: ["#FFFFFF", "#000000"],
    navbarBackgroundColor: ["#f7f7f7", "#141414"],
    navbarActiveTextColor: ["#000000E5", "#FFFFFFE5"],
    /*last 2 hexadecimals = opacity*/
    navbarInactiveTextColor: ["#0000008C", "#FFFFFF8C"],
    /*last 2 hexadecimals = opacity*/
    /*navbarHoverTextColor:"],*/
    navbarContactIconContainerBackgroundColor: ["#e8e8e8", "#3a3a3a"],
    navbarContactIconBackgroundColor: ["#d4d4d4", "#6c6c6c"],
    carouselImageSubtitle: ['#FFFFFF', '#c8c8c8'],
    carouselImageTitle: ['#FFFFFF', '#c8c8c8'],
    carouselIndicators: ['#FFFFFF', '#c8c8c8'],
    dividerColor: ['#000000', '#FFFFFF'],
    personalImageBorderColor: ["#7d7d7d", "#afafaf"],
    skillBarActiveColor: ["#7d7d7d", "#c3c3c3"],
    skillBarInactive: ["#e8e8e8", "#3a3a3a"],
    scrollBarThumbColor: ["#e0e0e0", "#424242"],
    scrollBarHoverColor: ["#d1d1d1", "#515151"],
    projectMiniHoverColor: ["#e8e8e8", "#3a3a3a"],
    projectMiniSelectedColor: ["#cfcfcf", "#484848"],
    projectBottomBorderColor: ["#dbdbdb", "#5a5a5a"],
    timelineColor: ["#ebebeb", "#2e2e2e"],
    timelineNodeColor: ["#000000", "#FFFFFF"],
    timelineCardBackgroundColor: ["#d2d2d2", "#2d2d2d"],
    timelineCardShadowColor: ["#00000026", "#FFFFFF26"],
    timelineCardBorderColor: ["#ebebeb", "#1f1f1f"],
    timelineCardTextHoverColor: ["#363636", "#b8b8b8"]
}

var titleArrayIterable = 0;

var titleArray = [
    "Hi there!",
    "你好",
    "नमस्ते",
    "Hai"
]

var selectedProjectID;

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

function generateNavbarContactIcons(contactArray) {
    let navbarContactHTML = ""
    for (let x = 0; contactArray.length > x; x++) {
        navbarContactHTML += ` <a class="m-1" href="${bucketLink + contactArray[x].iconSource}">
        <img src="${bucketLink + contactArray[x].iconSource}"
          height="35rem" width="35rem" class="contactIcon">
      </a>`
    }
    $("#navbarContactIconContainer").html(navbarContactHTML)
}

function generateDescription(description) {
    $("#meDescription").html(description)
}

function generatePersonalImage(personalImage) {
    $("#personalImage").attr("src", bucketLink + personalImage)
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
    console.log(`meIMAGEaRRAY`, meImageArray)
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
                <img src="${bucketLink + meImageArray[x].imageSource}" class="d-block w-100" alt="..." />
                <div class="carousel-caption d-none d-md-block">
                    <h5 class="carouselImageTitle">${meImageArray[x].imageTitle}</h5>
                    <p class="carouselImageSubtitle">${meImageArray[x].imageSubTitle}</p>
                </div>
            </div>`
    }

    $("#leftImageGalleryContainer").html(
        `<div id="meCarouselExampleControls" class="carousel slide" data-bs-ride="carousel">
        <ol class="carousel-indicators" id="meCarouselIndicators">
        ${meCarouselIndicatorHTML}
        </ol>
            <div id="meCarouselContent" class="carousel-inner">
            ${meCarouselContentHTML}
            </div>
            <!--Bootstrap 5 uses data-bs instead of data-mdb -->
            <button class="carousel-control-prev" type="button" data-bs-target="#meCarouselExampleControls"
              data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#meCarouselExampleControls"
              data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>`
    )
}

function generateProjectMiniColumn(x) {
    $('.projectMini').removeClass("active")
    $('#project' + x).addClass("active")
}

function generateProjectsAndEvents(projectArray) {
    $('#projectMiniColumn').empty()
    $('#projectCarouselLeft').hide()
    $('#projectCarouselRight').hide()
    for (let x = 0; projectArray.length > x; x++) {

        $('#projectMiniColumn').append(`
        <div class="projectMini d-flex" id="project${x}">
        <div class="projectMiniPortraitContainer m-3">
          <!--Photos should be Square with slight border radius or circles-->
          <img
            src="${bucketLink + projectArray[x].projectSource}"
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

        if (projectArray[x].projectID == selectedProjectID) {
            generateProjectMiniColumn(x)
        }

        $('#project' + x).click(() => {
            //This handles the Colour change on Click

            selectedProjectID = projectArray[x].projectID

            generateProjectMiniColumn(x)

            //Handles animating in the content
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
                        <img src="${bucketLink + projectArray[x].projectImageArray[y].imageSource}" class="d-block w-100" alt="..." />
                        <div class="carousel-caption d-none d-md-block">
                            <h5 class="carouselImageTitle">${projectArray[x].projectImageArray[y].imageTitle}</h5>
                            <p class="carouselImageSubtitle">${projectArray[x].projectImageArray[y].imageSubTitle}</p>
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
                      src="${bucketLink + projectArray[x].projectSource}"
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
                    $('#projectCarouselLeft').show()
                    $('#projectCarouselRight').show()
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
}

function generateSpinnersForTab(tab) {
    switch (tab) {
        case "meTab":
            $("#leftImageGalleryContainer").html(`
            <div id="leftImageGallerySpinner" class="spinner-grow mx-auto text-muted my-5"></div>
            `)
            $('#rightSkillContainer').html(`
            <div class="spinner-grow text-muted mx-auto my-5"></div>
            `)
            break;
        case "projectsTab":
            $(`#projectMiniColumn`).html(`
            <div id="projectMiniColumnSpinner" class="spinner-grow text-muted my-5 mx-auto"></div>
            `)
            break;
        case "timelineTab":
            $(`#timelineRow`).html(`<div id="timelineSpinner" class="spinner-grow text-muted mx-auto my-5"></div>
            <div class="col-12">
              <!-- Timeline Area-->
              <div class="apland-timeline-area">
                <!-- Single Timeline Content-->
              </div>
            </div>`)
            break;
    }
}

function generateCardIconColor(type) {
    let returnColor;
    switch (type) {
        case 'job':
            returnColor = "#c2ffd2"
            break;
        case 'project':
            returnColor = "#ffc2c2"
            break;

    }

    return returnColor
}

function generateCursorPointerAndClickEvent(type){
    let returnStyle;
    if(type == "project"){
        return "cursor:pointer"
    }

    return returnStyle
}

function generateTimeline(timelineArray) {
    console.log(timelineArray)
    
    for (let x = 0; timelineArray.length > x; x++) {
        timelineHTML += `
        <div class="single-timeline-area">
                  <div class="timeline-date wow fadeInLeft" data-wow-delay="0.1s" style="visibility: visible; animation-delay: 0.1s; animation-name: fadeInLeft;">
                      <p>${timelineArray[x].year}</p>
                  </div>
            <div class="row">`
        for (let y = 0; timelineArray[x].events.length > y; y++) {
            timelineHTML += `<div class="col-12 col-md-6 col-lg-4">
                     <div class="single-timeline-content d-flex wow fadeInLeft" data-wow-delay="0.3s" style="visibility: visible; animation-delay: 0.3s; animation-name: fadeInLeft; ${generateCursorPointerAndClickEvent(timelineArray[x].events[y].type)};">
                       <div class="timeline-icon" style="background-color:${generateCardIconColor(timelineArray[x].events[y].type)}">
                       <i class="fa fa-briefcase" aria-hidden="true"></i>
                        </div>
                         <div class="timeline-text">
                           <h6>${timelineArray[x].events[y].title}</h6>
                           <p>${timelineArray[x].events[y].description}</p>
                        </div>
                    </div>
                </div>`
        }
        timelineHTML += `
                <hr class="timelineDivider divider mx-auto my-2"></hr>
            </div>
        </div>`
    }
    $(".apland-timeline-area").html(timelineHTML)
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

    $('#lightModeInputForm').change(function (checkbox) {//Dark/Light Mode Handling
        /*You cant animate css variable changes in Jquery, so we set an animation if a property changes in css, thenwe change that property here*/

        //HTML way
        // document.body.style.setProperty("--mainBackgroundColor",
        // cssColorVariables["mainBackgroundColor"][checkbox.target.checked ? 1 : 0])

        //JQuery way
        let cssColorVariablesKeyArray = Object.keys(cssColorVariables)
        let styleNavbarBackgroundString = ""
        for (let x = 0; cssColorVariablesKeyArray.length > x; x++) {
            styleNavbarBackgroundString +=
                `--${cssColorVariablesKeyArray[x]}:
            ${(cssColorVariables[cssColorVariablesKeyArray[x]][checkbox.target.checked ? 1 : 0])};`
        }
        $("html").attr("style", styleNavbarBackgroundString)
    });

    //===NavBar===
    get(child(database, "navbar")).then((snapshot) => {
        if (snapshot.exists()) {
            generateNavbarContactIcons(snapshot.val().navbarContactIcons)
        } else {
            throw new Error("Data does not exist!")
        }
    }).catch((error) => {
        console.error(error);
    }).finally(() => {
    });

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

    $('.navbar-nav li a').click(function () {
        var clickedID = $(this).attr('id');
        if ($(this).hasClass('inactive')) { //this is the start of our condition 
            //Literally super ineffecient but wtv
            $('.navbar-nav li a').removeClass('active')
            $('.navbar-nav li a').addClass('inactive');

            $(this).addClass(`active`)
            $(this).removeClass('inactive')
            //iNeffecivency ends here

            $('.contentContainer').hide();
            $('.divider').css({ width: '0%' })

            generateSpinnersForTab(clickedID.slice(0, clickedID.length - 4));
            switch (clickedID.slice(0, clickedID.length - 4)) {
                case "meTab":
                    $('#descDivider').animate({ width: "97%" }, 1000)
                    $('#titleDivider').animate({ width: "40%" }, 1000)
                    $('#softSkillDivider').animate({ width: "82%" }, 1000)
                    setTimeout(() => {
                        get(child(database, "mePage")).then((snapshot) => {//Apis will be recalled every time it is clicked
                            if (snapshot.exists()) {
                                generateMeCarouselImages(snapshot.val().meCarouselImages)
                                generateSkills(snapshot.val().meSkillObject)
                                generatePersonalImage(snapshot.val().meImage)
                                generateDescription(snapshot.val().meDescription)
                            } else {
                                throw new Error("Data does not exist!")
                            }
                        }).catch((error) => {
                            console.error(error);
                        }).finally(() => {
                        });
                    }, 1000)

                    break;

                case "projectsTab":
                    $('#headerDivider').animate({ width: "97%" }, 1000)
                    setTimeout(() => {
                        get(child(database, "projectsPage")).then((snapshot) => {
                            if (snapshot.exists()) {
                                let projectArray = snapshot.val().projects
                                generateProjectsAndEvents(projectArray)

                            } else {
                                throw new Error("Data does not exist!")
                            }
                        }).catch((error) => {
                            console.error(error);
                        }).finally(() => {//Would remove spinner here, but .html removes it for us already 🤷 

                        });
                    }, 1000)
                    break;

                case "timelineTab":
                    setTimeout(() => {
                        get(child(database, "timelinePage")).then((snapshot) => {
                            if (snapshot.exists()) {
                                let timelineArray = snapshot.val().timeline
                                generateTimeline(timelineArray)
                            } else {
                                throw new Error("Data does not exist!")
                            }
                        }).catch((error) => {
                            console.error(error);
                        }).finally(() => {
                            $('#timelineSpinner').hide()
                        });
                    }, 1000)
                    break;

            }
            console.log(('#' + clickedID.slice(0, clickedID.length - 4) + 'Content'))
            $('#' + clickedID.slice(0, clickedID.length - 4) + 'Content').fadeIn('slow')
        }
    });

    //==========================Handling Normal Startup=============================
    //On normal Startup, start animations and call stuff for me page
    $('.contentContainer').hide();
    $('.contentContainer').height($(window).height() - $(`.navbar`).height());

    $('.divider').css({ width: '0%' })
    $('#meTabContent').fadeIn('slow')
    $('#descDivider').animate({ width: "97%" }, 1000)
    $('#titleDivider').animate({ width: "40%" }, 1000)
    $('#softSkillDivider').animate({ width: "82%" }, 1000)


    //loading Information from mePage
    setTimeout(() => {
        get(child(database, "mePage")).then((snapshot) => {
            if (snapshot.exists()) {
                generateMeCarouselImages(snapshot.val().meCarouselImages)
                generateSkills(snapshot.val().meSkillObject)
                generatePersonalImage(snapshot.val().meImage)
                generateDescription(snapshot.val().meDescription)
            } else {
                throw new Error("Data does not exist!")
            }
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
        });
    }, 1000)

    //==================================== ME tab ==========================
    //Handles if a User focuses on tab
    var changeGreetingInterval = setInterval(function () {
        titleArrayIterable == titleArray.length - 1 ? titleArrayIterable = 0 : titleArrayIterable++;
        changeLargeTextHeader(titleArray[titleArrayIterable])
    }, 15000)

    $(window).focus(function () {
        clearInterval(changeGreetingInterval)
        changeGreetingInterval = setInterval(function () {
            titleArrayIterable == titleArray.length - 1 ? titleArrayIterable = 0 : titleArrayIterable++;
            changeLargeTextHeader(titleArray[titleArrayIterable])
        }, 15000)
    })

    $(window).blur(function () {
        clearInterval(changeGreetingInterval)
    })


});