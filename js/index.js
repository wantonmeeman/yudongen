import { initializeApp } from 'firebase/app'
import { getDatabase, ref, get, child, update } from "firebase/database";
const { CognitoIdentityClient } = require("@aws-sdk/client-cognito-identity");
const { fromCognitoIdentityPool } = require("@aws-sdk/credential-provider-cognito-identity");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const backendServerURL = "https://yudongen-backend.herokuapp.com"
const bucketLink = "https://dongenpersonalwebsite.s3.ap-southeast-1.amazonaws.com/"

const REGION = "ap-southeast-1"; //REGION

// Initialize the Amazon Cognito credentials provider
const s3 = new S3Client({
    region: REGION,
    credentials: fromCognitoIdentityPool({
        client: new CognitoIdentityClient({ region: REGION }),
        identityPoolId: 'ap-southeast-1:54f83292-219d-488c-8dd6-e142dbb52d87',
    }),
});

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
    carouselImageSubtitle: ['#d1d1d1', '#c8c8c8'],
    carouselImageTitle: ['#d1d1d1', '#c8c8c8'],
    carouselIndicators: ['#d1d1d1', '#c8c8c8'],
    carouselBackground:['#999999','#3d3d3d'],
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
    timelineCardTextHoverColor: ["#363636", "#b8b8b8"],
    inputTextArea: ["#d1d1d1", "#363636"],
    tableHeaderBorder: ["#000000", "#a1a1a1"],
    carouselPrevIcon: [`url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23d1d1d1'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e");`, `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000000'%3e%3cpath d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/%3e%3c/svg%3e");`],
    carouselNextIcon: [`url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23d1d1d1'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");`, `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000000'%3e%3cpath d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e")`]
}

var titleArrayIterable = 0;

var titleArray = [
    "Hi there!",
    "你好",
    "नमस्ते",
    "Hai"
]

var selectedProjectID;

var secretMeClickCounter = 0;

async function uploadImage(uploadObject) {
    await s3.send(new PutObjectCommand(uploadObject));
}

function generateRandomNumber(bottom, top) {
    return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
}

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

//Use append when events need to be added

function returnProficiencyHTML(proficiency) {
    let returnString = ``;
    for (var x = 0; 5 > x; x++) {
        returnString += (proficiency > x ? `<div class="bar col-2"></div>` : `<div class="inactivebar col-2"></div>`)
    }
    return returnString;
}

function generateNavbarContactIcons(contactArray) {
    let navbarContactHTML = ""
    for (let x = 0; contactArray.length > x; x++) {
       /* navbarContactHTML += ` <a class="m-1" href="${bucketLink + contactArray[x].iconSource}">
        <img src="${bucketLink + contactArray[x].iconSource}"
          height="35rem" width="35rem" class="contactIcon">
      </a>`*/
      navbarContactHTML += ` <a class="m-1" href="${contactArray[x].iconLink}">
      <img src="${contactArray[x].iconSource}"
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

            skillHTML += `<div class="skillRowContainer d-flex my-3 justify-content-center">
            <div class="skillRow d-flex">
              <div class="skillTitle col-4 me-2">
                ${currentSkillObject[y].skillTitle}
              </div>
              <div class="skillBar col-8 d-flex justify-content-start">
                ${returnProficiencyHTML(currentSkillObject[y].skillProficiency)}
              </div>
              </div>
            </div>`
        }
    }
    $('#rightSkillContainer').html(skillHTML)
}



function generateMeCarouselImages(meImageArray) {
    let meCarouselIndicatorHTML = "";
    let meCarouselContentHTML = "";
    if (meImageArray.length) {
        for (let x = 0; meImageArray.length > x; x++) {
            if (!x) {
                meCarouselIndicatorHTML += `<li data-bs-target="#meCarouselExampleControls" data-bs-slide-to="${x}" class="active"}></li>`
            } else {
                meCarouselIndicatorHTML += `<li data-bs-target="#meCarouselExampleControls" data-bs-slide-to="${x}"}></li>`
            }

            meCarouselContentHTML += `
            <div class="carousel-item ${x == 0 ? "active" : ""}">
                <div class="d-flex imageCarouselContainer">
                    <img src="${bucketLink + meImageArray[x].imageSource}" class="imageCarouselItem " alt="..."/>
                </div>
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
                  <span class="carousel-control-prev-icon"  ></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#meCarouselExampleControls"
                  data-bs-slide="next">
                  <span class="carousel-control-next-icon"  ></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>`
        )

    }
}

function generateSelectedProjectMiniColumn(x) {
    $('.projectMini').removeClass("active")
    $('#project' + x).addClass("active")
}

function generateSelectedProjectDescription(projectObject) {
    $('#projectImageContainer').animate({
        "margin-left": "50%",
        "opacity": "0%"
    }, {
        duration: 500,
        queue: false,
        complete: function () {
            $('#projectCarouselContent').empty()
            $('#projectCarouselIndicators').empty()
            for (let y = 0; projectObject.projectImageArray.length > y; y++) {
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
                    <div class="d-flex imageCarouselContainer">
                <img src="${bucketLink + projectObject.projectImageArray[y].imageSource}" class="imageCarouselItem " alt="..." />
                <div class="carousel-caption d-none d-md-block">
                    <h5 class="carouselImageTitle">${projectObject.projectImageArray[y].imageTitle}</h5>
                    <p class="carouselImageSubtitle">${projectObject.projectImageArray[y].imageSubTitle}</p>
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
              src="${bucketLink + projectObject.projectSource}"
              height="120rem" width="120rem" style="border-radius: 10%;background: grey;">
          </div>
          <div id="selectedText" class="mx-4">
            <div id="selectedTitle">
                ${projectObject.projectTitle}
            </div>
            <div id="selectedSubText">
                ${projectObject.projectSubTitle}
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
            if (selectedProjectID) {
                $(`#projectInfoDescription`).html(`<div id="projectInfoDescription">${projectObject.projectDescription}</div>`)
            }
            $('#projectInfoDescription').css("margin-left", "-10%")
            $('#projectInfoDescription').animate({
                "opacity": "100%",
                "margin-left": "0%",
            }, 500)
        }
    })
}

