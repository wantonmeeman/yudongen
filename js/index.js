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
    footerBackgroundColor: ["#e3e3e3", "#292929"],
    footerContactIconBackgroundColor: ["#f0f0f0", "#292929"],
    carouselImageSubtitle: ['#d1d1d1', '#c8c8c8'],
    carouselImageTitle: ['#d1d1d1', '#c8c8c8'],
    carouselIndicators: ['#d1d1d1', '#c8c8c8'],
    carouselBackground: ['#999999', '#3d3d3d'],
    dividerColor: ['#000000', '#FFFFFF'],
    personalImageBorderColor: ["#7d7d7d", "#afafaf"],
    skillBarActiveColor: ["#7d7d7d", "#c3c3c3"],
    skillBarInactive: ["#e8e8e8", "#3a3a3a"],
    scrollBarThumbColor: ["#e0e0e0", "#424242"],
    scrollBarHoverColor: ["#d1d1d1", "#515151"],
    scrollBarTrackColor: ['#fcfcfc', '#030303'],
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


var greetingArrayIterable = 0;

/*Move these out of the global scope*/
var greetingArray = [
    "Hi there!",
    "你好",
    "नमस्ते",
    "Hai"
]

var selectedProjectID;

var selectedConceptIteration;

var conceptArray = [
    {
        conceptTitle: `Dijkstra's Algorithim`,
        conceptDescription:
            `This algorithim finds the shortest path between nodes in a graph.<br><br>

        This algorithim first calculates the distance between the current node and other nodes.<br>
        Then it checks this value to the value stored previously. If it is lesser, it replaces the value.<br>
        It will then move onto the next visited node.<br> This repeats until there are no non-visited nodes left.<br><br>

        This example has weighted non negative, non-directed paths and finds the shortest paths from source to all other nodes using arrays.<br>
        Thus the Time Complexity here is O(N^2), N = Nodes.<br>`,
    },
    {
        conceptTitle: `Bubble Sort`,
        conceptDescription: `This algorithim sorts values presented to it.<br><br>

        This algorithim compares the values of the first 2 elements, and if the current index's value is larger than next index's value, swaps them.<br>
        This repeats for the entire length of the values.<br>
        The algorithim then repeats until the values are sorted, then it makes a final pass to confirm that it is sorted.<br><br>

        Thus the Time Complexity here is O(N^2).<br>
        This is bad for a sorting algorithim, as it has to iterate over sorted values and has to make a pass to ensure everything is sorted at the end<br>
        We would normally use other more viable algorithims.`,
    },
    {
        conceptTitle: `Bucket Sort`,
        conceptDescription: `This algorithim sorts values presented to it.<br><br>
        This algorithim first sets up buckets to store values of a certain range. Currently, we use 20 buckets of range (MaxValue/20).<br>
        The algorithim will then iterate through the array and put each value into its corresponding bucket.<br>
        The buckets will then be sorted(Insertion Sort in this case, recursive or others can be used), and inserted back into the array in order.<br><br>

        Thus the Time Complexity here is O(N + (N^2)/k + k). Where k = 20(Number of buckets).<br><br>
        O(N => refers to the second sentence(Linear insertion)<br><br>
        (N^2)/k => refers to the third sentence(Insertion sort), where it is divided by the amount of buckets.<br><br>
        k) => refers to the insertion, as it inserts all the buckets back into the original array.<br><br>
        `
    },
    {
        conceptTitle: `Binary Search`,
        conceptDescription: `This algorithim searches for a value using sorted array of values presented to it.<br><br>
        This algorithim works by selecting the midpoint and checking whether the target value is greater or lower than the midpoint value.<br>
        If the value is greater, remove the lower half of the array.<br>
        If the value is lower, remove the upper half of the array.<br>
        Repeat the algorithim, until the midpoint is the value.<br><br>

        Thus the Time Complexity here is O(Log N).<br>
        This is because we remove half of the array every time we run the check, leading to increased performance.<br>
        This is can also be visualized on a binary tree format.
        `
    },
    {
        conceptTitle: `Linear Search`,
        conceptDescription: `This algorithim searches for a value, regardless of whether its sorted or not.<br><br>
        This algorithim works by creating a pointer, check whether the value the pointer lands on is equal to the target value<br>
        If the value is equal to the target value, end the search and return the target index/value.<br>
        Else, increment the value and repeat the process.<br>
        This happens until the value is found.<br><br>

        Thus the Time Complexity here is O(N).<br>
        This is because we use 1 only loop.<br>
        This search is the simplest to implement.
        `
    }
    
    // ,{
    //     conceptTitle: `Sieve of Eratosthenes`,
    //     conceptDescription: `This algorithim searches for a value, regardless of whether its sorted or not.<br><br>
    //     This algorithim works by creating a pointer, check whether the value the pointer lands on is equal to the target value<br>
    //     If the value is equal to the target value, end the search and return the target index/value.<br>
    //     Else, increment the value and repeat the process.<br>
    //     This happens until the value is found.<br><br>

    //     Thus the Time Complexity here is O(N).<br>
    //     This is because we use 1 only loop.<br>
    //     This search is the simplest to implement.
    //     `
    // }
]

var secretMeClickCounter = 0;

/*Concept Global Variables*/

var conceptAutoPlayInterval = null;

var conceptStage = 0;//true = show split, false = do cut

/*Concept Graph */

var graphUserDistance = []

var graphUserDistanceHistory = []//A nested array of distance history

var graphArrayPointer = -1;//This decides where we are at in the graph 0 = "A",0 starting node,-1 ready position, this also dictates what is conceptHighlightedBar

var graphNodeConnections = []//Nested Array, Index 1 = "A"

/*Concept Sort*/

var conceptSorted = false;

var conceptBarSwapped = false;

var conceptSortArray = []//this is used for both search and sort

var conceptHighlightedBarHigher = -1;

var conceptHighlightedBarLower = -1;

var conceptIterator = 0;

var conceptSpeed = 0;

var conceptArrayLength = 100

var conceptMinimumValue = 10

var conceptMaximumValue = 500

//Bucket Sort

var conceptSortBucketArray = []

var conceptSortBucketColourArray = []

/*Concept Search*/

var conceptTargetIndex = 0;

var conceptSearchStatus = false;

var conceptSortArrayStatus = [];

var conceptSearchIteration = 0;

var conceptArraySort = false;



async function uploadImage(uploadObject) {
    await s3.send(new PutObjectCommand(uploadObject));
}

function generateRandomNumber(bottom, top) {
    return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
}

function generateRandomRGBArray() {
    let returnArr = [];

    for (let i = 0; i < 3; i++)
        returnArr.push(generateRandomNumber(0, 255));

    return returnArr
}

function generateRandomRGBArrays(length) {
    let returnArr = [];

    for (let x = 0; length > x; x++) {
        returnArr.push(generateRandomRGBArray())
    }

    return returnArr
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
        returnString += (proficiency > x ? `<div class="bar"></div>` : `<div class="inactivebar"></div>`)
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

function generateDescription1(description) {
    $("#meDescription1").html(description)
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
              <div class="skillTitle me-1">
                ${currentSkillObject[y].skillTitle}
              </div>
            </div>
              <div class="skillBar d-flex justify-content-start align-items-center">
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
            if (projectObject.projectImageArray) {
                $(`#projectsCarouselExampleControls`).show()
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
            } else {
                $(`#projectsCarouselExampleControls`).hide()
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
        My Projects
        </div>
        <hr class="divider" id="headerDivider">
        <div id="projectInfoDescription">All my Projects that I personally think are good enough and impactful enough to display are shown on the left in no particular order.</div>
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
            <div id="rightSkillSpinner" class="spinner-grow text-muted mx-auto my-5"></div>
            `)
            $("#meDescription").html(`
            <div class="row mx-5">
                <div id="leftDescriptionSpinner" class="spinner-grow text-muted my-5 mx-auto"></div>
            </div>
            `)
            $("#meDescription1").html(`
            <div class="row mx-5">
                <div id="leftDescriptionSpinner" class="spinner-grow text-muted my-5 mx-auto"></div>
            </div>
            `)
            //$("#personalImage").attr("src", `https://media0.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif`)
            break;
        case "projectsTab":
            $(`#projectMiniColumn`).html(`
            <div id="projectMiniColumnSpinner" class="spinner-grow text-muted my-5 mx-auto"></div>
            `)

            $(`#projectInfoContainer`).html(`
            <div id="projectInfoSpinner" class="spinner-grow text-muted mx-auto my-5"></div>
            `)
            break;
        case "timelineTab":
            $(`#timelineRow`).html(`<div id="timelineSpinner" class="spinner-grow text-muted mx-auto my-5"></div>`)
            break;
        case "conceptsTab":
            $(`#conceptColumn`).html(`<div id="conceptColumnSpinner" class="spinner-grow text-muted my-5 mx-auto"></div>`)

            $(`#conceptCenterContainer`).html(`<div id="conceptAnimationSpinner" class="spinner-grow text-muted mx-auto my-5"></div>`)

            $(`#conceptDescriptionColumn`).html(`<div id="conceptDescriptionSpinner" class="spinner-grow text-muted my-5 mx-auto"></div>`)

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
    console.log(timelineArray)

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
                    $('.navbar-nav li').children().eq(2).trigger("click")
                    selectedProjectID = timelineArray[x].events[y].projectID
                })
            }
        }
        $("#timelineYear" + timelineArray[x].year).append(
            `<hr class="timelineDivider divider mx-auto my-2"></hr>`
        )
    }
}

