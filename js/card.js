// ============================================
// card.js — Card rendering (Preview + Landing)
// ============================================

import { getCardUrl, getEditUrl, generateWhatsAppLink, sanitize } from './utils.js';
import { downloadVCard } from './vcard.js';

// SVG Icons
const ICONS = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>',
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
  location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
  website: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
};

export function renderPreview(container, data, onEdit, onShare) {
  const cardUrl = data._id ? getCardUrl(data._id) : '';
  const editUrl = (data._id && data._editToken) ? getEditUrl(data._id, data._editToken) : '';
  const waLink = generateWhatsAppLink(cardUrl, data.name, data.profession);

  container.innerHTML = `
    <button class="back-btn" id="btn-back-edit">
      ${ICONS.back} Volver
    </button>

    ${buildCardHTML(data)}

  <div class="btn-group" style="margin-top: 24px;">
    <div class="share-box">
      <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
      <input type="text" value="${cardUrl}" readonly id="share-url">
        <button class="btn-copy" id="btn-copy">Copiar</button>
    </div>

    <a href="${waLink}" target="_blank" rel="noopener" class="btn btn-whatsapp" id="btn-share-wa">
      ${ICONS.whatsapp}
      Compartir por WhatsApp
    </a>

    <div class="edit-link-section">
      <div class="section-label" style="font-size: 0.7rem; margin-bottom: 8px;">\u270f\ufe0f Link de edici\u00f3n (envialo al profesional)</div>
      <div class="share-box">
        <svg class="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        <input type="text" value="${editUrl}" readonly id="edit-url">
          <button class="btn-copy" id="btn-copy-edit">Copiar</button>
      </div>
      <p class="section-hint" style="margin-top: 6px; font-size: 0.68rem;">El profesional podr\u00e1 agregar fotos de trabajos antes de compartir su tarjeta.</p>
    </div>

    <button class="btn btn-secondary" id="btn-edit-again">
      ${ICONS.edit} Editar datos
    </button>
  </div>
  `;

  // Events
  container.querySelector('#btn-back-edit').addEventListener('click', onEdit);
  container.querySelector('#btn-edit-again').addEventListener('click', onEdit);

  // Copy share URL
  container.querySelector('#btn-copy').addEventListener('click', () => {
    const input = container.querySelector('#share-url');
    navigator.clipboard.writeText(input.value).then(() => {
      const btn = container.querySelector('#btn-copy');
      btn.textContent = '\u2713 Copiado';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied'); }, 2000);
    });
  });

  // Copy edit URL
  container.querySelector('#btn-copy-edit').addEventListener('click', () => {
    const input = container.querySelector('#edit-url');
    navigator.clipboard.writeText(input.value).then(() => {
      const btn = container.querySelector('#btn-copy-edit');
      btn.textContent = '\u2713 Copiado';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = 'Copiar'; btn.classList.remove('copied'); }, 2000);
    });
  });

  wireGalleryToggle(container);
}

