export function renderGallery(data) {
    const params = new URLSearchParams(location.hash.split('?')[1] || '');
    const folder = params.get('folder') || 'artwork';
    const q = params.get('q') || '';
    const sort = params.get('sort') || 'desc';

    const root = document.createElement('div');
    root.style.display = 'grid';
    root.style.gap = '16px';

    // Toolbar
    const bar = document.createElement('div');
    bar.style.display = 'grid';
    bar.style.gridTemplateColumns = '1fr auto auto';
    bar.style.gap = '12px';

    const search = document.createElement('input');
    search.type = 'search';
    search.placeholder = 'Search title…';
    search.value = q;
    search.style.padding = '10px 12px';
    search.style.borderRadius = '999px';
    search.style.border = '1px solid rgba(0,0,0,0.15)';
    search.style.background = 'rgba(255,255,255,0.65)';

    const sortSel = document.createElement('select');
    [['desc','Newest'],['asc','Oldest']].forEach(([v,l])=>{
        const o=document.createElement('option');o.value=v;o.textContent=l;sortSel.appendChild(o);
    });
    sortSel.value = sort;
    sortSel.style.padding = '10px 12px';
    sortSel.style.borderRadius = '999px';
    sortSel.style.border = '1px solid rgba(0,0,0,0.15)';
    sortSel.style.background = 'rgba(255,255,255,0.65)';

    const uploadBtn = document.createElement('a');
    uploadBtn.className = 'btn';
    uploadBtn.textContent = 'Upload';
    uploadBtn.href = '#/upload';

    bar.appendChild(search);
    bar.appendChild(sortSel);
    bar.appendChild(uploadBtn);

    // Folder tabs
    const tabs = document.createElement('div');
    tabs.style.display = 'flex';
    tabs.style.gap = '8px';
    data.folders.forEach(f => {
        const t = document.createElement('a');
        t.className = 'btn ghost';
        t.textContent = f.name;
        t.href = `#/gallery?folder=${encodeURIComponent(f.id)}&q=${encodeURIComponent(q)}&sort=${sort}`;
        if (f.id === folder) { t.style.background = 'rgba(0,0,0,0.06)'; }
        tabs.appendChild(t);
    });

    // Filter, sort data
    let items = data.images.filter(i => i.folderId === folder && (!q || (i.title||'').toLowerCase().includes(q.toLowerCase())));
    items.sort((a,b)=> (sort==='asc'? 1 : -1) * (new Date(a.createdAt) - new Date(b.createdAt)));

    // Masonry with random sizes
    const grid = document.createElement('div');
    grid.style.columns = '280px';
    grid.style.columnGap = '16px';

    items.forEach(i => {
        const card = document.createElement('div');
        card.style.breakInside = 'avoid';
        card.style.marginBottom = '16px';
        card.style.border = '1px solid rgba(0,0,0,0.08)';
        card.style.borderRadius = '12px';
        card.style.overflow = 'hidden';
        card.style.background = 'rgba(255,255,255,0.5)';
        card.style.backdropFilter = 'saturate(120%) blur(4px)';
        const img = document.createElement('img');
        const w = 600 + Math.floor(Math.random()*500);
        const h = 400 + Math.floor(Math.random()*600);
        img.src = `${i.url.split('/').slice(0,-2).join('/')}/${w}/${h}`;
        img.alt = i.title || '';
        img.style.width = '100%';
        img.style.display = 'block';
        card.appendChild(img);
        grid.appendChild(card);
    });

    // interactions
    search.addEventListener('input', () => {
        const qp = new URLSearchParams({ folder, q: search.value, sort });
        location.hash = `#/gallery?${qp.toString()}`;
    });
    sortSel.addEventListener('change', () => {
        const qp = new URLSearchParams({ folder, q, sort: sortSel.value });
        location.hash = `#/gallery?${qp.toString()}`;
    });

    root.appendChild(tabs);
    root.appendChild(bar);
    root.appendChild(grid);
    return root;
}