/*Concept Functions*/

function generateConcepts() {//Called everytime header is clicked on

    $(`#conceptColumnSpinner`).hide()
    $(`#conceptAnimationSpinner`).hide()
    $(`#conceptDescriptionSpinner`).hide()

    for (let x = 0; conceptArray.length > x; x++) {
        $('#conceptColumn').append(`
            <div class="conceptMini d-flex" id="concept${x}">
            <div class="textContainer my-3 ms-3">
                    <div class="conceptMiniTitle">
                    ${conceptArray[x].conceptTitle}
                    </div>
                </div>
            </div>`)

        if (selectedConceptIteration && x == selectedConceptIteration) {//Handles when nothing is selected

            generateSelectedConceptColumn(x)
            generateSelectedConcept(x)
            generateSelectedConceptDescription(x)
        }

        $('#concept' + x).click(() => {
            selectedConceptIteration = x

            generateSelectedConceptColumn(x)
            generateSelectedConcept(x)
            generateSelectedConceptDescription(x)
        })
    }

}

function generateSelectedConceptColumn(x) {
    $('.conceptMini').removeClass("active")
    $('#concept' + x).addClass("active")
}

function generateSelectedConceptDescription(x) {
    switch (x) {
        case 0:
            $("#conceptDescriptionColumn").html(`
        <div id="conceptTextDescription" class="bg-danger d-flex flex-column h-100 h-xxl-50 w-100">
            <div id="conceptDescriptionHeader" class="text-center mt-2">
                ${conceptArray[x].conceptTitle}        
            </div>
            <hr class="divider" style="margin-left: 0.75rem;">
            <div id="conceptDescriptionDescription" class="m-3 mt-0">
                ${conceptArray[x].conceptDescription}   
            </div>
        </div>
        <div id="conceptGrid" class="bg-warning h-xxl-50 h-100 w-100" >
            ${generateUserDistance(graphUserDistance)}
        </div>
        `)
            break;
        case 1:
            $("#conceptDescriptionColumn").html(`
            <div id="conceptTextDescription" class="bg-danger d-flex flex-column h-100 h-xxl-50 w-100">
                <div id="conceptDescriptionHeader" class="text-center mt-2">
                    ${conceptArray[x].conceptTitle}        
                </div>
                <hr class="divider" style="margin-left: 0.75rem;">
                <div id="conceptDescriptionDescription" class="m-3 mt-0">
                    ${conceptArray[x].conceptDescription}   
                </div>
            </div>
            <div id="conceptVariables" class="bg-warning h-100 h-xxl-50 w-100">
                <div class="rangeContainer m-2 d-flex flex-column justify-content-center">
                    <label class="form-label text-center">Array Length</label>
                    <input type="range" class="form-range" min="10" max="500" id="conceptArrayLengthSlider" step="10" value="${conceptArrayLength}"/>
                    <div class="wrapper">
                    <div class="valueWrapperTriangle">
                    
                    </div>
                    <div class="valueWrapper text-center">
                        <span id="conceptArrayLengthDisplay">
                        
                        </span>
                    </div>
                </div>
                </div>            
                <div class="rangeContainer m-2 d-flex flex-column justify-content-center">
                    <label class="form-label text-center" >Maximum Value</label>
                    <input type="range" class="form-range" min="10" max="500" id="conceptMaximumValueSlider" step="10" value="${conceptMaximumValue}"/>
                </div>
                <div class="rangeContainer m-2 d-flex flex-column justify-content-center">
                    <label class="form-label text-center" >Minimum Value</label>
                    <input type="range" class="form-range" min="10" max="500" id="conceptMinimumValueSlider" step="10" value="${conceptMinimumValue}" on/>
                    <div class="wrapper">
                    <div class="valueWrapperTriangle">
                    
                    </div>
                    <div class="valueWrapper text-center">
                        <span id="conceptArrayMinimumValueDisplay">
                        
                        </span>
                        <span> &dash; </span>
                        <span id="conceptArrayMaximumValueDisplay">
    
                        </span>
                    </div>
                </div>
            `)

            $('#conceptArrayLengthDisplay').html($(`#conceptArrayLengthSlider`).val())
            $('#conceptArrayMaximumValueDisplay').html($(`#conceptMaximumValueSlider`).val())
            $('#conceptArrayMinimumValueDisplay').html($(`#conceptMinimumValueSlider`).val())

            $('#conceptArrayLengthSlider').on('input', () => {
                $('#conceptArrayLengthDisplay').html($(`#conceptArrayLengthSlider`).val())
            });

            $('#conceptMaximumValueSlider').on('input', () => {
                $('#conceptArrayMaximumValueDisplay').html($(`#conceptMaximumValueSlider`).val())
            });

            $('#conceptMinimumValueSlider').on('input', () => {
                $('#conceptArrayMinimumValueDisplay').html($(`#conceptMinimumValueSlider`).val())
            });
            break;
        case 2:
            $("#conceptDescriptionColumn").html(`
                <div id="conceptTextDescription" class="bg-danger d-flex flex-column h-100 h-xxl-50 w-100">
                    <div id="conceptDescriptionHeader" class="text-center mt-2">
                        ${conceptArray[x].conceptTitle}        
                    </div>
                    <hr class="divider" style="margin-left: 0.75rem;">
                    <div id="conceptDescriptionDescription" class="m-3 mt-0">
                        ${conceptArray[x].conceptDescription}   
                    </div>
                </div>
                <div id="conceptVariables" class="bg-warning h-100 h-xxl-50 w-100">
                    <div class="rangeContainer m-2 d-flex flex-column justify-content-center">
                        <label class="form-label text-center">Array Length</label>
                        <input type="range" class="form-range" min="10" max="500" id="conceptArrayLengthSlider" step="10" value="${conceptArrayLength}"/>
                        <div class="wrapper">
                        <div class="valueWrapperTriangle">
                        
                        </div>
                        <div class="valueWrapper text-center">
                            <span id="conceptArrayLengthDisplay">
                            
                            </span>
                        </div>
                    </div>
                    </div>            
                    <div class="rangeContainer m-2 d-flex flex-column justify-content-center">
                        <label class="form-label text-center" >Maximum Value</label>
                        <input type="range" class="form-range" min="10" max="500" id="conceptMaximumValueSlider" step="10" value="${conceptMaximumValue}"/>
                    </div>
                    <div class="rangeContainer m-2 d-flex flex-column justify-content-center">
                        <label class="form-label text-center" >Minimum Value</label>
                        <input type="range" class="form-range" min="10" max="500" id="conceptMinimumValueSlider" step="10" value="${conceptMinimumValue}" on/>
                        <div class="wrapper">
                        <div class="valueWrapperTriangle">
                        
                        </div>
                        <div class="valueWrapper text-center">
                            <span id="conceptArrayMinimumValueDisplay">
                            
                            </span>
                            <span> &dash; </span>
                            <span id="conceptArrayMaximumValueDisplay">
        
                            </span>
                        </div>
                    </div>
                `)

            $('#conceptArrayLengthDisplay').html($(`#conceptArrayLengthSlider`).val())
            $('#conceptArrayMaximumValueDisplay').html($(`#conceptMaximumValueSlider`).val())
            $('#conceptArrayMinimumValueDisplay').html($(`#conceptMinimumValueSlider`).val())

            $('#conceptArrayLengthSlider').on('input', () => {
                $('#conceptArrayLengthDisplay').html($(`#conceptArrayLengthSlider`).val())
            });

            $('#conceptMaximumValueSlider').on('input', () => {
                $('#conceptArrayMaximumValueDisplay').html($(`#conceptMaximumValueSlider`).val())
            });

            $('#conceptMinimumValueSlider').on('input', () => {
                $('#conceptArrayMinimumValueDisplay').html($(`#conceptMinimumValueSlider`).val())
            });
            break;
        case 3:
            $("#conceptDescriptionColumn").html(`
        <div id="conceptTextDescription" class="bg-danger d-flex flex-column h-100 h-xxl-50 w-100">
            <div id="conceptDescriptionHeader" class="text-center mt-2">
                ${conceptArray[x].conceptTitle}        
            </div>
            <hr class="divider" style="margin-left: 0.75rem;">
            <div id="conceptDescriptionDescription" class="m-3 mt-0">
                ${conceptArray[x].conceptDescription}   
            </div>
        </div>
        <div id="conceptVariables" class="bg-warning h-100 h-xxl-50 w-100">
            <div class="rangeContainer m-2 d-flex flex-column justify-content-center">
                <label class="form-label text-center">Array Length</label>
                <input type="range" class="form-range" min="10" max="500" id="conceptArrayLengthSlider" step="10" value="${conceptArrayLength}"/>
                <div class="wrapper">
                <div class="valueWrapperTriangle">
                
                </div>
                <div class="valueWrapper text-center">
                    <span id="conceptArrayLengthDisplay">
                    
                    </span>
                </div>
            </div>
            <div class="rangeContainer m-2 d-flex flex-column justify-content-center">
                <label class="form-label text-center">Target Number(Index)</label>
                <div class="wrapper">
                <div class="valueWrapperTriangle" id="targetNumberWrapperTriangle">
                
                </div>
                <div class="valueWrapper text-center" id="targetNumberWrapper">
                    <span id="conceptTargetDisplay">
                        ${conceptSortArray[conceptTargetIndex]}(${conceptTargetIndex})
                    </span>
                </div>
            </div>
        </div>           
        `)

            $('#conceptArrayLengthDisplay').html($(`#conceptArrayLengthSlider`).val())

            $('#conceptArrayLengthSlider').on('input', () => {
                $('#conceptArrayLengthDisplay').html($(`#conceptArrayLengthSlider`).val())
            });

            break;
        case 4:
            $("#conceptDescriptionColumn").html(`
        <div id="conceptTextDescription" class="bg-danger d-flex flex-column h-100 h-xxl-50 w-100">
            <div id="conceptDescriptionHeader" class="text-center mt-2">
                ${conceptArray[x].conceptTitle}        
            </div>
            <hr class="divider" style="margin-left: 0.75rem;">
            <div id="conceptDescriptionDescription" class="m-3 mt-0">
                ${conceptArray[x].conceptDescription}   
            </div>
        </div>
        <div id="conceptVariables" class="bg-warning h-100 h-xxl-50 w-100">
            <div class="rangeContainer m-2 d-flex flex-column justify-content-center">
                <label class="form-label text-center">Array Length</label>
                <input type="range" class="form-range" min="10" max="500" id="conceptArrayLengthSlider" step="10" value="${conceptArrayLength}"/>
                <div class="wrapper">
                <div class="valueWrapperTriangle">
                
                </div>
                <div class="valueWrapper text-center">
                    <span id="conceptArrayLengthDisplay">
                    
                    </span>
                </div>
            </div>
            <div class="rangeContainer m-2 d-flex justify-content-center">
                <label class="form-check-label" for="flexSwitchCheckDefault">Sorted Array?</label>
            </div>
            <div class="form-check form-switch rangeContainer d-flex justify-content-center">
                <input class="form-check-input" type="checkbox" id="switchSorted">
            </div>
            <div class="rangeContainer m-2 d-flex flex-column justify-content-center">
                <label class="form-label text-center">Target Number(Index)</label>
                <div class="wrapper">
                    <div class="valueWrapperTriangle" id="targetNumberWrapperTriangle">
                
                    </div>
                    <div class="valueWrapper text-center" id="targetNumberWrapper">
                        <span id="conceptTargetDisplay">
                            ${conceptSortArray[conceptTargetIndex]}(${conceptTargetIndex})
                        </span>
                    </div>
                </div>
                <label class="form-label text-center">Selected Number(Index)</label>
                <div class="wrapper">
                    <div class="valueWrapperTriangle" id="selectedNumberWrapperTriangle">
            
                    </div>
                    <div class="valueWrapper text-center" id="selectedNumberWrapper">
                        <span id="conceptSelectedDisplay">
                        <br>
                        </span>
                </div>
            </div>
        </div>           
        `)

            $(`#switchSorted`).prop("checked", conceptArraySort)

            $('#switchSorted').change(function () {
                conceptArraySort = this.checked
            });


            $('#conceptArrayLengthDisplay').html($(`#conceptArrayLengthSlider`).val())

            $('#conceptArrayLengthSlider').on('input', () => {
                $('#conceptArrayLengthDisplay').html($(`#conceptArrayLengthSlider`).val())
            });

            break;
        case 5:
            $("#conceptDescriptionColumn").html(`
            <div id="conceptTextDescription" class="bg-danger d-flex flex-column h-100 h-xxl-50 w-100">
                <div id="conceptDescriptionHeader" class="text-center mt-2">
                    ${conceptArray[x].conceptTitle}        
                </div>
                <hr class="divider" style="margin-left: 0.75rem;">
                <div id="conceptDescriptionDescription" class="m-3 mt-0">
                    ${conceptArray[x].conceptDescription}   
                </div>
            </div>
            <div id="conceptVariables" class="bg-warning h-100 h-xxl-50 w-100">

            </div>           
            `)

            $('#conceptArrayLengthDisplay').html($(`#conceptArrayLengthSlider`).val())

            $('#conceptArrayLengthSlider').on('input', () => {
                $('#conceptArrayLengthDisplay').html($(`#conceptArrayLengthSlider`).val())
            });

            break;
    }

}