export function renderLanding(container, data) {
  container.innerHTML = `
    ${buildCardHTML(data)}

  <div style="padding: 0 4px;">
    <!-- Booking CTA (if has booking URL) -->
    ${data.bookingUrl ? `
    <div class="btn-group" style="margin-top: 24px;">
      <a href="${sanitize(data.bookingUrl)}" target="_blank" rel="noopener" class="btn btn-booking" id="btn-booking">
        ${ICONS.calendar}
        Sacá tu turno
      </a>
    </div>
    ` : ''}

    <!-- Save Contact -->
    <div class="btn-group" style="margin-top: ${data.bookingUrl ? '12px' : '24px'};">
      <button class="btn btn-save-contact" id="btn-save-contact">
        ${ICONS.save}
        Guardar contacto
      </button>
    </div>

    <!-- Contact Save Confirmation Modal -->
    <div class="save-modal-overlay" id="save-modal-overlay">
      <div class="save-modal">
        <div class="save-modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32">
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
        </div>
        <h3 class="save-modal-title">Guardar a <strong>${sanitize(data.name)}</strong></h3>
        <p class="save-modal-subtitle">Se descargará un archivo de contacto (.vcf) que podés abrir para agregarlo a tu agenda</p>
        <div class="save-modal-info">
          <span>📱 ${sanitize(data.name)}</span>
          <span>💼 ${sanitize(data.profession)}</span>
          ${data.phone ? `<span>📞 ${sanitize(data.phone)}</span>` : ''}
        </div>
        <div class="save-modal-actions">
          <button class="btn btn-save-confirm" id="btn-save-confirm">
            ${ICONS.save}
            Sí, guardar contacto
          </button>
          <button class="btn btn-save-cancel" id="btn-save-cancel">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="save-success" id="save-success">
      <div class="check-circle">${ICONS.check}</div>
      <p>¡Contacto descargado!<br>Abrilo para guardar en tu agenda</p>
    </div>

    ${!data.isPremium ? `
    <div class="promo-footer">
      <a href="https://wa.me/5491162621406?text=${encodeURIComponent('Hola! Quiero mi tarjeta virtual profesional')}" target="_blank" rel="noopener">
        ¿Te gusta esta card? · Solicitá la tuya a <strong>Max Devs Solutions</strong>
      </a>
    </div>` : ''}
  </div>
  `;

  // Save contact button → show modal instead of downloading directly
  container.querySelector('#btn-save-contact').addEventListener('click', () => {
    const overlay = container.querySelector('#save-modal-overlay');
    overlay.classList.add('show');
  });

  // Modal confirm → download vCard
  container.querySelector('#btn-save-confirm').addEventListener('click', () => {
    downloadVCard(data);
    const overlay = container.querySelector('#save-modal-overlay');
    overlay.classList.remove('show');
    const btn = container.querySelector('#btn-save-contact');
    const success = container.querySelector('#save-success');
    btn.style.display = 'none';
    success.classList.add('show');
  });

  // Modal cancel
  container.querySelector('#btn-save-cancel').addEventListener('click', () => {
    const overlay = container.querySelector('#save-modal-overlay');
    overlay.classList.remove('show');
  });

  // Click outside modal to close
  container.querySelector('#save-modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.currentTarget.classList.remove('show');
    }
  });

  wireGalleryToggle(container);
}

function normalizeGallery(gallery) {
  if (!gallery || !gallery.length) return [];
  return gallery.map(item => {
    if (typeof item === 'string') return { src: item, caption: '' };
    return item;
  });
}

