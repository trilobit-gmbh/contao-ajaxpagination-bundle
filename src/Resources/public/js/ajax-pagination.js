(function () {
    const requestCache = {};
    const currentlyProcessedElements = [];

    function requestUpdate(element) {
        "use strict";

        // only allow one update at a time
        if (currentlyProcessedElements.includes(element)) {
            return;
        }

        currentlyProcessedElements.push(element);

        let container = element.closest('[data-pagination]');
        let opacity = container.getAttribute('data-pagination-opacity') ?? '.25';
        let requestUrl = element.getAttribute('href');

        if (null === requestUrl || '' === requestUrl) {
            requestUrl = location.protocol + '//' + location.host + location.pathname;
        }

        // trigger event: on hide
        container.dispatchEvent(
            new CustomEvent('hide.pagination.container', {
                detail: {
                    relatedTarget: container
                },
                bubbles: true,
                cancelable: true
            })
        );

        container.style.opacity = opacity;

        // use cached results if possible
        let cacheKey = container.getAttribute('data-pagination') + '__' + requestUrl;

        if (requestCache[cacheKey]) {
            update(container, requestCache[cacheKey], requestUrl);
            currentlyProcessedElements.splice(currentlyProcessedElements.indexOf(element), 1);

            return;
        }

        // perform request
        fetch(requestUrl, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const paginationId = container.getAttribute('data-pagination');
            const targetContainer = doc.querySelector('[data-pagination="' + paginationId + '"]');

            if (targetContainer) {
                const content = Array.from(targetContainer.children);
                requestCache[cacheKey] = content;

                update(container, content, requestUrl);
            } else {
                // fallback if target container not found in response
                location.href = requestUrl;
            }
            currentlyProcessedElements.splice(currentlyProcessedElements.indexOf(element), 1);
        })
        .catch(error => {
            // fallback
            location.href = requestUrl;
        });
    }

    function update(container, content, requestUrl) {
        "use strict";

        let type = container.getAttribute('data-pagination-type') ?? 'replace';
        let scroll = container.getAttribute('data-pagination-scroll') ?? '';
        let offset = parseInt(container.getAttribute('data-pagination-scroll-offset') ?? '0', 10);

        if ('add' === type) {
            const paginationNavs = container.querySelectorAll('nav[class*="pagination"]');
            paginationNavs.forEach(nav => nav.remove());

            content.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('pagination')) {
                    const lis = node.querySelectorAll('li:not(.next)');
                    lis.forEach(li => li.remove());
                }
            });
        } else {
            container.innerHTML = '';

            // update browser url
            history.pushState({}, null, requestUrl);
        }

        // update content
        content.forEach(node => {
            container.appendChild(node.cloneNode(true));
        });
        container.style.opacity = '1';

        // scroll
        if ('' !== scroll) {
            const rect = container.getBoundingClientRect();
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const top = rect.top + scrollTop + offset;
            scrollTo(top, scroll);
        }

        // trigger event: on show
        container.dispatchEvent(
            new CustomEvent('show.pagination.container', {
                detail: {
                    relatedTarget: container
                },
                bubbles: true,
                cancelable: true
            })
        );
    }

    function scrollTo(value, options) {
        "use strict";

        let behavior = 'smooth';
        // jQuery animate options can be a duration (number) or string.
        // Vanilla scrollTo behavior is 'auto' or 'smooth'.
        // If it's a number, it's duration. Vanilla doesn't support duration directly in scrollTo.
        // We'll just use 'smooth' if options is provided.

        window.scrollTo({
            top: parseInt(value, 10),
            behavior: behavior
        });
    }

    function init() {
        "use strict";

        // track .pagination a elements
        document.body.addEventListener('click', function (event) {
            const target = event.target.closest('[data-pagination] .pagination a, [data-pagination] .cal_pagination a');
            if (target) {
                event.preventDefault();
                requestUpdate(target);
            }
        });

        const containers = document.querySelectorAll('[data-pagination]');
        containers.forEach(container => {
            if ('add' === (container.getAttribute('data-pagination-type') ?? 'replace')) {
                const lis = container.querySelectorAll('nav[class*="pagination"] li:not(.next)');
                lis.forEach(li => li.remove());
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