function generateSelectedConcept(x) {

    //Shortest Path Algorithim

    clearInterval(conceptAutoPlayInterval)

    $("#conceptDescriptionColumn").height($("#conceptCenterContainer").height())

    $(window).unbind(`resize`)

    switch (x) {
        case 0://Dijkstra
            //Generate User Graph States and Store into Array

            graphUserDistance = []
            graphUserDistanceHistory = []
            graphArrayPointer = -1

            let graphGridNodeState = generateNodeGraphGrid(12, 12, 0.075)//Nested Array, Stores were are nodes in state
            graphNodeConnections = generateNodeConnections(graphGridNodeState);//this needs to be a global variable

            $('#conceptCenterContainer').html(`
                    <div id="conceptAnimation" class="container d-flex col-lg-12 row flex-column">
                        ${renderConceptGrid(graphGridNodeState)}
                    <svg 
                    id="fullsvg" 
                    xmlns="http://www.w3.org/2000/svg">
                    </svg>   
                </div>
            </div>
            `)

            /*setting event*/

            $(window).resize(() => {
                renderLinesAndText();
            })

            renderLinesAndText();

            break;
        case 1:
            conceptSorted = false;

            conceptBarSwapped = false;

            conceptHighlightedBarHigher = -1;

            conceptHighlightedBarLower = -1;

            conceptIterator = 0;

            conceptSpeed = 0;

            conceptArrayLength = $(`#conceptArrayLengthSlider`).val() ? Number($(`#conceptArrayLengthSlider`).val()) : conceptArrayLength

            conceptMinimumValue = $(`#conceptMinimumValueSlider`).val() ? Number($(`#conceptMinimumValueSlider`).val()) : conceptMinimumValue

            conceptMaximumValue = $(`#conceptMaximumValueSlider`).val() ? Number($(`#conceptMaximumValueSlider`).val()) : conceptMaximumValue

            conceptSortArray = generateBarGraph(Number(conceptArrayLength), Number(conceptMinimumValue), Number(conceptMaximumValue))

            $('#conceptCenterContainer').html(`
            <div id="conceptAnimation" class="container d-flex col-lg-12 row flex-column">
                <div id="conceptBarContainer" class="d-flex align-items-end justify-content-center">
                </div>
            </div>
            `)

            renderConceptBinarySort(conceptSortArray)

            break;
        case 2:
            conceptSorted = false;

            conceptHighlightedBarHigher = -1;

            conceptHighlightedBarLower = -1;

            conceptArrayLength = $(`#conceptArrayLengthSlider`).val() ? Number($(`#conceptArrayLengthSlider`).val()) : conceptArrayLength

            conceptMinimumValue = $(`#conceptMinimumValueSlider`).val() ? Number($(`#conceptMinimumValueSlider`).val()) : conceptMinimumValue

            conceptMaximumValue = $(`#conceptMaximumValueSlider`).val() ? Number($(`#conceptMaximumValueSlider`).val()) : conceptMaximumValue

            conceptSortArray = generateBarGraph(Number(conceptArrayLength), Number(conceptMinimumValue), Number(conceptMaximumValue))

            conceptSortBucketArray = generateBuckets(20)

            conceptSortBucketColourArray = generateRandomRGBArrays(20)

            conceptStage = 1;

            $('#conceptCenterContainer').html(`
                <div id="conceptAnimation" class="container d-flex col-lg-12 row flex-column">
                    <div id="conceptBarContainer" class="d-flex align-items-end justify-content-center">
                    </div>
                </div>
                `)

            renderConceptBucketSort(conceptSortArray, conceptSortBucketColourArray, false)

            break;
        case 3:
            conceptSearchStatus = false;

            conceptArrayLength = $(`#conceptArrayLengthSlider`).val() ? Number($(`#conceptArrayLengthSlider`).val()) : conceptArrayLength //Reusing variables,what could go wrong? 

            conceptSortArray = generateBarGraph(Number(conceptArrayLength), 1, 500).sort((a, b) => { return a - b })

            conceptTargetIndex = generateRandomNumber(0, conceptArrayLength - 1)

            conceptSortArrayStatus = new Array(conceptSortArray.length).fill(0)

            conceptStage = 1;

            conceptSearchIteration = 0;

            $('#conceptCenterContainer').html(`
                <div id="conceptAnimation" class="container d-flex col-lg-12 row flex-column">
                    <div id="conceptBarContainer" class="d-flex align-items-end justify-content-center">
                    </div>
                </div>
                `)

            renderConceptBinarySearch(conceptSortArray, conceptSortArrayStatus, conceptTargetIndex, false)
            break;
        case 4:
            conceptSearchStatus = false;

            conceptArrayLength = $(`#conceptArrayLengthSlider`).val() ? Number($(`#conceptArrayLengthSlider`).val()) : conceptArrayLength //Reusing variables,what could go wrong? 

            conceptSortArray = conceptArraySort ? generateBarGraph(Number(conceptArrayLength), 1, 500).sort((a, b) => { return a - b }) : generateBarGraph(Number(conceptArrayLength), 1, 500)

            conceptTargetIndex = generateRandomNumber(0, conceptArrayLength - 1)

            conceptSearchIteration = -1;

            $('#conceptCenterContainer').html(`
                <div id="conceptAnimation" class="container d-flex col-lg-12 row flex-column">
                    <div id="conceptBarContainer" class="d-flex align-items-end justify-content-center">
                    </div>
                </div>
                `)

            $(`#switchSorted`).prop("checked", conceptArraySort)

            renderConceptLinearSearch(conceptSortArray, conceptTargetIndex, conceptSearchIteration)
            break;
        case 5:
            conceptArrayLength = $(`#conceptArrayLengthSlider`).val() ? Number($(`#conceptArrayLengthSlider`).val()) : conceptArrayLength //Reusing variables,what could go wrong? 

            conceptSortArray = generateSequentialBarGraph(Number(conceptArrayLength), 1, 500)

            $('#conceptCenterContainer').html(`
                <div id="conceptAnimation" class="container d-flex col-lg-12 row flex-column">
                    <div id="conceptBarContainer" class="d-flex align-items-end justify-content-center">
                    </div>
                </div>
                `)

            $(`#switchSorted`).prop("checked", conceptArraySort)

            renderConceptLinearSearch(conceptSortArray, conceptTargetIndex, conceptSearchIteration)
            break;
    }


    //Universal accross all demonstrations
    setConceptControlsListeners(x)
    generateSelectedConceptDescription(x)
}