function buildCardHTML(data) {
  const hasAvatar = data.photo && !data.photo.includes('default-avatar');
  const avatarSrc = data.photo || 'assets/default-avatar.svg';
  const cleanPhone = (data.phone || '').replace(/[^+\d]/g, '');

  let contactChips = '';
  let chipIndex = 1;

  if (data.phone) {
    contactChips += `
      <a href="tel:${cleanPhone}" class="contact-chip stagger-${chipIndex++}">
        <div class="chip-icon phone">${ICONS.phone}</div>
        <div>
          <span class="chip-label">Teléfono</span>
          <span class="chip-value">${sanitize(data.phone)}</span>
          <span class="chip-action">Llamar ahora</span>
        </div>
      </a>`;
  }

  if (data.email) {
    contactChips += `
      <a href="mailto:${sanitize(data.email)}" class="contact-chip stagger-${chipIndex++}">
        <div class="chip-icon email">${ICONS.email}</div>
        <div>
          <span class="chip-label">Email</span>
          <span class="chip-value">${sanitize(data.email)}</span>
          <span class="chip-action">Enviar correo</span>
        </div>
      </a>`;
  }

  if (data.phone) {
    contactChips += `
      <a href="https://wa.me/${cleanPhone}" target="_blank" rel="noopener" class="contact-chip stagger-${chipIndex++}">
        <div class="chip-icon whatsapp">${ICONS.whatsapp}</div>
        <div>
          <span class="chip-label">WhatsApp</span>
          <span class="chip-value">Enviar mensaje</span>
          <span class="chip-action">Mensaje directo</span>
        </div>
      </a>`;
  }

  if (data.location) {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location)}`;
    contactChips += `
      <a href="${mapsUrl}" target="_blank" rel="noopener" class="contact-chip stagger-${chipIndex++}">
        <div class="chip-icon location">${ICONS.location}</div>
        <div>
          <span class="chip-label">Ubicación</span>
          <span class="chip-value">${sanitize(data.location)}</span>
          <span class="chip-action">Ver en mapa</span>
        </div>
      </a>`;
  }

  let socialLinks = '';
  if (data.instagram || data.linkedin || data.website) {
    let links = '';
    if (data.instagram) {
      links += `<a href="https://instagram.com/${data.instagram.replace('@', '')}" target="_blank" rel="noopener" class="social-link" title="Instagram">${ICONS.instagram}</a>`;
    }
    if (data.linkedin) {
      links += `<a href="${sanitize(data.linkedin)}" target="_blank" rel="noopener" class="social-link" title="LinkedIn">${ICONS.linkedin}</a>`;
    }
    if (data.website) {
      links += `<a href="${sanitize(data.website)}" target="_blank" rel="noopener" class="social-link" title="Sitio web">${ICONS.website}</a>`;
    }
    socialLinks = `<div class="social-links">${links}</div>`;
  }

  // Booking button (only if bookingUrl is set)
  let bookingChip = '';
  if (data.bookingUrl) {
    bookingChip = `
      <a href="${sanitize(data.bookingUrl)}" target="_blank" rel="noopener" class="contact-chip booking-chip stagger-${chipIndex++}">
        <div class="chip-icon booking">${ICONS.calendar}</div>
        <div>
          <span class="chip-label">Turnos</span>
          <span class="chip-value">Reservá tu turno online</span>
          <span class="chip-action">Sacar turno</span>
        </div>
      </a>`;
  }

  // Allow data: URIs, Supabase Storage URLs, and local assets for cover photo
  const safeCover = data.coverPhoto && (
    data.coverPhoto.startsWith('data:image/') ||
    data.coverPhoto.startsWith('assets/') ||
    data.coverPhoto.startsWith('https://')
  ) ? data.coverPhoto : '';

  const coverStyle = safeCover
    ? `background-image: url('${safeCover}'); background-size: cover; background-position: center;`
    : '';

  // Hero mode: no avatar + has cover = expanded banner with name overlay
  const isHero = !hasAvatar && safeCover;
  const coverClass = isHero
    ? 'card-banner has-cover hero-banner'
    : safeCover ? 'card-banner has-cover' : 'card-banner';
  const cardClass = isHero ? 'card hero-mode' : 'card';

  // Gallery section (collapsible, with captions)
  const gallery = normalizeGallery(data.gallery);
  let gallerySection = '';
  if (gallery.length > 0) {
    const galleryItems = gallery.map((item, i) => {
      const caption = item.caption ? `<div class="gallery-caption">${sanitize(item.caption)}</div>` : '';
      return `<div class="gallery-item"><img src="${item.src}" alt="${item.caption || 'Trabajo ' + (i + 1)}" loading="lazy">${caption}</div>`;
    }).join('');

    gallerySection = `
      <div class="gallery-section">
        <button type="button" class="gallery-toggle" id="gallery-toggle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          Ver trabajos realizados (${gallery.length})
          <svg class="toggle-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="gallery-carousel collapsed" id="gallery-carousel">
          <div class="gallery-scroll">
            ${galleryItems}
          </div>
        </div>
      </div>`;
  }

  // Hero mode: name overlay on banner, no avatar shown
  if (isHero) {
    return `
    <div class="${cardClass}">
      <div class="${coverClass}" style="${coverStyle}">
        <div class="hero-overlay">
          <h2 class="hero-name">${sanitize(data.name)}</h2>
          <p class="hero-profession">${sanitize(data.profession)}</p>
        </div>
      </div>
      <div class="card-body">
        ${data.description ? `<p class="card-description">${sanitize(data.description)}</p>` : ''}
        ${data.location ? `
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location)}" target="_blank" rel="noopener" class="card-location">
            ${ICONS.location} ${sanitize(data.location)}
          </a>` : ''}

        <div class="divider"></div>

        <div class="contact-chips">
          ${contactChips}
          ${bookingChip}
        </div>

        ${socialLinks}

        ${gallerySection}
      </div>
    </div>`;
  }

  // Normal mode with avatar
  return `
    <div class="${cardClass}">
      <div class="${coverClass}" style="${coverStyle}"></div>
      <div class="card-avatar">
        <img src="${avatarSrc}" alt="${sanitize(data.name)}">
      </div>
      <div class="card-body">
        <h2 class="card-name">${sanitize(data.name)}</h2>
        <p class="card-profession">${sanitize(data.profession)}</p>
        ${data.description ? `<p class="card-description">${sanitize(data.description)}</p>` : ''}
        ${data.location ? `
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location)}" target="_blank" rel="noopener" class="card-location">
            ${ICONS.location} ${sanitize(data.location)}
          </a>` : ''}

        <div class="divider"></div>

        <div class="contact-chips">
          ${contactChips}
          ${bookingChip}
        </div>

        ${socialLinks}

        ${gallerySection}
      </div>
    </div>`;
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function wireGalleryToggle(container) {
  const toggle = container.querySelector('#gallery-toggle');
  const carousel = container.querySelector('#gallery-carousel');
  if (toggle && carousel) {
    toggle.addEventListener('click', () => {
      carousel.classList.toggle('collapsed');
      toggle.classList.toggle('open');
    });
  }
}
