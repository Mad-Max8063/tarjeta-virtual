// ============================================
// utils.js — Encoding, decoding & helpers
// ============================================

export function encodeData(obj) {
  const json = JSON.stringify(obj);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeData(str) {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json);
  } catch (e) {
    console.error('Error decoding data:', e);
    return null;
  }
}

export function generateWhatsAppLink(url, name, profession) {
  const message = `👋 ¡Hola! Te comparto mi tarjeta profesional:\n\n*${name}*\n${profession}\n\n🔗 ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function sanitize(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function saveToLocalStorage(data) {
  localStorage.setItem('virtualCardData', JSON.stringify(data));
}

export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem('virtualCardData');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getCardUrl(data) {
  const encoded = encodeData(data);
  return `${window.location.origin}${window.location.pathname}#card/${encoded}`;
}

export function resizeBanner(file, maxWidth = 480) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function resizeGalleryImage(file, maxWidth = 300) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.55));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function resizeImage(file, maxSize = 200) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext('2d');

        // Crop to square center
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.beginPath();
        ctx.arc(maxSize / 2, maxSize / 2, maxSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, maxSize, maxSize);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}