function setConceptControlsListeners(x) {
    switch (x) {
        case 0:

            $("#conceptAnimation").append(`
            <div class="conceptSettingContainer d-flex flex-row justify-content-around my-2">
                <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="goBack">
                    <img src="../icons/next.png" class="conceptSettingIcon">
                </div> 
                <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="resetEverything">
                    <img src="../icons/reset.svg" class="conceptSettingIcon">
                </div> 
                <div class="settingBtn bg-danger d-flex justify-content-center align-items-center" id="toggleAutoPlay">
                    <img src="../icons/play.svg" class="conceptSettingIcon">
                </div> 
                <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="toggleGrid">
                    <img src="../icons/grid.svg" class="conceptSettingIcon">
                </div>
                <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="goNext">
                    <img src="../icons/next.png" class="conceptSettingIcon">
                </div>
            </div>`)

            $("#goNext").click(() => {
                if (graphArrayPointer != graphNodeConnections.length - 1) {
                    graphArrayPointer++;
                    nextDijkstraStep()
                    renderLinesAndText()
                    renderNodeHighlight(String.fromCharCode("A".charCodeAt(0) + graphArrayPointer))
                }
            })

            $("#goBack").click(() => {
                if (graphArrayPointer != -1) {
                    unRenderNodeHighlight(String.fromCharCode("A".charCodeAt(0) + graphArrayPointer))//Will throw an error.
                    lastDijkstraStep()
                    graphArrayPointer--;

                    renderLinesAndText()
                }
            })

            $("#toggleAutoPlay").click(() => {
                if ($("#toggleAutoPlay").children().attr("src") == `../icons/play.svg`) {
                    $("#toggleAutoPlay").children().attr("src", `../icons/pause.svg`)
                    conceptAutoPlayInterval = setInterval(() => {
                        if (graphArrayPointer != graphNodeConnections.length - 1) {
                            graphArrayPointer++;
                            nextDijkstraStep()
                            renderLinesAndText()
                            renderNodeHighlight(String.fromCharCode("A".charCodeAt(0) + graphArrayPointer))
                        } else {
                            $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                            clearInterval(conceptAutoPlayInterval)
                        }
                    }, 2000)
                } else {
                    $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                    clearInterval(conceptAutoPlayInterval)
                }
                console.log(conceptAutoPlayInterval)
            })

            $("#toggleGrid").click(() => {
                if ($(".conceptNode").css("border-style") == "none")
                    $(".conceptNode").css("border-style", "solid")
                else
                    $(".conceptNode").css("border-style", "none")
            })

            $("#resetEverything").click(() => generateSelectedConcept(x))

            break;
        case 1:

            $("#conceptAnimation").append(`
            <div class="conceptSettingContainer d-flex flex-row justify-content-around my-2">
            <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="resetEverything">
                <img src="../icons/reset.svg" class="conceptSettingIcon">
            </div> 
            <div class="settingBtn bg-danger d-flex justify-content-center align-items-center" id="toggleAutoPlay">
                <img src="../icons/play.svg" class="conceptSettingIcon">
            </div> 
            <div class="settingBtn bg-danger d-flex justify-content-center align-items-center" id="toggleSpeed">
                <img src="../icons/speed1.svg" class="conceptSettingIcon">
            </div> 
            <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="goNext">
                <img src="../icons/next.png" class="conceptSettingIcon">
            </div>
        </div>`)

            $("#goNext").click(() => {
                if (conceptSorted) {
                    $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                    $(`#targetNumberWrapper`).css("background-color", "green")
                    $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                    clearInterval(conceptAutoPlayInterval)
                } else {
                    nextBubbleSortStep()
                    renderConceptBinarySort(conceptSortArray)
                }
            })

            $("#toggleAutoPlay").click(() => {
                if ($("#toggleAutoPlay").children().attr("src") == `../icons/play.svg`) {
                    $("#toggleAutoPlay").children().attr("src", `../icons/pause.svg`)
                    conceptAutoPlayInterval = setInterval(() => {
                        if (conceptSorted) {
                            $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                            clearInterval(conceptAutoPlayInterval)
                        } else {
                            nextBubbleSortStep()
                            renderConceptBinarySort(conceptSortArray)
                        }
                    }, 50)
                } else {
                    $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                    $(`#targetNumberWrapper`).css("background-color", "green")
                    $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                    clearInterval(conceptAutoPlayInterval)
                }
            })

            $("#toggleSpeed").click(() => {
                if ($("#toggleSpeed").children().attr("src") == `../icons/speed1.svg`) {
                    conceptSpeed = 1
                    conceptIterator = 0;//Set iteration back to start
                    $("#toggleSpeed").children().attr("src", `../icons/speed2.svg`)

                } else {
                    conceptSpeed = 0
                    $("#toggleSpeed").children().attr("src", `../icons/speed1.svg`)

                }
            })

            $("#resetEverything").click(() => generateSelectedConcept(x))

            break;
        case 2:
            $("#conceptAnimation").append(`
                <div class="conceptSettingContainer d-flex flex-row justify-content-around my-2">
                <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="resetEverything">
                    <img src="../icons/reset.svg" class="conceptSettingIcon">
                </div> 
                <div class="settingBtn bg-danger d-flex justify-content-center align-items-center" id="toggleAutoPlay">
                    <img src="../icons/play.svg" class="conceptSettingIcon">
                </div> 
                <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="goNext">
                    <img src="../icons/next.png" class="conceptSettingIcon">
                </div>
            </div>`)

            $("#goNext").click(() => {

                switch (conceptStage) {
                    case 1:
                        bucketSortScatter()
                        renderConceptBucketSort(conceptSortArray, true, conceptSortBucketColourArray)
                        conceptStage++;
                        break;
                    case 2:
                        bucketSortSort()
                        bucketSortGather()
                        renderConceptBucketSort(conceptSortArray, true, conceptSortBucketColourArray)
                        conceptStage++;
                        break;
                    case 3:
                        renderConceptBucketSort(conceptSortArray, false, conceptSortBucketColourArray)
                        clearInterval(conceptAutoPlayInterval)
                        conceptStage = 0;
                        conceptSorted = true;
                        break;
                }

            })

            $("#toggleAutoPlay").click(() => {
                if ($("#toggleAutoPlay").children().attr("src") == `../icons/play.svg`) {
                    $("#toggleAutoPlay").children().attr("src", `../icons/pause.svg`)
                    conceptAutoPlayInterval = setInterval(() => {
                        console.log(conceptStage)
                        switch (conceptStage) {
                            case 1:
                                bucketSortScatter()
                                renderConceptBucketSort(conceptSortArray, true, conceptSortBucketColourArray)
                                conceptStage++;
                                break;
                            case 2:
                                bucketSortSort()
                                bucketSortGather()
                                renderConceptBucketSort(conceptSortArray, true, conceptSortBucketColourArray)
                                conceptStage++;
                                break;
                            case 3:
                                renderConceptBucketSort(conceptSortArray, false, conceptSortBucketColourArray)
                                clearInterval(conceptAutoPlayInterval)
                                conceptStage = 1;
                                conceptSorted = true;
                                $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                                $(`#targetNumberWrapper`).css("background-color", "green")
                                $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                                clearInterval(conceptAutoPlayInterval)
                                break;
                        }
                    }, 500)
                } else {
                    $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                    clearInterval(conceptAutoPlayInterval)
                }
            })

            $("#resetEverything").click(() => generateSelectedConcept(x))

            break;
        case 3:
            $("#conceptAnimation").append(`
            <div class="conceptSettingContainer d-flex flex-row justify-content-around my-2">
            <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="resetEverything">
                <img src="../icons/reset.svg" class="conceptSettingIcon">
            </div> 
            <div class="settingBtn bg-danger d-flex justify-content-center align-items-center" id="toggleAutoPlay">
                <img src="../icons/play.svg" class="conceptSettingIcon">
            </div> 
            <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="goNext">
                <img src="../icons/next.png" class="conceptSettingIcon">
            </div>
        </div>`)

            $("#goNext").click(() => {
                console.log(conceptSearchStatus, conceptStage)
                if (conceptSearchStatus) {
                    $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                    $(`#targetNumberWrapper`).css("background-color", "green")
                    $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                    clearInterval(conceptAutoPlayInterval)
                } else {
                    let tempArray = returnModifiedArray()
                    switch (conceptStage) {
                        case 1:
                            renderConceptBinarySearch(conceptSortArray, conceptSortArrayStatus, conceptTargetIndex, returnTrueIndex(Math.floor(tempArray.length / 2)))
                            if (tempArray[Math.floor(tempArray.length / 2)] == conceptSortArray[conceptTargetIndex]) {
                                conceptSearchStatus = true;
                            }
                            conceptStage++;
                            break;

                        case 2:
                            nextBinarySearchStep(tempArray)
                            conceptSearchIteration++
                            renderConceptBinarySearch(conceptSortArray, conceptSortArrayStatus, conceptTargetIndex, false)
                            conceptStage = 1;
                            break;
                    }

                    if (conceptSearchStatus) {
                        $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                        $(`#targetNumberWrapper`).css("background-color", "green")
                        $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                        clearInterval(conceptAutoPlayInterval)
                    }

                }
            })

            $("#toggleAutoPlay").click(() => {
                if ($("#toggleAutoPlay").children().attr("src") == `../icons/play.svg`) {
                    $("#toggleAutoPlay").children().attr("src", `../icons/pause.svg`)
                    conceptAutoPlayInterval = setInterval(() => {
                        if (conceptSearchStatus) {
                            $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                            $(`#targetNumberWrapper`).css("background-color", "green")
                            $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                            clearInterval(conceptAutoPlayInterval)
                        } else {
                            let tempArray = returnModifiedArray()
                            switch (conceptStage) {
                                case 1:
                                    renderConceptBinarySearch(conceptSortArray, conceptSortArrayStatus, conceptTargetIndex, returnTrueIndex(Math.floor(tempArray.length / 2)))
                                    if (tempArray[Math.floor(tempArray.length / 2)] == conceptSortArray[conceptTargetIndex]) {
                                        conceptSearchStatus = true;
                                    }
                                    conceptStage++;
                                    break;

                                case 2:
                                    nextBinarySearchStep(tempArray)
                                    conceptSearchIteration++
                                    renderConceptBinarySearch(conceptSortArray, conceptSortArrayStatus, conceptTargetIndex, false)
                                    conceptStage = 1;
                                    break;
                            }

                            if (conceptSearchStatus) {
                                $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                                $(`#targetNumberWrapper`).css("background-color", "green")
                                $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                                clearInterval(conceptAutoPlayInterval)
                            }

                        }
                    }, 500)
                } else {
                    $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                    clearInterval(conceptAutoPlayInterval)
                }
            })

            $("#resetEverything").click(() => generateSelectedConcept(x))
            break;
        case 4://Linear Search
            $("#conceptAnimation").append(`
        <div class="conceptSettingContainer d-flex flex-row justify-content-around my-2">
        <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="resetEverything">
            <img src="../icons/reset.svg" class="conceptSettingIcon">
        </div> 
        <div class="settingBtn bg-danger d-flex justify-content-center align-items-center" id="toggleAutoPlay">
            <img src="../icons/play.svg" class="conceptSettingIcon">
        </div> 
        <div class="settingBtn bg-secondary d-flex justify-content-center align-items-center" id="goNext">
            <img src="../icons/next.png" class="conceptSettingIcon">
        </div>
    </div>`)

            $("#goNext").click(() => {
                console.log(conceptSearchStatus, conceptStage)
                if (conceptSearchStatus) {
                    $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                    $(`#targetNumberWrapper`).css("background-color", "green")
                    $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                    clearInterval(conceptAutoPlayInterval)
                } else {
                    nextLinearSearchStep()
                    if (conceptTargetIndex == conceptSearchIteration) {
                        conceptSearchStatus = true
                    }
                    renderConceptLinearSearch(conceptSortArray, conceptTargetIndex, conceptSearchIteration)
                }

                if (conceptSearchStatus) {
                    $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                    $(`#targetNumberWrapper`).css("background-color", "green")
                    $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                    clearInterval(conceptAutoPlayInterval)
                }


            })

            $("#toggleAutoPlay").click(() => {
                if ($("#toggleAutoPlay").children().attr("src") == `../icons/play.svg`) {
                    $("#toggleAutoPlay").children().attr("src", `../icons/pause.svg`)
                    conceptAutoPlayInterval = setInterval(() => {
                        if (conceptSearchStatus) {
                            $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                            $(`#targetNumberWrapper`).css("background-color", "green")
                            $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                            clearInterval(conceptAutoPlayInterval)
                        } else {
                            nextLinearSearchStep()
                            if (conceptTargetIndex == conceptSearchIteration) {
                                conceptSearchStatus = true
                            }
                            renderConceptLinearSearch(conceptSortArray, conceptTargetIndex, conceptSearchIteration)
                        }

                        if (conceptSearchStatus) {
                            $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                            $(`#targetNumberWrapper`).css("background-color", "green")
                            $(`#targetNumberWrapperTriangle`).css("border-bottom", "15px solid green")
                            clearInterval(conceptAutoPlayInterval)
                        }
                    }, 50)
                } else {
                    $("#toggleAutoPlay").children().attr("src", `../icons/play.svg`)
                    clearInterval(conceptAutoPlayInterval)
                }
            })

            $("#resetEverything").click(() => generateSelectedConcept(x))

            break;
    }
}

