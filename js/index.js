$(document).ready(function () {

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

    $('.navbar-nav li a').click(function () {
        var clickedID = $(this).attr('id');
        if ($(this).hasClass('inactive')) { //this is the start of our condition 
            $('.navbar-nav li a').removeClass('active')
            $('.navbar-nav li a').addClass('inactive');

            $(this).addClass(`active`)

            $('.container').hide();
            $('#' + clickedID.slice(0, clickedID.length - 4) + 'Content').fadeIn('slow')
        }
    });

    function returnProficiencyHTML(proficiency){
        let returnString = ``;
        for(var x = 0;proficiency > x;x++){
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