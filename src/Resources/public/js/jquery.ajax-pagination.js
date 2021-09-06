(function (jQuery) {
    const $requestCache = [];
    const $currentlyProcessedElements = [];

    function requestUpdate($element) {
        "use strict";

        // only allow one update at a time
        if ($currentlyProcessedElements.includes($element)) {
            return;
        }

        $currentlyProcessedElements.push($element);

        let $container = $element.closest('[data-pagination]');
        let opacity = $element.closest('[data-pagination]').data('pagination-opacity') ?? '.25';
        let requestUrl = $element.attr('href');

        if ('' === requestUrl) {
            requestUrl = location.protocol + '//' + location.host + location.pathname;
        }

        // trigger event: on hide
        $container.trigger(
            jQuery.Event('hide.pagination.container', {
                relatedTarget: $container
            })
        )

        $container.css({opacity: opacity});

        // use cached results if possible
        let cacheKey = $container.data('pagination') + '__' + requestUrl;

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
                const $content = jQuery(data).find('[data-pagination="' + $container.data('pagination') + '"]').children();
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
        "use strict";

        let type = $container.data('pagination-type') ?? 'replace';
        let scroll = $container.data('pagination-scroll') ?? '';
        let offset = $container.data('pagination-scroll-offset') ?? '0';

        if ('add' === type) {
            $container.find('nav[class*="pagination"]').remove();

            for (let i = 0; i < $content.length; i++) {
                if (jQuery($content[i]).hasClass('pagination')) {
                    jQuery($content[i]).find('li').not('.next').remove();
                }
            }
        } else {
            $container.empty();

            // update browser url
            history.pushState({}, null, requestUrl);
        }

        // update content
        $container.append($content).css({opacity: 1});

        // scroll
        if ('' !== scroll) {
            let top = $container.offset().top + offset;
            scrollTo(top, scroll);
        }

        // trigger event: on show
        $container.trigger(
            jQuery.Event('show.pagination.container', {
                relatedTarget: $container
            })
        );
    }

    function scrollTo(value, options) {
        "use strict";

        jQuery('html, body')
            .animate({
                scrollTop: parseInt(value, 10)
            }, options)
        ;
    }

    function init() {
        "use strict";

        // track .pagination a elements
        jQuery('body').on('click', '[data-pagination] .pagination a, [data-pagination] .cal_pagination a', function (event) {
            event.preventDefault();
            requestUpdate(jQuery(this));
        });

        jQuery('[data-pagination]').each(function() {
            let $container = jQuery(this);

            if ('add' === ($container.data('pagination-type') ?? 'replace')) {
                $container.find('nav[class*="pagination"] li').not('.next').remove();
            }
        });
    }

    jQuery(document).ready(function () {
        init();
    });

})(jQuery);