function generateNodeGraphGrid(x, y, chance) {
    let returnArray = []
    for (let a = 0; a < y; a++) {
        returnArray.push([])
        for (let b = 0; b < x; b++) {
            if ((returnArray[a - 1] && returnArray[a - 1][b]) || (returnArray[a] && returnArray[a][b - 1])) {
                returnArray[a].push(false)
            } else {
                let value = Math.random() < chance
                returnArray[a].push(value)
            }
        }
    }
    return returnArray
}

function generateNodeConnections(nodeGrid) {//This stores whether node A has a connection with B and its distance
    let returnArray = []
    let previousNodePointX = null;
    let previousNodePointY = null;

    let connectionPointer = 0;

    // Given n nodes,n*(n-1)/2 will be the amount of connections connected to every other node.
    for (var x = 0; x < nodeGrid.length; x++) {//Getting the Distance from A -> B first
        for (var y = 0; y < nodeGrid[x].length; y++) {
            if (nodeGrid[x][y]) {//Found a Node

                //Assumes the closest path to next Node        
                if (previousNodePointX != null && previousNodePointY != null) {

                    let distanceBetweenNode = Number(Math.sqrt((Math.abs(previousNodePointX - x) ** 2 + Math.abs(previousNodePointY - y) ** 2)).toFixed(0))

                    if (!returnArray[connectionPointer]) {
                        returnArray[connectionPointer] = []
                    }

                    returnArray[connectionPointer][connectionPointer + 1] = distanceBetweenNode

                    if (!returnArray[connectionPointer + 1]) {
                        returnArray[connectionPointer + 1] = []
                    }

                    returnArray[connectionPointer + 1][connectionPointer] = distanceBetweenNode
                    connectionPointer++;
                }

                previousNodePointX = x
                previousNodePointY = y
            }
        }
    }

    for (let x = 0; returnArray.length > x; x++) {//Fill in Blank Spaces in Array, use -2 as last element is not the largest

        if (Math.random() < 0.45) {//Generate Random Connection
            let randomEndNode = generateRandomNumber(1, x);
            if (!returnArray[x][randomEndNode] && !returnArray[randomEndNode][x] && x != randomEndNode) {//Both must not have anything, the end node cannot be the start node
                let randomConnectionWeight = generateRandomNumber(1, 7)
                returnArray[x][randomEndNode] = randomConnectionWeight//Generate a random number here too
                returnArray[randomEndNode][x] = randomConnectionWeight
            }
        }

        let concatArray = new Array(returnArray[returnArray.length - 2].length - returnArray[x].length).fill(null)//Get last Array's length
        returnArray[x] = returnArray[x].concat(concatArray)

        graphUserDistance[x] = 0
        graphUserDistanceHistory[x + 1] = []
    }

    graphUserDistanceHistory[0] = graphUserDistance.slice(0)
    return returnArray
}

