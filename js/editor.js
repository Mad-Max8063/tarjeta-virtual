// ============================================
// editor.js — Editor form logic
// ============================================

import { saveToLocalStorage, loadFromLocalStorage, resizeImage, resizeBanner, resizeGalleryImage } from './utils.js';

const FIELDS = ['name', 'profession', 'description', 'phone', 'email', 'location', 'instagram', 'linkedin', 'website'];
const MAX_DESC = 160;

// Demo data for Gabriel Aparicio
const DEMO_DATA = {
  name: 'Gabriel Aparicio',
  profession: 'Técnico Matriculado en Refrigeración',
  description: 'Reparación y mantenimiento de electrodomésticos. Heladeras, aire acondicionado, lavarropas, microondas y hornos eléctricos.',
  phone: '+54 11 6421-8151',
  email: '',
  location: 'Merlo, Buenos Aires',
  instagram: '',
  linkedin: '',
  website: '',
  coverPhoto: 'assets/demo-cover.png'
};

export function initEditor(container, onPreview) {
  let data = loadFromLocalStorage();

  // If no data saved, load demo data
  if (!data || !data.name) {
    data = { ...DEMO_DATA };
    saveToLocalStorage(data);
  }

  const coverPreviewStyle = data.coverPhoto
    ? `background-image: url('${data.coverPhoto}'); background-size: cover; background-position: center;`
    : '';

  container.innerHTML = `
    <div class="editor-header">
      <h1>✨ Tu Tarjeta Virtual</h1>
      <p>Completá tus datos y compartí tu perfil profesional</p>
    </div>

    <form id="editor-form" autocomplete="off">
      <!-- Avatar -->
      <div class="avatar-upload">
        <label for="photo-input" class="avatar-preview" id="avatar-preview">
          <img src="${data.photo || 'assets/default-avatar.svg'}" alt="Avatar" id="avatar-img">
          <div class="upload-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Cambiar
          </div>
        </label>
        <input type="file" id="photo-input" accept="image/*">
        <span class="avatar-label">Tocá para subir tu foto</span>
      </div>

      <!-- Cover Photo -->
      <div class="cover-upload-section">
        <div class="section-label">Imagen de portada</div>
        <label for="cover-input" class="cover-preview" id="cover-preview" style="${coverPreviewStyle}">
          <div class="cover-placeholder ${data.coverPhoto ? 'has-image' : ''}" id="cover-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <span>Subir imagen de portada</span>
            <small>Aparece detrás de tu foto de perfil</small>
          </div>
          <div class="cover-overlay" id="cover-overlay">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Cambiar
          </div>
        </label>
        <input type="file" id="cover-input" accept="image/*">
        ${data.coverPhoto ? '<button type="button" class="btn-remove-cover" id="btn-remove-cover">✕ Quitar portada</button>' : ''}
      </div>

      <!-- Datos principales -->
      <div class="glass-card">
        <div class="form-section">
          <div class="section-label">Información principal</div>

          <div class="form-group">
            <label>Nombre completo <span class="required">*</span></label>
            <input type="text" id="field-name" placeholder="Ej: María González" value="${data.name || ''}" required>
          </div>

          <div class="form-group">
            <label>Profesión / Especialidad <span class="required">*</span></label>
            <input type="text" id="field-profession" placeholder="Ej: Diseñadora UX/UI" value="${data.profession || ''}" required>
          </div>

          <div class="form-group">
            <label>Descripción corta</label>
            <textarea id="field-description" placeholder="Ej: +5 años ayudando a empresas a diseñar productos digitales" maxlength="${MAX_DESC}">${data.description || ''}</textarea>
            <div class="char-count"><span id="desc-count">${(data.description || '').length}</span>/${MAX_DESC}</div>
          </div>
        </div>
      </div>

      <!-- Contacto -->
      <div class="glass-card">
        <div class="form-section">
          <div class="section-label">Datos de contacto</div>

          <div class="form-group">
            <label>Teléfono <span class="required">*</span></label>
            <input type="tel" id="field-phone" placeholder="Ej: +54 11 1234-5678" value="${data.phone || ''}" required>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" id="field-email" placeholder="Ej: maria@ejemplo.com" value="${data.email || ''}">
          </div>

          <div class="form-group">
            <label>Ubicación</label>
            <input type="text" id="field-location" placeholder="Ej: Buenos Aires, Argentina" value="${data.location || ''}">
          </div>
        </div>
      </div>

      <!-- Redes -->
      <div class="glass-card">
        <div class="form-section">
          <div class="section-label">Redes sociales (opcional)</div>

          <div class="form-group">
            <label>Instagram</label>
            <div class="social-input-wrapper">
              <span class="prefix">@</span>
              <input type="text" id="field-instagram" placeholder="tu.usuario" value="${data.instagram || ''}">
            </div>
          </div>

          <div class="form-group">
            <label>LinkedIn</label>
            <input type="url" id="field-linkedin" placeholder="https://linkedin.com/in/tuusuario" value="${data.linkedin || ''}">
          </div>

          <div class="form-group">
            <label>Sitio web</label>
            <input type="url" id="field-website" placeholder="https://tuportfolio.com" value="${data.website || ''}">
          </div>
        </div>
      </div>

      <!-- Galería de trabajos -->
      <div class="glass-card">
        <div class="form-section">
          <div class="section-label">Fotos de trabajos (opcional)</div>
          <p class="section-hint">Mostrá tus trabajos realizados. Máximo 4 fotos.</p>

          <div class="gallery-upload" id="gallery-upload">
            <div class="gallery-grid" id="gallery-grid">
              ${(data.gallery || []).map((img, i) => `
                <div class="gallery-thumb" data-index="${i}">
                  <img src="${img}" alt="Trabajo ${i + 1}">
                  <button type="button" class="gallery-remove" data-index="${i}">✕</button>
                </div>
              `).join('')}
              ${(data.gallery || []).length < 4 ? `
                <label for="gallery-input" class="gallery-add-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <span>Agregar</span>
                </label>
              ` : ''}
            </div>
            <input type="file" id="gallery-input" accept="image/*" multiple style="display:none">
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="btn-group">
        <button type="submit" class="btn btn-primary" id="btn-preview">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Previsualizar tarjeta
        </button>
      </div>
    </form>
  `;

  // — Wire up events —

  // Photo upload
  const photoInput = container.querySelector('#photo-input');
  const avatarImg = container.querySelector('#avatar-img');

  photoInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await resizeImage(file, 200);
    avatarImg.src = dataUrl;
    data.photo = dataUrl;
    saveToLocalStorage(data);
  });

  // Cover photo upload
  const coverInput = container.querySelector('#cover-input');
  const coverPreview = container.querySelector('#cover-preview');
  const coverPlaceholder = container.querySelector('#cover-placeholder');
  const coverOverlay = container.querySelector('#cover-overlay');

  coverInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataUrl = await resizeBanner(file, 480);
    data.coverPhoto = dataUrl;
    saveToLocalStorage(data);

    // Update preview
    coverPreview.style.backgroundImage = `url('${dataUrl}')`;
    coverPreview.style.backgroundSize = 'cover';
    coverPreview.style.backgroundPosition = 'center';
    coverPlaceholder.classList.add('has-image');

    // Add remove button if not present
    if (!container.querySelector('#btn-remove-cover')) {
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'btn-remove-cover';
      removeBtn.id = 'btn-remove-cover';
      removeBtn.textContent = '✕ Quitar portada';
      removeBtn.addEventListener('click', () => removeCover(data, coverPreview, coverPlaceholder, removeBtn));
      coverInput.parentElement.appendChild(removeBtn);
    }
  });

  // Remove cover button (if already rendered)
  const removeCoverBtn = container.querySelector('#btn-remove-cover');
  if (removeCoverBtn) {
    removeCoverBtn.addEventListener('click', () => {
      removeCover(data, coverPreview, coverPlaceholder, removeCoverBtn);
    });
  }

  // Text fields auto-save
  FIELDS.forEach((field) => {
    const input = container.querySelector(`#field-${field}`);
    if (!input) return;
    input.addEventListener('input', () => {
      data[field] = input.value;
      saveToLocalStorage(data);

      if (field === 'description') {
        container.querySelector('#desc-count').textContent = input.value.length;
      }
    });
  });

  // Form submit → preview
  const form = container.querySelector('#editor-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate required
    if (!data.name || !data.profession || !data.phone) {
      showMissingFields(container);
      return;
    }

    onPreview(data);
  });

  // Gallery upload
  const galleryInput = container.querySelector('#gallery-input');
  if (galleryInput) {
    galleryInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      if (!data.gallery) data.gallery = [];
      const remaining = 4 - data.gallery.length;
      const toProcess = files.slice(0, remaining);

      for (const file of toProcess) {
        const dataUrl = await resizeGalleryImage(file, 300);
        data.gallery.push(dataUrl);
      }
      saveToLocalStorage(data);
      // Re-render the editor to show new photos
      initEditor(container, onPreview);
    });
  }

  // Gallery remove buttons
  container.querySelectorAll('.gallery-remove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const index = parseInt(btn.dataset.index);
      if (!data.gallery) return;
      data.gallery.splice(index, 1);
      saveToLocalStorage(data);
      initEditor(container, onPreview);
    });
  });
}

function removeCover(data, coverPreview, coverPlaceholder, removeBtn) {
  data.coverPhoto = '';
  saveToLocalStorage(data);
  coverPreview.style.backgroundImage = '';
  coverPlaceholder.classList.remove('has-image');
  if (removeBtn) removeBtn.remove();
}

function showMissingFields(container) {
  const required = ['name', 'profession', 'phone'];
  required.forEach((f) => {
    const input = container.querySelector(`#field-${f}`);
    if (!input.value.trim()) {
      input.style.borderColor = '#ef4444';
      input.addEventListener('input', () => {
        input.style.borderColor = 'transparent';
      }, { once: true });
    }
  });
}

export function getEditorData() {
  return loadFromLocalStorage() || {};
}
