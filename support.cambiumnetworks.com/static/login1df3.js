jQuery(document).ready(function($) {
    var getcamefrom = function() {
        var url = window.location.href;
        var match = url.match(/[?&]camefrom=([^&]*)/);
        if (match) {
            return match[1];
        }
        return null;
    };
    var checkredirect = function(event) {
        var email = $('input[name=email]').val() || '';
        if (email.match(/@cambiumnetworks\.com$/i)) {
            var newurl = '/saml/login?email=' + encodeURIComponent(email);
            var camefrom = getcamefrom();
            if (camefrom) {
                newurl = newurl + '&returnto=' + camefrom;
            }
            $('input').attr('disabled', true);
            $('form#login').replaceWith(
                '<div class="alert alert-info">'
                + 'Redirecting to Cambium login page'
                + '</div>'
            );
            event.preventDefault();
            window.location = newurl;
        }
    };
    $('input[name=email]').on('blur', function(event) {
        checkredirect(event);
    });

    $('form#login').on('submit', function(event) {
        checkredirect(event);
    });
});