function generateBarGraph(length, min, max) {
    if (min > max) {
        alert("Bar Graph Generation Error")
        return []
    } else {
        let returnArray = new Array(length)

        for (let x = 0; x < returnArray.length; x++) {
            returnArray[x] = generateRandomNumber(min, max)
        }
        return returnArray
    }

}

function generateSequentialBarGraph(length, min, max) {
    if (min > max) {
        alert("Bar Graph Generation Error")
        return []
    } else {
        let returnArray = new Array(length)

        for (let x = 0; x < returnArray.length; x++) {
            returnArray[x] = x++
        }

        return returnArray
    }
}

function generateBuckets(number) {
    let returnArr = []

    for (let x = 0; x < number; x++) {
        returnArr.push([])
    }

    return returnArr
}

function renderNodeHighlight(character) {
    $(`#conceptNode` + character).css("background-color", "red")
}

function unRenderNodeHighlight(character) {
    $(`#conceptNode` + character).css("background-color", "grey")
}

function renderConceptGrid(array) {

    let returnString = ``
    let totalNodes = 0;

    for (let x = 0; array.length > x; x++) {

        returnString += `<div class="conceptAnimationRow row justify-content-center flex-nowrap">`

        for (let y = 0; array[x].length > y; y++) {
            if (array[x][y]) {
                returnString += `
                <div class="conceptAnimationColumn col-1 d-flex justify-content-center ">
                    <div class="d-flex align-items-center justify-content-center conceptNode active" id="conceptNode${String.fromCharCode("A".charCodeAt(0) + totalNodes)}">
                        ${String.fromCharCode("A".charCodeAt(0) + totalNodes)}
                    </div>
                </div>`

                totalNodes++;
            } else {
                returnString += `
                <div class="conceptAnimationColumn col-1 d-flex justify-content-center ">
                    <div class="d-flex align-items-center justify-content-center conceptNode">
                    </div>
                </div>`
            }

        }

        returnString += `</div>`
    }

    return returnString
}

function renderConceptBinarySort(array) {
    let returnString = ``

    for (let x = 0; array.length > x; x++) {
        if (conceptHighlightedBarHigher == x) {
            returnString += `<div class="conceptBar conceptHighlightedBarHigher" style="height:${array[x]}px" ></div>`
        } else if (conceptHighlightedBarLower == x) {
            returnString += `<div class="conceptBar conceptHighlightedBarLower" style="height:${array[x]}px" ></div>`
        } else {
            returnString += `<div class="conceptBar" style="height:${array[x]}px" ></div>`
        }
    }

    $("#conceptBarContainer").html(returnString)
}

function renderConceptBinarySearch(array, statusArray, targetIndex, splitIndex) {
    let returnString = ``
    for (let x = 0; array.length > x; x++) {
        if (x == targetIndex) {
            returnString += `<div class="conceptBar conceptHighlightedTargetBar ${splitIndex !== false && splitIndex === x ? `conceptHighlightedSplitBar` : ``}" style="height:${array[x]}px" ></div>`
        } else if (statusArray[x] > 0) {
            returnString += `<div class="conceptBar conceptHighlightedUnusedBar ${splitIndex !== false && splitIndex === x ? `conceptHighlightedSplitBar` : ``}" style="height:${array[x]}px;opacity:${statusArray[x] / 10};" ></div>`
        } else {
            returnString += `<div class="conceptBar ${splitIndex !== false && splitIndex === x ? `conceptHighlightedSplitBar` : ``}" style="height:${array[x]}px" ></div>`
        }
    }

    $("#conceptBarContainer").html(returnString)
}

