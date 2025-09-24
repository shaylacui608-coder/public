export function renderFolders(data) {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
    wrap.style.gap = '16px';

    data.folders.forEach(f => {
        const card = document.createElement('a');
        card.href = `#/gallery?folder=${encodeURIComponent(f.id)}`;
        card.style.display = 'block';
        card.style.textDecoration = 'none';
        card.style.color = 'inherit';
        card.style.border = '1px solid rgba(0,0,0,0.08)';
        card.style.borderRadius = '12px';
        card.style.overflow = 'hidden';
        card.style.background = 'rgba(255,255,255,0.5)';
        card.style.backdropFilter = 'saturate(120%) blur(4px)';
        card.style.boxShadow = '0 10px 24px rgba(0,0,0,0.06)';

        const img = document.createElement('img');
        img.src = f.cover;
        img.alt = f.name;
        img.style.width = '100%';
        img.style.height = '140px';
        img.style.objectFit = 'cover';

        const meta = document.createElement('div');
        meta.style.padding = '12px';
        meta.innerHTML = `<strong>${f.name}</strong>`;

        card.appendChild(img);
        card.appendChild(meta);
        wrap.appendChild(card);
    });
    return wrap;
}

