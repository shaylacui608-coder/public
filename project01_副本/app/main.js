import { initRouter } from './router.js';
import { renderFolders } from './views/folders.js';
import { renderGallery } from './views/gallery.js';
import { renderUpload } from './views/upload.js';
import { mock } from './mock.js';

const routes = {
    '/folders': () => renderFolders(mock),
    '/gallery': () => renderGallery(mock),
    '/upload': () => renderUpload(mock)
};

initRouter(routes, '/folders');