function renderConceptBucketSort(array, showColor, colourArray) {
    let returnString = ``

    if (showColor) {
        for (let x = 0; array.length > x; x++) {
            returnString += `<div class="conceptBar" style="height:${array[x]}px;background-color:rgb(${colourArray[Math.floor(array[x] / (conceptMaximumValue / 20))]})" ></div>`
        }
    } else {
        for (let x = 0; array.length > x; x++) {
            returnString += `<div class="conceptBar" style="height:${array[x]}px;" ></div>`
        }
    }


    $("#conceptBarContainer").html(returnString)
}

function renderConceptLinearSearch(array, targetIndex, selectedIndex) {
    let returnString = ``
    for (let x = 0; array.length > x; x++) {
        if (x == targetIndex) {
            returnString += `<div class="conceptBar conceptHighlightedTargetBar ${selectedIndex == targetIndex ? "conceptHighlightedSplitBar" : ""}" style="height:${array[x]}px" ></div>`
        } else if (x == selectedIndex) {
            returnString += `<div class="conceptBar conceptHighlightedSplitBar" style="height:${array[x]}px" ></div>`
        } else {
            returnString += `<div class="conceptBar" style="height:${array[x]}px" ></div>`
        }
    }

    $("#conceptSelectedDisplay").html(`${conceptSortArray[conceptSearchIteration]}(${conceptSearchIteration})`)

    $("#conceptBarContainer").html(returnString)
}

function nextLinearSearchStep() {
    conceptSearchIteration++
}

function nextBubbleSortStep() {
    if (conceptSpeed == 0) {
        if (conceptIterator == conceptSortArray.length) {

            conceptIterator = 0;
            conceptSorted = !conceptBarSwapped
            conceptBarSwapped = false
        } else {
            if (bubbleSortIteration(conceptIterator, conceptSpeed)) {
                conceptBarSwapped = true;
            }
            conceptIterator++;
        }
    } else if (conceptSpeed == 1) {//Faster
        conceptBarSwapped = false

        for (let x = 0; x < conceptSortArray.length; x++) {

            if (bubbleSortIteration(x, conceptSpeed)) {
                conceptBarSwapped = true;
            }

        }

        conceptSorted = !conceptBarSwapped
    }

}

function insertionSort(array) {
    let n = array.length;
    for (let i = 1; i < n; i++) {
        // Choosing the first element in our unsorted subarray
        let current = array[i];
        // The last element of our sorted subarray
        let j = i - 1;
        while ((j > -1) && (current < array[j])) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = current;
    }
    return array;
}

function bubbleSortIteration(x, speed) {
    let tempVal;
    if (conceptSortArray[x] > conceptSortArray[x + 1]) {//If swapped

        tempVal = conceptSortArray[x]

        conceptSortArray[x] = conceptSortArray[x + 1]

        conceptSortArray[x + 1] = tempVal
        conceptHighlightedBarLower = x
        conceptHighlightedBarHigher = x + 1
        return true
    }
    if (speed == 0) {
        conceptHighlightedBarLower = x
        conceptHighlightedBarHigher = x + 1
    }
    return false
}

function bucketSortScatter() {
    for (let x = 0; x < conceptSortArray.length; x++) {
        conceptSortBucketArray[Math.floor((conceptSortArray[x] - 1) / (conceptMaximumValue / 20))].push(conceptSortArray[x])
    }
}

function bucketSortSort() {//Combine gather and sort as for visualization purposes
    console.log(conceptSortBucketArray)
    for (let x = 0; x < conceptSortBucketArray.length; x++) {
        //Use insertion sort
        conceptSortBucketArray[x] = insertionSort(conceptSortBucketArray[x])
    }
}

function bucketSortGather() {
    conceptSortArray = []
    for (let x = 0; x < conceptSortBucketArray.length; x++) {
        for (let y = 0; y < conceptSortBucketArray[x].length; y++) {
            conceptSortArray.push(conceptSortBucketArray[x][y])
        }
    }
}

function nextBinarySearchStep(tempArray) {

    // if (conceptSortArrayModify) {
    //     const middleIndex = Math.floor(conceptSortArrayModify.length / 2);

    // if (conceptSortArrayModify[middleIndex] == conceptSortArray[conceptTargetIndex]){
    //     conceptSearchStatus = true;
    // }else{
    //     if (conceptSortArrayModify[middleIndex] > conceptSortArray[conceptTargetIndex]) {//This means the target number is in the left array
    //         conceptSortArrayModify = conceptSortArrayModify.slice(0, middleIndex)
    //     } else {//This means the target number is in the right array
    //         conceptSortArrayModify = conceptSortArrayModify.slice(-middleIndex)
    //     }
    // }
    // } else {
    //     conceptSearchStatus = true;//true  here means ust done
    // }

    //Create the new temporary array
    if (tempArray.length) {
        let middleIndex = Math.floor(tempArray.length / 2)
        console.log(`MI`, middleIndex, `CTI`, conceptTargetIndex)

        let iterator = 0;//makes it start from 0
        let trueMiddleIndex = 0

        if (tempArray[middleIndex] > conceptSortArray[conceptTargetIndex]) {//This means the target number is in the left array
            for (let x = conceptSortArrayStatus.length - 1; middleIndex - 1 <= x; x--) {
                if (middleIndex == iterator) {
                    trueMiddleIndex = x
                    break;
                }
                if (conceptSortArrayStatus[x] == 0) {
                    conceptSortArrayStatus[x] = 1 + conceptSearchIteration;
                    iterator++
                }
            }
            return trueMiddleIndex
        } else if (tempArray[middleIndex] < conceptSortArray[conceptTargetIndex]) {//This means the target number is in the right array
            for (let x = 0; conceptSortArrayStatus.length > x; x++) {
                if (middleIndex == iterator) {
                    trueMiddleIndex = x
                    break;
                }
                if (conceptSortArrayStatus[x] == 0) {
                    conceptSortArrayStatus[x] = 1 + conceptSearchIteration;
                    iterator++
                }

            }
            return trueMiddleIndex
        } else {
            return middleIndex
        }
    } else {
        conceptSearchStatus = true;
        return false
    }
}

function returnTrueIndex(index) {
    let iterator = 0

    for (let x = 0; conceptSortArrayStatus.length > x; x++) {
        if (index == iterator) {

            return x
        }
        if (conceptSortArrayStatus[x] == 0) {
            iterator++
        }
    }
}

function returnModifiedArray() {
    let tempArray = []
    for (let x = 0; x < conceptSortArray.length; x++) {
        if (conceptSortArrayStatus[x] == 0) {
            tempArray.push(conceptSortArray[x])
        }
    }

    return tempArray
}

function renderLinesAndText() {
    $("#fullsvg").empty()

    let boundingRectNodeArray = []

    $(`.conceptAnimationColumn .conceptNode.active`).map(function () {
        let boundingObj = this.getBoundingClientRect();

        boundingRectNodeArray.push(boundingObj)
    })

    for (let x = 0; x < graphNodeConnections.length; x++) {
        //Start Drawing the Node's Connections'
        for (let y = 0; y < graphNodeConnections[x].length; y++) {
            //Iterate through the Node's Connections'
            if (graphNodeConnections[x][y] && x != graphNodeConnections.length - 1) {
                let b1 = boundingRectNodeArray[x]
                let b2 = boundingRectNodeArray[y]
                renderLineAndText(b1, b2, graphNodeConnections[x][y], graphArrayPointer == x || graphArrayPointer == y)
            }
        }
    }

    var svg = window.btoa(($(`#fullsvg`)[0]).outerHTML)//set base64 svg as background

    $("#conceptAnimation").css("background-image", "url(data:image/svg+xml;base64," + svg + ")")
}

function renderLineAndText(boundingObj1, boundingObj2, weight, highlight) {

    $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr(
        generateLineAttributes(boundingObj1, boundingObj2, highlight)
    ).appendTo("#fullsvg")

    let textSVG = $(document.createElementNS('http://www.w3.org/2000/svg', 'text'))

    textSVG[0].innerHTML = weight//WEIGHT

    textSVG.attr(
        generateTextAttributes(boundingObj1, boundingObj2, highlight)
    ).appendTo("#fullsvg")
}