function generateProjectsAndEvents(projectArray) {
    $('#projectMiniColumn').empty()
    $('#projectCarouselLeft').hide()
    $('#projectCarouselRight').hide()

    $('#projectInfoContainer').html(`
        <div class="d-flex mb-3" id="projectInfoHeader">
        This is where i keep all my projects
        </div>
        <hr class="divider" id="headerDivider">
        <div id="projectInfoDescription">Description Description</div>
        <div id="projectImageContainer" class="d-flex my-5 flex-column">
          <div id="projectsCarouselExampleControls" class="carousel slide" data-bs-ride="carousel">
            <ol class="carousel-indicators" id="projectCarouselIndicators">
            </ol>
            <div id="projectCarouselContent" class="carousel-inner">
              <!--Data is set inside here-->
            </div>
            <!--Bootstrap 5 uses data-bs instead of data-mdb -->
            <button id="projectCarouselLeft" class="carousel-control-prev" type="button"
              data-bs-target="#projectsCarouselExampleControls" data-bs-slide="prev" id="projectGalleryPrev">
              <span class="carousel-control-prev-icon"  ></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button id="projectCarouselRight" class="carousel-control-next" type="button"
              data-bs-target="#projectsCarouselExampleControls" data-bs-slide="next" id="projectGalleryNext">
              <span class="carousel-control-next-icon"  ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>`
    )

    $("#projectCarouselLeft").hide()
    $("#projectCarouselRight").hide()

    for (let x = 0; projectArray.length > x; x++) {

        $('#projectMiniColumn').append(`
        <div class="projectMini d-flex" id="project${x}">
        <div class="projectMiniPortraitContainer m-3">
          <!--Photos should be Square with slight border radius or circles-->
          <img
            src="${bucketLink + projectArray[x].projectSource}"
            height="90rem" width="90rem" id="projectImage">
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

        if (selectedProjectID && projectArray[x].projectID == selectedProjectID) {//Handles when nothing is selected
            generateSelectedProjectMiniColumn(x)
            generateSelectedProjectDescription(projectArray[x])
        }

        $('#project' + x).click(() => {
            selectedProjectID = projectArray[x].projectID

            generateSelectedProjectMiniColumn(x)
            generateSelectedProjectDescription(projectArray[x])
            //Handles animating in the content
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

            $(`#projectInfoContainer`).html(`
            <div class="spinner-grow text-muted mx-auto my-5"></div>
            `)
            break;
        case "timelineTab":
            $(`#timelineRow`).html(`<div id="timelineSpinner" class="spinner-grow text-muted mx-auto my-5"></div>`)
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

function generateCursorPointerAndClickEvent(type) {
    let returnStyle;
    if (type == "project") {
        return "cursor:pointer"
    }

    return returnStyle
}

function generateTimeline(timelineArray) {

    // $(".apland-timeline-area").empty()
    $(`#timelineRow`).html(`<div class="col-12">
    <!-- Timeline Area-->
    <div class="apland-timeline-area">
      <!-- Single Timeline Content-->
    </div>
  </div>`)
    timelineArray = timelineArray.sort((a, b) => b.year - a.year)
    for (let x = 0; timelineArray.length > x; x++) {
        $(".apland-timeline-area").append(
            `<div class="single-timeline-area">
                      <div class="timeline-date wow fadeInLeft" data-wow-delay="0.1s" style="visibility: visible; animation-delay: 0.1s; animation-name: fadeInLeft;">
                          <p>${timelineArray[x].year}</p>
                      </div>
                <div class="row" id="timelineYear${timelineArray[x].year}">
                    
                </div>
            </div>`)
        for (let y = 0; timelineArray[x].events.length > y; y++) {
            $("#timelineYear" + timelineArray[x].year).append(
                `<div class="col-12 col-md-6 col-lg-4">
                     <div id="event${x}${y}" class="single-timeline-content d-flex wow fadeInLeft" data-wow-delay="0.3s" style="visibility: visible; animation-delay: 0.3s; animation-name: fadeInLeft; ${generateCursorPointerAndClickEvent(timelineArray[x].events[y].type)};">
                       <div class="timeline-icon" style="background-color:${generateCardIconColor(timelineArray[x].events[y].type)}">
                       <i class="fa fa-briefcase" aria-hidden="true"></i>
                        </div>
                         <div class="timeline-text">
                           <h6>${timelineArray[x].events[y].title}</h6>
                           <p class="timelineDescription">${timelineArray[x].events[y].description}</p>
                        </div>
                    </div>
                </div>`
            )
            if (timelineArray[x].events[y].type == "project" && timelineArray[x].events[y].projectID) {
                $(`#event${x}${y}`).click(() => {
                    $('.navbar-nav li a').trigger("click")//How does this take me to projects? I dont know but im not changing the code
                    selectedProjectID = timelineArray[x].events[y].projectID
                })
            }
        }
        $("#timelineYear" + timelineArray[x].year).append(
            `<hr class="timelineDivider divider mx-auto my-2"></hr>`
        )
    }
}

//Admin Page
function generateAdminPagination(pageArray) {//Move this to the under the database scope belowg jyf
    let paginationHTML = ``

    for (var x = 0; pageArray.length > x; x++) {
        let uncapString = (pageArray[x].slice(0, pageArray[x].length - 4))
        paginationHTML += `<li class="page-item inactive" id="${uncapString}Btn"><a class="text-center page-link" href="#">${uncapString.charAt(0).toUpperCase() + uncapString.slice(1)}</a></li>`
    }

    $("#paginationList").html(paginationHTML)

}

function generateAdminPage(pageObject, pageTitle) {

    function generateAdminSkillCategory(skillCategoryObject) {

        let skillKeyArray = Object.keys(skillCategoryObject)

        function generateAdminSkill(skillObject, adminSkillName) {

            for (let x = 0; skillObject.length > x; x++) {

                $("#skillTableBody" + adminSkillName).append(`
                <tr id="${adminSkillName + x}">
                    <td><input class="form-control skillName" type='text' value="${skillObject[x].skillTitle}"></td>
                    <td><input class="form-control skillProficiency" type='text' value="${skillObject[x].skillProficiency}"></td>
                    <td class="align-middle">
                        <button type="button" class="addBtn" id="adminSkillDelete${adminSkillName + x}">
                            <span>&times;</span>
                        </button>
                    </td>
                </tr>`)

                $("#adminSkillDelete" + adminSkillName + x).click(() => {

                    $("#" + adminSkillName + x).remove()
                })

            }

            $("#skillTableBody" + adminSkillName).append(`
            <tr id="adminSkillAddRow${adminSkillName}">
                <td>
                    <button type="button" class="addBtn" id="adminSkillAdd${adminSkillName}">
                    <span>+</span>
                    </button>
                </td>
            </tr>`)

            $("#adminSkillAdd" + adminSkillName).click(() => {
                let randomNumber = generateRandomNumber(skillObject.length, 10000000)//Probability of choosing same number is low, but gets higher if spammed

                //Probablity of same 2 random numbers out of 1000 runs
                //1 - 10000000!/(10000000^1000)(10000000-1000)! = roughly 4%, give or take
                //

                $(`<tr id="${adminSkillName + randomNumber}">
                    <td><input class="form-control skillName" type="text"></td>
                    <td><input class="form-control skillProficiency" type="text"></td>
                    <td class="align-middle">
                        <button type="button" class="closeBtn" id="adminSkillDelete${adminSkillName + randomNumber}">
                            <span>×</span>
                        </button>
                    </td>
                </tr>
                `).insertBefore($(`#adminSkillAddRow${adminSkillName}`))

                $("#adminSkillDelete" + adminSkillName + randomNumber).click(() => {
                    $("#" + adminSkillName + randomNumber).remove()
                })
            })
        }

        $("#skillTable").append(`
            <thead id="skillHeader">
                <tr>
                    <th scope="col">Skill Name</th>
                    <th scope="col">Skill Proficiency</th>
                </tr>
            </thead>`)

        for (let x = 0; x < skillKeyArray.length; x++) {

            let skillCategoryNameNoSpace = skillKeyArray[x].replace(/ /g, '')

            if (skillKeyArray.length - 1 == x) {
                $("#skillTable").append(`
                <thead id="skillTableHeader${skillCategoryNameNoSpace}">
                <tr>
                    <th class="skillTableHeader">${skillKeyArray[x]}</th>
                    <th>
                        <button type="button" class="closeBtn" id="adminSkillCategoryDelete${skillCategoryNameNoSpace}">
                            <span>&times;</span>
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody id="skillTableBody${skillCategoryNameNoSpace}">

                </tbody>
                <tbody id="addSkillCategoryContainer">
                    <tr>
                        <td><input class="form-control" id="skillCategoryName" type='text'></td>
                        <td class="align-middle">
                            <button type="button" id="addSkillCategory" class="addBtn" >
                                <span>+</span>
                            </button>
                        </td>
                    </tr>
                </tbody>`)

                $(`#addSkillCategory`).click(() => {

                    let skillCategoryName = $(`#skillCategoryName`).val()

                    let skillCategoryNameNoSpace = skillCategoryName.replace(/ /g, '')


                    $(`<thead id="skillTableHeader${skillCategoryNameNoSpace}">
                    <tr>
                        <th class="skillTableHeader">${skillCategoryName}</th>
                        <th>
                            <button type="button" class="closeBtn" id="adminSkillCategoryDelete${skillCategoryNameNoSpace}">
                                <span>&times;</span>
                            </button>
                        </th>
                    </tr>
                    </thead>
                    <tbody id="skillTableBody${skillCategoryNameNoSpace}">

                    </tbody>`).insertBefore($(`#addSkillCategoryContainer`))

                    $(`#skillCategoryName`).val(" ")

                    generateAdminSkill([], skillCategoryNameNoSpace)

                    $(`#adminSkillCategoryDelete${skillCategoryNameNoSpace}`).click(() => {
                        $(`#skillTableHeader${skillCategoryNameNoSpace}`).remove()
                        $(`#skillTableBody${skillCategoryNameNoSpace}`).remove()
                    })
                })

            } else {
                $("#skillTable").append(`
                <thead id="skillTableHeader${skillCategoryNameNoSpace}">
                <tr>
                    <th class="skillTableHeader">${skillKeyArray[x]}</th>
                    <th>
                        <button type="button" class="closeBtn" id="adminSkillCategoryDelete${skillCategoryNameNoSpace}">
                            <span>&times;</span>
                        </button>
                    </th>
                </tr>
                </thead>
                <tbody id="skillTableBody${skillCategoryNameNoSpace}">

                </tbody>`)
            }


            $(`#adminSkillCategoryDelete${skillCategoryNameNoSpace}`).click(() => {
                $(`#skillTableHeader${skillCategoryNameNoSpace}`).remove()
                $(`#skillTableBody${skillCategoryNameNoSpace}`).remove()
            })
            //remove spaces as id doesnt parse spaces properly
            generateAdminSkill(skillCategoryObject[skillKeyArray[x]], skillCategoryNameNoSpace)
        }

    }

    function generateImageArray(imageArray, containerDiv) {
        if (imageArray) {
            for (let x = 0; imageArray.length > x; x++) {
                containerDiv.append(`
                <div class="d-flex me-3 adminImageCarouselItem" id="adminImageCarousel${x}">
                <div class="d-flex flex-column adminImageItem">
                     <img class="adminCarouselPicture" src="${bucketLink + imageArray[x].imageSource}"/>
                     <input accept="image/*" type='file' class="adminCarouselPictureInput imageArrayFormControl" onchange="$('#${containerDiv.attr('id')} #adminImageCarousel${x} .adminImageItem .adminCarouselPicture').attr('src',window.URL.createObjectURL(this.files[0]))" />
                </div>
                    <div class="d-flex flex-column adminImageItem">
                        <input type="text" class="imageArrayFormControl adminImageTitle" value="${imageArray[x].imageTitle}"/>
                        <textarea class="imageArrayFormControl textArea adminImageSubTitle">${imageArray[x].imageSubTitle}</textarea>
                </div>
                    <button type="button" class="closeBtn adminImageCarouselDelete" >
                    <span>&times;</span>
                </div>`)

                $(`#${containerDiv.attr('id')} #adminImageCarousel${x} .adminImageCarouselDelete`).click(() => {
                    $(`#${containerDiv.attr('id')} #adminImageCarousel${x}`).remove()
                })
            }
        }

        containerDiv.append(`
            <button type="button" class="addBtn" id="addNewImageIcon" >
                <span>+</span>
            </button>`)

        $(`#${containerDiv.attr('id')} #addNewImageIcon`).click(() => {
            let randomNumber = generateRandomNumber(imageArray ? imageArray.length : 1, 10000000);

            $(`<div class="d-flex me-3 adminImageCarouselItem" id="adminImageCarousel${randomNumber}">
            <div class="d-flex flex-column adminImageItem">
             <img class="adminCarouselPicture" src=""/>
            <input accept="image/*" type='file' class="adminCarouselPictureInput imageArrayFormControl" onchange="$('#${containerDiv.attr('id')} #adminImageCarousel${randomNumber} .adminImageItem .adminCarouselPicture').attr('src',window.URL.createObjectURL(this.files[0]))" />
            </div>
            <div class="d-flex flex-column adminImageItem">
                <input type="text" class="imageArrayFormControl adminImageTitle"/>
                <textarea class="imageArrayFormControl textArea adminImageSubTitle"></textarea>
                </div><button type="button" class="closeBtn adminImageCarouselDelete" >
                <span>&times;</span>
            </div>`).insertBefore($(`#${containerDiv.attr('id')} #addNewImageIcon`))

            console.log(containerDiv.attr('id'))

            $(`#${containerDiv.attr('id')} #adminImageCarousel${randomNumber} .adminImageCarouselDelete`).click(() => {
                $(`#${containerDiv.attr('id')} #adminImageCarousel${randomNumber}`).remove()
            })

        })
    }

    function generateProjectArray(projectArray) {
        for (let x = 0; projectArray.length > x; x++) {
            $(`#projectsContainer`).append(`        
            <div class="projectContainer d-flex flex-column px-5" id="adminProject${x}">
                <div class="d-flex justify-content-start">
                <img id="projectImage${x}" height="90rem" width="90rem" src="${bucketLink + projectArray[x].projectSource}">
                <input accept="image/*" type='file' class="imageArrayFormControl projectImageInput" onchange="document.getElementById('projectImage${x}').src = window.URL.createObjectURL(this.files[0])" />
                </div>
                <label>Title</label>
                <input type="text" class="form-control projectTitle" value="${projectArray[x].projectTitle}">

                <label>SubTitle</label>
                <input type="text" class="form-control projectSubTitle" value="${projectArray[x].projectSubTitle}">

                <label>Description</label>
                <textarea class="form-control textArea projectDescription">${projectArray[x].projectDescription}</textarea>
                <input type="hidden" class="projectID" value="${projectArray[x].projectID}">

                <label>Image Array</label>
                <div id="projectPictureArray${projectArray[x].projectID}" class="d-flex flex-row adminPictureArrayContainer">
                    
                </div>
                <div> <label>Link to Timeline?</label>
                <input class="form-check-input" type="checkbox" value="" id="linkProject"></div>
                <button type="button" class="closeBtn" id="adminProjectDelete${x}">
                <span>&times;</span>
                </button>
            </div>`)

            generateImageArray(projectArray[x].projectImageArray, $(`#projectPictureArray${projectArray[x].projectID}`))

            $(`#adminProjectDelete${x}`).click(() => {
                $(`#adminProject${x}`).remove()
            })
        }

        $(`#projectsContainer`).append(`
        <button type="button" class="me-3 addBtn" id="addNewProjectIcon" >
            <span>+</span>
        </button>`)

        $(`#addNewProjectIcon`).click(() => {
            let randomNumber = generateRandomNumber(projectArray.length, 10000000);

            $(`<div class="projectContainer d-flex flex-column px-5" id="adminProject${randomNumber}">
                <div class="d-flex justify-content-start">
                <img id="projectImage${randomNumber}" height="90rem" width="90rem" src="">
                <input accept="image/*" type='file' class="projectImageInput imageArrayFormControl" onchange="document.getElementById('projectImage${randomNumber}').src = window.URL.createObjectURL(this.files[0])" />
                </div>
                <label>Title</label>
                <input class="form-control projectTitle" type="text" >

                <label>SubTitle</label>
                <input class="form-control projectSubTitle" type="text" >

                <label>Description</label>
                <input class="form-control projectDescription" type="text" >
                <input type="hidden" class="projectID" value="${randomNumber}">

                <label>Image Array</label>
                <div id="projectPictureArray${randomNumber}" class="d-flex flex-row adminPictureArrayContainer">
                    
                </div>
                <div> <label>Link to Timeline?</label>
                <input class="form-check-input" type="checkbox" value="" id="linkProject"></div>
                <button type="button" class="closeBtn" id="adminProjectDelete${randomNumber}">
                <span>&times;</span>
                </button>
            </div>`).insertBefore($(`#addNewProjectIcon`))

            generateImageArray([], $(`#projectPictureArray${randomNumber}`))

            $(`#adminProjectDelete${randomNumber}`).click(() => {
                $(`#adminProject${randomNumber}`).remove()
            })

        })
    }

    function generateTimelineArray(timelineArray) {

        for (let x = 0; timelineArray.length > x; x++) {
            $("#timelineContainer").append(`
            <div id="timelineContainer${timelineArray[x].year}" class="timelineYearRow d-flex flex-row px-5 mt-3">
                <div class="d-flex justify-content-center timelineYear" id="timelineYearArray${timelineArray[x].year}">
                    <div class="timelineYear">
                        ${timelineArray[x].year}
                    </div>
                </div>
            </div>`)
            generateTimelineEvents(timelineArray[x])
        }

        $("#timelineContainer").append(`
        <input type="text" class="form-control" id="newYear">
        <button type="button" class="addBtn" id="addNewTimelineYear" >
            <span>+</span>
        </button>`)

        $(`#addNewTimelineYear`).click(() => {
            let newYear = $(`#newYear`).val()
            $(`<div id="timelineContainer${newYear}" class="timelineYearRow d-flex flex-row px-5 mt-3">
                <div class="d-flex justify-content-center timelineYear" id="timelineYearArray${newYear}">${newYear}</div>
            </div>`).insertBefore($('#newYear'))
            generateTimelineEvents({ year: newYear, events: [] })
            $(`#newYear`).val(" ")
        })
    }

    function generateTimelineEvents(timelineEventArray) {

        $(`#timelineYearArray${timelineEventArray.year}`).append(`
        <button type="button" class="closeBtn" id="adminDeleteTimelineEvent${timelineEventArray.year}" >
            <span>&times;</span>
        </button>`)

        $(`#adminDeleteTimelineEvent${timelineEventArray.year}`).click(() => {
            $(`#timelineContainer${timelineEventArray.year}`).remove()
        })
        if (timelineEventArray.events) {
            for (let x = 0; timelineEventArray.events.length > x; x++) {
                $(`#timelineYearArray${timelineEventArray.year}`).append(`
                <div class="timelineEvent d-flex flex-column ms-3" id="adminTimelineEvent${timelineEventArray.year}${x}">
                    <label>Title</label>
                    <input type="text" value="${timelineEventArray.events[x].title}" class="form-control eventTitle">
                    <label>Description</label>
                    <input type="text" value="${timelineEventArray.events[x].description}" class="form-control eventDescription">
                    <label>Type</label>
                    <select class="formSelect eventType" name="type">
                        <option value="project" ${timelineEventArray.events[x].type == "project" ? "Selected" : ""}>Project</option>
                        <option value="job" ${timelineEventArray.events[x].type == "job" ? "Selected" : ""}>Job</option>
                    </select>
                    <button type="button" class="closeBtn" id="adminTimelineEventDelete${timelineEventArray.year}${x}">
                        <span>&times;</span>
                    </button>
                </div>`)//Hard code type(Project/Job)

                $(`#adminTimelineEventDelete${timelineEventArray.year}${x}`).click(() => {
                    $(`#adminTimelineEvent${timelineEventArray.year}${x}`).remove()
                })
            }
        }

        $(`#timelineContainer${timelineEventArray.year}`).append(`
        <button type="button" class="addBtn" id="addNewTimelineEvent${timelineEventArray.year}" >
            <span>+</span>
        </button>`)

        $(`#addNewTimelineEvent${timelineEventArray.year}`).click(() => {
            let randomNumber = generateRandomNumber(timelineEventArray.events.length ? timelineEventArray.events.length : 0, 10000000);
            $(`#timelineYearArray${timelineEventArray.year}`).append(`
            <div class="timelineEvent d-flex flex-column ms-3" id="adminTimelineEvent${timelineEventArray.year}${randomNumber}">
            <label>Title</label>
            <input type="text" class="form-control eventTitle">
            <label>Description</label>
            <input type="text" class="form-control eventDescription">
            <label>Type</label>
            <select class="formSelect eventType" name="type">
                <option value="project">Project</option>
                <option value="job">Job</option>
            </select>
            <button type="button" class="closeBtn" id="adminTimelineEventDelete${timelineEventArray.year}${randomNumber}">
            <span>&times;</span>
            </button>
            </div> 
            `)

            $(`#adminTimelineEventDelete${timelineEventArray.year}${randomNumber}`).click(() => {
                $(`#adminTimelineEvent${timelineEventArray.year}${randomNumber}`).remove()
            })
        })
    }

    $(`#editContainer`).empty()
    switch (pageTitle) {
        case "me":
            $(`#editContainer`).append(`
        <div class="col-12 d-flex align-items-center justify-content-center">
            <img class="profilePicture" id="profilePicture" src="${bucketLink + pageObject.meImage}" alt="your image" />
            <input class="mx-2 imageArrayFormControl" accept="image/*" type='file' id="profileImageInput" onchange="document.getElementById('profilePicture').src = window.URL.createObjectURL(this.files[0])" />
          </div>
            <div class="mt-2">
          <label class="form-label">Description</label>
          <textarea class="form-control textArea" id="adminMeDescription">${pageObject.meDescription}</textarea>
        </div>
       
        <div class="mt-2">
          <label class="form-label">Image Carousel</label>
            <div id="mePictureArray" class="d-flex flex-row adminPictureArrayContainer">
            </div>
          </div>
        </div>
        <div class="mt-2">
          <label class="form-label">Skills</label>
          <table class="table" id="skillTable">

          </table>
        </div>
        <div class="mt-2">
            
        </div>
        <div class="row justify-content-center" id="submitAdminRow">
        <button type="submit" id="submitAdminDataBtn" class="btn btn-primary col-1 mb-1">Save</button>
        <div id="adminBtnSpinner" class="spinner-grow mx-auto text-muted my-5"></div>
    <div>`)
            generateAdminSkillCategory(pageObject.meSkillObject)
            generateImageArray(pageObject.meImageArray, $(`#mePictureArray`))
            $(`#adminBtnSpinner`).hide()

            $("#submitAdminDataBtn").click(() => {
                $("#submitAdminDataBtn").hide()
                $("#adminBtnSpinner").show()
                let postData = {}

                postData.meDescription = $(`#adminMeDescription`).val()//use html instead of val

                if ($("#profileImageInput").prop('files').length) {
                    uploadImage({
                        Bucket: `dongenpersonalwebsite`,
                        Key: $("#profileImageInput").prop('files')[0].name,
                        Body: $("#profileImageInput").prop('files')[0]
                    })
                    postData.meImage = $("#profileImageInput").prop('files')[0].name
                }

                postData.meImageArray = []

                $(`#mePictureArray .adminImageCarouselItem`).map(function (index, element) {
                    let imageObject = {}
                    if ($(`#mePictureArray #${this.id} .adminImageItem .adminCarouselPictureInput`).prop("files").length) {
                        uploadImage({
                            Bucket: `dongenpersonalwebsite`,
                            Key: $(`#mePictureArray #${this.id} .adminImageItem .adminCarouselPictureInput`).prop("files")[0].name,
                            Body: $(`#mePictureArray #${this.id} .adminImageItem .adminCarouselPictureInput`).prop("files")[0]
                        })
                        imageObject.imageSource = $(`#mePictureArray #${this.id} .adminImageItem .adminCarouselPictureInput`).prop("files")[0].name
                    } else {
                        imageObject.imageSource = ($(`#mePictureArray #${this.id} .adminImageItem .adminCarouselPicture`).attr("src")).replace(bucketLink, '')
                    }

                    imageObject.imageTitle = $(`#mePictureArray #${this.id} .adminImageItem .adminImageTitle`).val(),
                        imageObject.imageSubTitle = $(`#mePictureArray #${this.id} .adminImageItem .adminImageSubTitle`).val()

                    postData.meImageArray.push(imageObject)
                })

                postData.meSkillObject = {}

                //Possibly Combine with bottom
                $(`.skillTableHeader`).map(function () {
                    postData.meSkillObject[this.innerHTML] = [];

                    let HTMLNoSpace = this.innerHTML.replace(/ /g, '')

                    for (let y = 0; y < $(`#skillTableBody${HTMLNoSpace} tr`).length - 1; y++) {
                        let tableRowID = $(`#skillTableBody${HTMLNoSpace} tr`)[y].id

                        postData.meSkillObject[this.innerHTML][y] = {}
                        postData.meSkillObject[this.innerHTML][y].skillTitle = $(`#${tableRowID} .skillName`).val()
                        postData.meSkillObject[this.innerHTML][y].skillProficiency = $(`#${tableRowID} .skillProficiency`).val()
                    }
                })

                console.log(postData)

                update(child(database, "mePage"), postData).then(() => {
                    alert("Succesfully Saved")
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    $(`#adminBtnSpinner`).hide()
                    $("#submitAdminDataBtn").show()
                });
            })

            break;
        case "projects":
            $(`#editContainer`).append(`
            <div class="d-flex flex-row mt-2" id="projectsContainer">

            </div>
            <div class="row justify-content-center">
                <button type="submit" id="submitAdminDataBtn" class="btn btn-primary col-1 mb-1">Save</button>
                <div id="adminBtnSpinner" class="spinner-grow mx-auto text-muted my-5"></div>
            <div>`)
            generateProjectArray(pageObject.projectArray)
            $(`#adminBtnSpinner`).hide()

            $("#submitAdminDataBtn").click(() => {
                $("#submitAdminDataBtn").hide()
                $("#adminBtnSpinner").show()
                let postData = {}

                postData.projectArray = []

                $("#projectsContainer .projectContainer").map((index, element) => {
                    let projectObject = {}
                    let projectID = element.id

                    projectObject.projectDescription = $(`#projectsContainer #${projectID} .projectDescription`).val()
                    projectObject.projectTitle = $(`#projectsContainer #${projectID} .projectTitle`).val()
                    projectObject.projectSubTitle = $(`#projectsContainer #${projectID} .projectSubTitle`).val()
                    projectObject.projectID = $(`#projectsContainer #${projectID} .projectID`).val()

                    if ($(`#projectsContainer #${projectID} .projectImageInput`).prop("files").length) {
                        uploadImage({
                            Bucket: `dongenpersonalwebsite`,
                            Key: $(`#projectsContainer #${projectID} .projectImageInput`).prop("files")[0].name,
                            Body: $(`#projectsContainer #${projectID} .projectImageInput`).prop("files")[0]
                        })
                        projectObject.projectSource = $(`#projectsContainer #${projectID} .projectImageInput`).prop("files")[0].name
                    } else {
                        projectObject.projectSource = ($(`#projectsContainer #${projectID} #projectImage${projectID.replace("adminProject", "")}`).attr("src")).replace(bucketLink, '')
                    }

                    projectObject.projectImageArray = []
                    $(`#projectsContainer #${projectID} .adminImageCarouselItem`).map(function () {
                        let imageObject = {}

                        if ($(`#projectsContainer #${projectID} #${this.id} .adminImageItem .adminCarouselPictureInput`).prop("files").length) {
                            uploadImage({
                                Bucket: `dongenpersonalwebsite`,
                                Key: $(`#projectsContainer #${projectID} #${this.id} .adminImageItem .adminCarouselPictureInput`).prop("files")[0].name,
                                Body: $(`#projectsContainer #${projectID} #${this.id} .adminImageItem .adminCarouselPictureInput`).prop("files")[0]
                            })
                            imageObject.imageSource = $(`#projectsContainer #${projectID} #${this.id} .adminImageItem .adminCarouselPictureInput`).prop("files")[0].name
                        } else {
                            imageObject.imageSource = ($(`#projectsContainer #${projectID} #${this.id} .adminImageItem .adminCarouselPicture`).attr("src")).replace(bucketLink, '')
                        }

                        imageObject.imageTitle = $(`#projectsContainer #${projectID} #${this.id} .adminImageItem .adminImageTitle`).val(),
                            imageObject.imageSubTitle = $(`#projectsContainer #${projectID} #${this.id} .adminImageItem .adminImageSubTitle`).val()

                        projectObject.projectImageArray.push(imageObject)
                    })

                    postData.projectArray.push(projectObject)
                })

                update(child(database, "projectsPage"), postData).then(() => {
                    alert("Succesfully Saved")
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    $(`#adminBtnSpinner`).hide()
                    $("#submitAdminDataBtn").show()
                });
            })
            break;

        case "timeline":
            $(`#editContainer`).append(`
                <div class="d-flex flex-column mt-2" id="timelineContainer">

                </div>
                <div class="row justify-content-center">
                    <button type="submit" id="submitAdminDataBtn" class="btn btn-primary col-1 mb-1">Save</button>
                    <div id="adminBtnSpinner" class="spinner-grow mx-auto text-muted my-5"></div>
                <div>`)
            generateTimelineArray(pageObject.timelineArray)
            $(`#adminBtnSpinner`).hide()

            $("#submitAdminDataBtn").click(() => {
                $("#submitAdminDataBtn").hide()
                $("#adminBtnSpinner").show()

                let postData = {}
                postData.timelineArray = []

                $(`.timelineYear`).map(function () {
                    let newYear = {}
                    newYear.year = this.id.substring(17, 21)
                    newYear.events = []
                    for (let x = 0; x < $(`#timelineYearArray${newYear.year} .timelineEvent`).length; x++) {
                        let timelineEventID = $(`#timelineYearArray${newYear.year} .timelineEvent`)[x].id
                        newYear.events.push({
                            description: $(`#timelineYearArray${newYear.year} #${timelineEventID} .eventDescription`).val(),
                            // IF CHECKED ? : projectID:"",
                            title: $(`#timelineYearArray${newYear.year} #${timelineEventID} .eventTitle`).val(),
                            type: $(`#timelineYearArray${newYear.year} #${timelineEventID} .eventType`).val(),
                        })
                    }

                    postData.timelineArray.push(newYear)
                })
                console.log(postData)

                update(child(database, "timelinePage"), postData).then(() => {
                    alert("Succesfully Saved")
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    $(`#adminBtnSpinner`).hide()
                    $("#submitAdminDataBtn").show()
                });
            })
            break;
    }
}

$(document).ready(function () {

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
            ${(cssColorVariables[cssColorVariablesKeyArray[x]][checkbox.target.checked ? 1 : 0])}; `
        }
        $("html").attr("style", styleNavbarBackgroundString)
    });

    //===NavBar===
    get(child(database, "navbar")).then((snapshot) => {
        if (snapshot.exists()) {
            generateNavbarContactIcons(snapshot.val().navbarContactIconArray)

            $("#navbarToggler").click(() => {//Handles when navbar toggler is clicked, makes it so the contact icon isnt at the bottom
                $("#navbarContactIconContainer").remove()
                $(`<div class="mx-2 justify-content-start d-flex flex-row-reverses" id="navbarContactIconContainer"></div>`).insertAfter("#navbarToggler")
                generateNavbarContactIcons(snapshot.val().navbarContactIconArray)
            })

            $(window).resize(() => {
                //Handles after navbar toggler is clicked, makes contact icons go back to the original place
                if ($(window).width() >= 576 && $("#navbar").children().eq(3).attr("id") != "navbarContactIconContainer") {
                    $("#navbarContactIconContainer").remove()
                    $(`<div class="mx-2 justify-content-start d-flex flex-row-reverses" id="navbarContactIconContainer"></div>`).insertAfter("#navbarSupportedContent")
                    generateNavbarContactIcons(snapshot.val().navbarContactIconArray)
                }
            })
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
        if (clickedID.slice(0, clickedID.length - 4) == "meTab") {
            secretMeClickCounter++;
            if (secretMeClickCounter >= 5) {
                secretMeClickCounter = 0;
                //Do animating
                let password = prompt("Enter the secret password");
                if (password) {
                    fetch(backendServerURL + "/password", {
                        method: 'POST',
                        body: JSON.stringify({
                            "password": password
                        }),
                        headers: {
                            "Content-type": "application/json"
                        }
                    })
                        .then((result) => {
                            if (result.ok) {
                                return result.text()
                            } else {
                                switch (result.status) {
                                    case 401:
                                        throw new Error("Wrong Password")
                                        break;
                                    case 500:
                                        throw new Error("Server Error")
                                        break;
                                }
                            }
                        }).then((text) => {
                            if (text == "Success") {
                                $('.contentContainer').hide();
                                $('.divider').css({ width: '0%' })
                                $('#adminTabContent').fadeIn('slow')

                                get(database).then((snapshot) => {//Normal Startup
                                    let pageArray = (Object.keys(snapshot.val())).filter((item) => {
                                        return item.includes("Page")
                                    })
                                    //Always start with me page
                                    generateAdminPagination(pageArray)
                                    generateAdminPage(snapshot.val().mePage, "me")
                                    $("#meBtn").addClass(`active`)
                                    $("#meBtn").removeClass('inactive')

                                    $(".pagination li").click((x) => {
                                        if ($(x.currentTarget).hasClass('inactive')) {
                                            $(".pagination li").removeClass('active')
                                            $(".pagination li").addClass('inactive');

                                            $(x.currentTarget).addClass(`active`)
                                            $(x.currentTarget).removeClass('inactive')

                                            let clickedID = $(x.currentTarget).attr("id")
                                            console.log(clickedID.substring(0, clickedID.length - 3))
                                            get(child(database, clickedID.substring(0, clickedID.length - 3) + "Page")).then((snapshot) => {//Normal Startup
                                                console.log(snapshot.val(), clickedID.substring(0, clickedID.length - 3))
                                                generateAdminPage(snapshot.val(), clickedID.substring(0, clickedID.length - 3))
                                            })

                                        }
                                    })

                                })



                            } else {
                                throw new Error("Invalid Response")
                            }
                        }).catch((error) => {
                            alert(error)
                        })
                }
            }
        } else {
            secretMeClickCounter = 0;
        }
        if ($(this).hasClass('inactive')) {
            $('.navbar-nav li a').removeClass('active')
            $('.navbar-nav li a').addClass('inactive');

            $(this).addClass(`active`)
            $(this).removeClass('inactive')

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
                                generateMeCarouselImages(snapshot.val().meImageArray)
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
                                let projectArray = snapshot.val().projectArray
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
                                let timelineArray = snapshot.val().timelineArray
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

    $('.divider').css({ width: '0%' })
    $('#meTabContent').fadeIn('slow')
    $('#descDivider').animate({ width: "97%" }, 1000)
    $('#titleDivider').animate({ width: "40%" }, 1000)
    $('#softSkillDivider').animate({ width: "82%" }, 1000)

    //loading Information from mePage
    setTimeout(() => {
        get(child(database, "mePage")).then((snapshot) => {
            if (snapshot.exists()) {
                generateMeCarouselImages(snapshot.val().meImageArray)
                generateSkills(snapshot.val().meSkillObject)
                generatePersonalImage(snapshot.val().meImage)
                generateDescription(snapshot.val().meDescription)
            } else {
                throw new Error("Data does not exist!")
            }
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            $('.contentContainer').height($(window).height() - $(`.navbar`).height());
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