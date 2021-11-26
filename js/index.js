$(document).ready(function () {
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
            $('.skillTitle').animate({width: 'toggle'},700)
            $('.skillBar').animate({width: 'toggle'},700)
            $('#' + clickedID.slice(0,clickedID.length - 4) + 'Content').fadeIn('slow')
        }
    });
});