function generateLineAttributes(b1, b2, highlight) {
    let x1;
    let y1;
    let x2;
    let y2;

    // if (b1.left == b2.left && b1.right == b2.right) {//If nodes are on top of one another
    //     x1 = b1.left + b1.width / 2;
    //     y1 = b1.bottom;

    //     x2 = b2.left + b2.width / 2;
    //     y2 = b2.top;
    // } else {
    //     x1 = b1.left > b2.left ? b1.left : b1.right;
    //     y1 = b1.top + b1.height / 2;

    //     x2 = b2.left > b1.left ? b2.left : b2.right;
    //     y2 = b2.top + b2.height / 2;
    // }

    //Just go to center
    x1 = b1.left + b1.width / 2;
    y1 = b1.top + b1.height / 2;

    x2 = b2.left + b2.width / 2;
    y2 = b2.top + b2.height / 2;

    return {
        x1: x1 - $("#conceptAnimation").offset().left,
        y1: y1 - $("#conceptAnimation").offset().top,
        x2: x2 - $("#conceptAnimation").offset().left,
        y2: y2 - $("#conceptAnimation").offset().top,
        style: highlight ? `stroke: red;stroke-width: 3;` : `stroke: black;stroke-width: 2;`
    }
}

function generateTextAttributes(b1, b2, highlight) {

    let lineAttributeObject = generateLineAttributes(b1, b2, 0)

    return {
        "font-size": highlight ? `1.25em` : `1em`,
        x: (lineAttributeObject.x1 + lineAttributeObject.x2) / 2,
        y: (lineAttributeObject.y1 + lineAttributeObject.y2) / 2 - 5,
        fill: highlight ? `red` : `black`
    }
}

function generateUserDistance(userDistanceArr) {
    console.log(userDistanceArr)
    let returnString = ``

    for (let x = 0; x < userDistanceArr.length; x++) {
        returnString += `
        <tr>
            <th scope="row">${String.fromCharCode("A".charCodeAt(0) + x)}</th>
            <td>${userDistanceArr[x]}</td>
        </tr>
        `
    }

    return `
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Node</th>
        <th scope="col">Shortest Distance</th>
      </tr>
    </thead>
    <tbody>
        ${returnString}
    </tbody>
  </table>
    `
}

function nextDijkstraStep() {//Go forward
    for (var x = 0; graphNodeConnections[graphArrayPointer].length > x; x++) {//Checks all the connections between this node and other nodes
        // console.log(graphNodeConnections, graphUserDistance, graphArrayPointer)

        if (x != graphArrayPointer - 1) {//If the ignore setting distance to the previous node
            if (graphNodeConnections[graphArrayPointer][x]) {//If there is a connection
                let tempWeight = graphNodeConnections[graphArrayPointer][x] + graphUserDistance[graphArrayPointer]//Set the Temporary weight to Graph

                if (graphUserDistance[x] == 0 || tempWeight < graphUserDistance[x]) {//If there is no distance, or the stored distance is more than the graph user distance
                    graphUserDistance[x] = tempWeight
                }
            }
        }
    }
    graphUserDistanceHistory[graphArrayPointer + 1] = graphUserDistance.slice(0)//creates a new array, doesnt allow for pass by value

    generateSelectedConceptDescription(0)
}

function lastDijkstraStep() {//Go back via history
    console.log(graphUserDistanceHistory, graphUserDistanceHistory[graphArrayPointer])
    graphUserDistance = graphUserDistanceHistory[graphArrayPointer].slice(0)
    generateSelectedConceptDescription(0)
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
                //1 - 10000000!/(10000000^500)(10000000-500)! = roughly 4%, give or take
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
          <label class="form-label">Descriptions</label>
          <textarea class="form-control textArea adminMeDescription mt-1" id="adminMeDescription">${pageObject.meDescription}</textarea>
          <textarea class="form-control textArea adminMeDescription mt-1" id="adminMeDescription1">${pageObject.meDescription1}</textarea>
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
                postData.meDescription1 = $(`#adminMeDescription1`).val()//use html instead of val

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

            $("#navbarToggler").click(() => {//Handles when navbar toggler is clicked, makes it so the contact icon isnt at the bottom, Changed method
                $("#navbarSupportedContent").removeClass("order-1")
                $("#navbarSupportedContent").addClass("order-3")
            })

            // $("#navbarToggler").click(() => {//Handles when navbar toggler is clicked, makes it so the contact icon isnt at the bottom
            //     $("#navbarContactIconContainer").remove()
            //     $(`<div class="mx-2 justify-content-start d-flex flex-row-reverses" id="navbarContactIconContainer"></div>`).insertAfter("#navbarToggler")
            //     generateNavbarContactIcons(snapshot.val().navbarContactIconArray)
            // })

            $(window).resize(() => {
                //Handles after navbar toggler is clicked, makes contact icons go back to the original place
                if ($(window).width() >= 992) {
                    $("#navbarSupportedContent").addClass("order-1")
                    $("#navbarSupportedContent").removeClass("order-3")
                } else {
                    $("#navbarSupportedContent").removeClass("order-1")
                    $("#navbarSupportedContent").addClass("order-3")
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
            $('.divider:not(#footerDivider):not(#contactMeDivider)').css({ width: '0%' })

            generateSpinnersForTab(clickedID.slice(0, clickedID.length - 4));
            switch (clickedID.slice(0, clickedID.length - 4)) {
                case "meTab":
                    $('.descDivider').animate({ width: "97%" }, 500)
                    $('#titleDivider').animate({ width: "40%" }, 500)
                    $('#softSkillDivider').animate({ width: "82%" }, 500)
                    setTimeout(() => {
                        get(child(database, "mePage")).then((snapshot) => {//Apis will be recalled every time it is clicked
                            if (snapshot.exists()) {
                                generateMeCarouselImages(snapshot.val().meImageArray)
                                generateSkills(snapshot.val().meSkillObject)
                                generatePersonalImage(snapshot.val().meImage)
                                generateDescription(snapshot.val().meDescription)
                                generateDescription1(snapshot.val().meDescription1)
                            } else {
                                throw new Error("Data does not exist!")
                            }
                        }).catch((error) => {
                            console.error(error);
                        }).finally(() => {
                        });
                    })

                    break;

                case "projectsTab":
                    $('#headerDivider').animate({ width: "97%" }, 500)
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
                    })
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
                    })
                    break;

                case "conceptsTab":
                    setTimeout(() => {
                        generateConcepts()
                    })

            }
            clearInterval(conceptAutoPlayInterval)
            $('#' + clickedID.slice(0, clickedID.length - 4) + 'Content').fadeIn()
        }
    });

    //==========================Handling Normal Startup=============================
    //On normal Startup, start animations and call stuff for me page
    $('.contentContainer').hide();

    $('.divider').css({ width: '0%' })
    $('#meTabContent').fadeIn('slow')
    $('.descDivider').animate({ width: "97%" }, 500)
    $('#titleDivider').animate({ width: "40%" }, 500)
    $('#softSkillDivider').animate({ width: "82%" }, 500)

    //loading Information from mePage
    //Load Footer
    $("#footer").load("htmlComponents/footer.html")

    setTimeout(() => {
        get(child(database, "mePage")).then((snapshot) => {
            if (snapshot.exists()) {
                generateMeCarouselImages(snapshot.val().meImageArray)
                generateSkills(snapshot.val().meSkillObject)
                generatePersonalImage(snapshot.val().meImage)
                generateDescription(snapshot.val().meDescription)
                generateDescription1(snapshot.val().meDescription1)
            } else {
                throw new Error("Data does not exist!")
            }
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            //$('.contentContainer').height($(window).height() - $(`.navbar`).height());
        });
    })

    //==================================== ME tab ==========================
    //Handles if a User focuses on tab
    var changeGreetingInterval = setInterval(function () {
        greetingArrayIterable == greetingArray.length - 1 ? greetingArrayIterable = 0 : greetingArrayIterable++;
        changeLargeTextHeader(greetingArray[greetingArrayIterable])
    }, 15000)

    $(window).focus(function () {
        clearInterval(changeGreetingInterval)

        changeGreetingInterval = setInterval(function () {
            greetingArrayIterable == greetingArray.length - 1 ? greetingArrayIterable = 0 : greetingArrayIterable++;
            changeLargeTextHeader(greetingArray[greetingArrayIterable])
        }, 15000)
    })

    $(window).blur(function () {
        clearInterval(changeGreetingInterval)
    })

});