export function renderUpload(data) {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gridTemplateColumns = '1fr 320px';
    wrap.style.gap = '16px';

    const drop = document.createElement('div');
    drop.textContent = 'Drag & drop images here or click to select';
    drop.style.border = '2px dashed rgba(0,0,0,0.25)';
    drop.style.borderRadius = '12px';
    drop.style.minHeight = '220px';
    drop.style.display = 'flex';
    drop.style.alignItems = 'center';
    drop.style.justifyContent = 'center';
    drop.style.cursor = 'pointer';
    drop.style.background = 'rgba(255,255,255,0.5)';
    drop.style.backdropFilter = 'saturate(120%) blur(4px)';

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.display = 'none';
    drop.addEventListener('click', () => input.click());

    const side = document.createElement('div');
    side.style.display = 'flex';
    side.style.flexDirection = 'column';
    side.style.gap = '8px';
    const label = document.createElement('label');
    label.textContent = 'Target folder:';
    const select = document.createElement('select');
    data.folders.forEach(f => {
        const opt = document.createElement('option');
        opt.value = f.id;
        opt.textContent = f.name;
        select.appendChild(opt);
    });

    side.appendChild(label);
    side.appendChild(select);

    wrap.appendChild(drop);
    wrap.appendChild(input);
    wrap.appendChild(side);

    // Prevent default browser behavior
    ;['dragenter','dragover','dragleave','drop'].forEach(evt => {
        drop.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); });
    });

    return wrap;
}

