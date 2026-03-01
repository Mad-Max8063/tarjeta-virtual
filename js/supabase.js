// ============================================
// supabase.js — Supabase client & API functions
// ============================================

const SUPABASE_URL = 'https://bfsttdiokdqyvwjuvcbp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmc3R0ZGlva2RxeXZ3anV2Y2JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNzc1NDUsImV4cCI6MjA4Nzk1MzU0NX0.TqmEpfSlN25f9eZjw3ULIhJ0PiHAH3NuNCQEoESPD-w';

// We'll use the Supabase CDN loaded in index.html
function getClient() {
    if (!window._supabaseClient) {
        window._supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return window._supabaseClient;
}

// ——————— ID Generation ———————

function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
        id += chars[array[i] % chars.length];
    }
    return id;
}

// ——————— Cards ———————

export async function createCard(data) {
    const db = getClient();
    const cardId = generateId(8);
    const editToken = generateId(12);

    const { data: card, error } = await db
        .from('cards')
        .insert({
            id: cardId,
            edit_token: editToken,
            name: data.name,
            profession: data.profession,
            description: data.description || '',
            phone: data.phone,
            email: data.email || '',
            location: data.location || '',
            photo_url: data.photo_url || '',
            cover_url: data.cover_url || '',
            instagram: data.instagram || '',
            linkedin: data.linkedin || '',
            website: data.website || '',
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating card:', error);
        throw error;
    }
    return card;
}

export async function getCard(cardId) {
    const db = getClient();
    const { data: card, error } = await db
        .from('cards')
        .select('*, gallery_images(*)')
        .eq('id', cardId)
        .single();

    if (error) {
        console.error('Error fetching card:', error);
        return null;
    }

    // Sort gallery by sort_order
    if (card.gallery_images) {
        card.gallery_images.sort((a, b) => a.sort_order - b.sort_order);
    }

    return card;
}

// ——————— Image Upload ———————

export async function uploadImage(file, cardId, folder = 'photos') {
    const db = getClient();
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${cardId}/${folder}/${Date.now()}.${ext}`;

    const { data, error } = await db.storage
        .from('images')
        .upload(fileName, file, {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        console.error('Error uploading image:', error);
        throw error;
    }

    const { data: urlData } = db.storage
        .from('images')
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

// Upload a data URI (base64) as a file
export async function uploadDataUri(dataUri, cardId, folder = 'photos') {
    const response = await fetch(dataUri);
    const blob = await response.blob();
    const ext = blob.type.split('/')[1] || 'jpg';
    const file = new File([blob], `${Date.now()}.${ext}`, { type: blob.type });
    return uploadImage(file, cardId, folder);
}

// ——————— Gallery ———————

export async function addGalleryImage(cardId, imageUrl, caption, sortOrder = 0) {
    const db = getClient();
    const { data, error } = await db
        .from('gallery_images')
        .insert({
            card_id: cardId,
            image_url: imageUrl,
            caption: caption || '',
            sort_order: sortOrder,
        })
        .select()
        .single();

    if (error) {
        console.error('Error adding gallery image:', error);
        throw error;
    }
    return data;
}

export async function deleteGalleryImage(imageId) {
    const db = getClient();
    const { error } = await db
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

    if (error) {
        console.error('Error deleting gallery image:', error);
        throw error;
    }
}

export async function getGalleryImages(cardId) {
    const db = getClient();
    const { data, error } = await db
        .from('gallery_images')
        .select('*')
        .eq('card_id', cardId)
        .order('sort_order');

    if (error) {
        console.error('Error fetching gallery:', error);
        return [];
    }
    return data || [];
}
