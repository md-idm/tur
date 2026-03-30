
function frameEvent(event) {

    if (event.data.search('autoscroll') >= 0) {
        try {
            jQuery('html, body').animate({
                scrollTop: jQuery("#tours_search_frame").offset().top
            }, 1000);
        } catch (err) {
            console.log("error autoscroll - ", err);
        }
    }

    // if (event.data.search('transport_autoscroll') >= 0) {
    //     try {
    //         jQuery('html, body').animate({
    //             scrollTop: jQuery("#tours_avia_search_frame").offset().top
    //         }, 1000);
    //     } catch (err) {
    //         console.log("error autoscroll - ", err);
    //     }
    // }

    if (event.data.search('scroll-excursion') >= 0) {
        try {

            jQuery('html, body').animate({
                scrollTop: jQuery("#tours_search_frame_excursion").offset().top
            }, 1000);

        } catch (err) {
            console.log(err)
        }
    }

    if (event.data.search('set_transport_frame_height') >= 0) {
        var height = parseInt(event.data.split(':')[1]);

        try {
            var frame = document.getElementById('tours_avia_search_frame')
            frame.style.height = height + 'px';
            frame.style.maxHeight = 'none';
        } catch (err) {
            console.log(err)
        }
    }

    if (event.data.search('set_frame_height') >= 0) {
        var height = parseInt(event.data.split(':')[1]);

        try {

            jQuery('#tours_search_frame').css("position", "relative")

            var frame = document.getElementById('tours_search_frame')
            frame.style.height = height + 'px'
        } catch (err) {
            console.log(err)
        }
    }

    if (event.data.search('set_excursion_height') >= 0) {
        var height = parseInt(event.data.split(':')[1]);
        try {
            console.log("height: ", height);
            jQuery('html, body').animate({
                scrollTop: jQuery("#tours_search_frame_excursion").offset().top
            }, 1000);
            var frame = document.getElementById('tours_search_frame_excursion')
            frame.style.height = height + 'px'
        } catch (err) {
            console.log(err);
        }

    }
}
window.addEventListener("message", frameEvent, false);
