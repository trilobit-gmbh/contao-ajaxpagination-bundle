(function (jQuery) {

    const requestCache = [];
    const $currentlyProcessedElements = [];

    function requestUpdate($element) {
        // only allow one update at a time
        if ($currentlyProcessedElements.includes($element)) {
            return;
        }
        $currentlyProcessedElements.push($element);

        var $container = $element.closest('[data-pagination]');
        var requestUrl = getRequestUrl($element.attr('href'), $container.data('pagination'));

        // trigger event: on hide
        $container.trigger(
            jQuery.Event('hide.pagination.container', {
                relatedTarget: $container
            })
        );

        $container.css({opacity: .25});

        // use cached results if possible
        var cacheKey = requestUrl;

        if (requestCache[cacheKey]) {
            update($container, requestCache[cacheKey], requestUrl);
            $currentlyProcessedElements.splice($currentlyProcessedElements.indexOf($element), 1);

            return;
        }

        //perform request
        jQuery.ajax({
            url: '/?' + requestUrl,
            type: 'get',
            success: function (data) {
                requestCache[cacheKey] = data;

                update($container, data, requestUrl);
                $currentlyProcessedElements.splice($currentlyProcessedElements.indexOf($element), 1);
            },
            error: function () {
                // fallback
                location.href = requestUrl;
            }
        });
    }

    function extractContent($container, data) {
        return jQuery(data).find('[data-pagination="' + $container.data('pagination') + '"]').children();
    }

    function getRequestUrl(url, identifier) {
        for (var param of url.split('&')) {
           var part = param.split('=');
           if(part[0].replace('?', '') === identifier) {
               return part[0].replace('?', '') + '=' + part[1];
           }
        }
        return '#';
    }

    function update($container, data, requestUrl) {
        // update content
        $container.empty().append(extractContent($container, data)).css({opacity: 1});

        // update browser url
        history.pushState({}, null, requestUrl !== '#' ? '?' + requestUrl : '/');

        // trigger event: on show
        $container.trigger(
            jQuery.Event('show.pagination.container', {
                relatedTarget: $container
            })
        );
    }


    function init() {
        // cache current site
        var urlParameters = decodeURIComponent(window.location.search.substring(1)).split('&');
        urlParameters.forEach(function (parameter) {
            if(parameter) {
                requestCache[parameter] = document.documentElement.innerHTML;
            } else {
                requestCache['#'] = document.documentElement.innerHTML;
            }
        });

        // track .pagination a elements
        $('body').on('click', '.pagination a', function (event) {
            event.preventDefault();
            requestUpdate(jQuery(this));
        });
    }

    jQuery(document).ready(function () {
        init();
    });


})(jQuery);
