const SIGN_API_BASE = import.meta.env.VITE_SIGN_API_URL || 'http://127.0.0.1:8000';

async function safeJson(response) {
    const data = await response.json();
    if (!response.ok || data?.ok === false) {
        throw new Error(data?.error || 'Sign model request failed');
    }
    return data;
}

export async function fetchSignModelMeta() {
    const response = await fetch(`${SIGN_API_BASE}/health`);
    return safeJson(response);
}

export async function predictSignFromDataUrl(imageDataUrl) {
    const response = await fetch(`${SIGN_API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl })
    });
    return safeJson(response);
}

export { SIGN_API_BASE };
