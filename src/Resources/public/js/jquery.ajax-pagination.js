(function (jQuery) {

    const $requestCache = [];
    const $currentlyProcessedElements = [];

    function requestUpdate($element) {
        // only allow one update at a time
        if($currentlyProcessedElements.includes($element)) {
            return;
        }
        $currentlyProcessedElements.push($element);

        var $container = $element.closest('[data-pagination]');
        var requestUrl = $element.attr('href');

        // trigger event: on hide
        $container.trigger(
            jQuery.Event('hide.pagination.container', {
                relatedTarget: $container
            })
        );

        $container.css({opacity: .25});

        // use cached results if possible
        var cacheKey = $container.data('pagination') + '__' + requestUrl;

        if ($requestCache[cacheKey]) {
            update($container, $requestCache[cacheKey], requestUrl);
            $currentlyProcessedElements.splice($currentlyProcessedElements.indexOf($element), 1);

            return;
        }

        // perform request
        jQuery.ajax({
            url: requestUrl,
            type: 'get',
            success: function (data) {
                var $content = jQuery(data).find('[data-pagination="' + $container.data('pagination') + '"]').children();
                $requestCache[cacheKey] = $content;

                update($container, $content, requestUrl);
                $currentlyProcessedElements.splice($currentlyProcessedElements.indexOf($element), 1);
            },
            error: function () {
                // fallback
                location.href = requestUrl;
            }
        });
    }

    function update($container, $content, requestUrl) {
        // update content
        $container.empty().append($content).css({opacity: 1});

        // update browser url
        history.pushState({}, null, requestUrl);

        // trigger event: on show
        $container.trigger(
            jQuery.Event('show.pagination.container', {
                relatedTarget: $container
            })
        );
    }

    function init() {
        // track .pagination a elements
        jQuery('body').on('click', '[data-pagination] .pagination a, [data-pagination] .cal_pagination a', function (event) {
            event.preventDefault();
            requestUpdate(jQuery(this));
        });
    }

    jQuery(document).ready(function () {
        init();
    });


})(jQuery);
