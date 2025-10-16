import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CryptoService } from '../crypto.service';
import { CommonModule } from '@angular/common';



@Component({
    standalone: true,
    selector: 'app-generator',
    imports: [FormsModule, CommonModule],
    templateUrl: './generator.component.html',
    styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent {
    phone = '';
    message = '';
    preview = 'El enlace aparecerá aquí…';
    status = '';
    statusClass = '';


    emojiOpen = signal(false);
    emojiQuery = '';


    EMOJIS = [
        { e: '😀', k: 'sonrisa feliz smile' }, { e: '😁', k: 'sonrisa ojos sonrientes' }, { e: '😂', k: 'risa lagrimas lol' },
        { e: '🤣', k: 'carcajada' }, { e: '😊', k: 'contento blush' }, { e: '😍', k: 'amor enamorado' },
        { e: '😘', k: 'beso' }, { e: '😎', k: 'cool gafas' }, { e: '🤩', k: 'estrellas' }, { e: '😇', k: 'angel' },
        { e: '🤗', k: 'abrazo' }, { e: '😴', k: 'dormido' }, { e: '🤔', k: 'pensando' }, { e: '😅', k: 'nervioso' },
        { e: '🙂', k: 'ligera sonrisa' }, { e: '🙃', k: 'al reves' }, { e: '😉', k: 'guiño' }, { e: '🥳', k: 'fiesta' },
        { e: '😭', k: 'llorar' }, { e: '😢', k: 'triste' }, { e: '😡', k: 'enojo' }, { e: '😱', k: 'susto' },
        { e: '❤️', k: 'corazon rojo love' }, { e: '💙', k: 'corazon azul' }, { e: '💜', k: 'corazon morado' },
        { e: '👍', k: 'pulgar ok' }, { e: '👏', k: 'aplauso' }, { e: '🙏', k: 'gracias' }, { e: '🔥', k: 'fuego' },
        { e: '✨', k: 'brillos' }, { e: '🎉', k: 'confeti fiesta' }, { e: '🎂', k: 'torta cumple' },
        { e: '🍕', k: 'pizza' }, { e: '☕', k: 'cafe' }, { e: '🚀', k: 'cohete' }, { e: '✅', k: 'ok check' }
    ];



    constructor(private crypto: CryptoService) { }


    sanitizePhone(raw: string): string {
        return String(raw || '').replace(/\D+/g, '');
    }
    isValidE164Digits(d: string): boolean {
        return /^\d{6,15}$/.test(d);
    }


    updatePreview(): void {
        const digits = this.sanitizePhone(this.phone);
        if (!digits) { this.preview = 'El enlace aparecerá aquí…'; this.status = ''; this.statusClass = ''; return; }
        if (!this.isValidE164Digits(digits)) {
            this.preview = 'Número inválido: debe tener 6–15 dígitos.';
            this.status = 'Número no válido. Debe tener entre 6 y 15 dígitos (incluye el código de país).';
            this.statusClass = 'status bad';
            return;
        }
        this.status = 'Número válido.'; this.statusClass = 'status ok';
        const url = `https://wa.me/${digits}${this.message ? `?text=${encodeURIComponent(this.message)}` : ''}`;
        this.preview = url;
    }


    async buildEncryptedLink(): Promise<string> {
        const digits = this.sanitizePhone(this.phone);
        if (!this.isValidE164Digits(digits)) { this.updatePreview(); return ''; }


        const payload = { p: digits, t: this.message || '' };
        const key = await this.crypto.generateKey();
        const { c, iv, v, alg } = await this.crypto.encryptJson(payload, key);
        const k = await this.crypto.exportKeyRaw(key);


        // Usamos hash routing: /#/open?c=...&iv=...&k=...
        const base = `${location.origin}${location.pathname}#/open`;
        const enc = new URLSearchParams({ c, iv, k, v: String(v), alg });
        const url = `${base}?${enc.toString()}`;
        this.preview = url;
        navigator.vibrate?.(8);
        return url;
    }


    async openWhatsApp(): Promise<void> {
        const url = await this.buildEncryptedLink();
        if (!url) return;
        window.open(url, '_blank', 'noopener');
    }


    async copyLink(): Promise<void> {
        const url = await this.buildEncryptedLink();
        if (!url) return;
        try { await navigator.clipboard.writeText(url); this.preview = `${url}\n(copiado al portapapeles)`; }
        catch { this.preview = `${url}\n(No se pudo copiar automáticamente)`; }
    }


    clear(): void {
        this.phone = '';
        this.message = '';
        this.status = '';
        this.statusClass = '';
        this.preview = 'El enlace aparecerá aquí…';
        this.emojiQuery = '';
    }


    filteredEmojis() {
        const q = (this.emojiQuery || '').trim().toLowerCase();
        if (!q) return this.EMOJIS;
        return this.EMOJIS.filter(x => x.k.includes(q) || x.e === q);
    }


    insertEmoji(e: string) {
        const area = document.getElementById('messageArea') as HTMLTextAreaElement | null;
        if (!area) { this.message += e; return; }
        area.focus();
        const start = area.selectionStart ?? this.message.length;
        const end = area.selectionEnd ?? this.message.length;
        const before = this.message.slice(0, start);
        const after = this.message.slice(end);
        this.message = before + e + after;
        queueMicrotask(() => { const caret = start + e.length; area.setSelectionRange(caret, caret); });
        this.updatePreview();
    }
}