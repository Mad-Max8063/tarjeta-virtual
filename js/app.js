// ============================================
// app.js — Main router & app orchestration
// ============================================

import { decodeData } from './utils.js';
import { initEditor } from './editor.js';
import { renderPreview, renderLanding } from './card.js';

const app = document.getElementById('app');

function navigate() {
    const hash = window.location.hash;

    // Clear container
    app.innerHTML = '';
    app.className = 'app-container';
    if (hash.startsWith('#edit/')) {
        // — Gallery edit mode: professional adds their work photos —
        const encoded = hash.replace('#edit/', '');
        const data = decodeData(encoded);

        if (!data) {
            app.innerHTML = `
        <div style="text-align:center; padding:60px 20px;">
          <h2 style="margin-bottom:8px;">Link inválido</h2>
          <p style="color:var(--text-secondary);">Esta tarjeta no existe o el link está dañado.</p>
        </div>`;
            return;
        }

        const editView = document.createElement('div');
        editView.className = 'view active';
        app.appendChild(editView);

        import('./gallery-editor.js').then((mod) => {
            mod.renderGalleryEditor(editView, data);
        });

    } else if (hash.startsWith('#card/')) {
        // — Landing mode: decode data from URL —
        const encoded = hash.replace('#card/', '');
        const data = decodeData(encoded);

        if (!data) {
            app.innerHTML = `
        <div style="text-align:center; padding:60px 20px;">
          <h2 style="margin-bottom:8px;">Link inválido</h2>
          <p style="color:var(--text-secondary);">Esta tarjeta no existe o el link está dañado.</p>
        </div>`;
            return;
        }

        // Update page meta for WhatsApp preview
        updateMeta(data);

        const landingView = document.createElement('div');
        landingView.className = 'view active';
        app.appendChild(landingView);
        renderLanding(landingView, data);

    } else if (hash === '#preview') {
        // — Preview mode: data from localStorage —
        const previewView = document.createElement('div');
        previewView.className = 'view active';
        app.appendChild(previewView);

        const { getEditorData } = window.__editorModule || {};
        const data = getEditorData ? getEditorData() : {};

        renderPreview(
            previewView,
            data,
            () => { window.location.hash = '#editor'; },
            () => { }
        );

    } else {
        // — Editor mode (default) —
        const editorView = document.createElement('div');
        editorView.className = 'view active';
        app.appendChild(editorView);

        import('./editor.js').then((mod) => {
            window.__editorModule = mod;
            mod.initEditor(editorView, (data) => {
                window.location.hash = '#preview';
            });
        });
    }
}

function updateMeta(data) {
    // Update document title
    document.title = `${data.name} — ${data.profession}`;

    // Update OG tags for WhatsApp preview
    setMetaTag('og:title', `${data.name} — ${data.profession}`);
    setMetaTag('og:description', data.description || `Contactá a ${data.name}`);
    setMetaTag('og:type', 'profile');
}

function setMetaTag(property, content) {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

// Listen for hash changes
window.addEventListener('hashchange', navigate);

// Initial route
navigate();
