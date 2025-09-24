export function initRouter(routes, defaultPath = '/') {
    const outlet = document.getElementById('app');
    let initialized = false;
    function render() {
        const hash = location.hash.replace('#', '');
        const path = hash || defaultPath;
        const handler = routes[path];
        if (typeof handler === 'function') {
            outlet.innerHTML = '';
            const el = handler();
            if (el) outlet.appendChild(el);
            // After route change, bring content into view (skip the very first render)
            if (initialized) {
                outlet.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            initialized = true;
        } else {
            location.hash = defaultPath;
        }
    }
    window.addEventListener('hashchange', render);
    render();
}

