import { Injectable } from '@angular/core';


// Utilidades Base64 URL-Safe
function b64uEncode(bytes: Uint8Array): string {
let str = btoa(String.fromCharCode(...bytes));
return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function b64uDecode(b64u: string): Uint8Array {
let str = b64u.replace(/-/g, '+').replace(/_/g, '/');
const pad = str.length % 4; if (pad) str += '='.repeat(4 - pad);
const bin = atob(str);
const out = new Uint8Array(bin.length);
for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
return out;
}


@Injectable({ providedIn: 'root' })
export class CryptoService {
private encoder = new TextEncoder();
private decoder = new TextDecoder();


async generateKey(): Promise<CryptoKey> {
return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}


async exportKeyRaw(key: CryptoKey): Promise<string> {
const raw = new Uint8Array(await crypto.subtle.exportKey('raw', key));
return b64uEncode(raw);
}
async importKeyRaw(rawB64u: string): Promise<CryptoKey> {
const raw = b64uDecode(rawB64u);
return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
}


async encryptJson(obj: unknown, key: CryptoKey): Promise<{ c: string; iv: string; alg: string; v: number; }>{
const iv = crypto.getRandomValues(new Uint8Array(12));
const alg = { name: 'AES-GCM', iv };
const payload = this.encoder.encode(JSON.stringify(obj));
const cipher = new Uint8Array(await crypto.subtle.encrypt(alg, key, payload));
return { c: b64uEncode(cipher), iv: b64uEncode(iv), alg: 'A256GCM', v: 1 };
}


async decryptJson(c: string, iv: string, key: CryptoKey): Promise<any> {
const cipher = b64uDecode(c);
const ivBytes = b64uDecode(iv);
const alg = { name: 'AES-GCM', iv: ivBytes } as AesGcmParams;
const plain = new Uint8Array(await crypto.subtle.decrypt(alg, key, cipher));
return JSON.parse(this.decoder.decode(plain));
}
}