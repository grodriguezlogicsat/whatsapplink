import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from './crypto.service';


@Component({
    standalone: true,
    selector: 'app-open',
    template: `
<main class="card">
<h2>Abriendo WhatsApp…</h2>
<p class="lead">Procesando enlace cifrado.</p>
<div class="output">{{message}}</div>
</main>
`
})
export class OpenComponent implements OnInit {
    message = 'Preparando…';
    constructor(private route: ActivatedRoute, private router: Router, private crypto: CryptoService) { }


    async ngOnInit() {
        try {
            const qp = this.route.snapshot.queryParamMap;
            const c = qp.get('c');
            const iv = qp.get('iv');
            const k = qp.get('k');
            const v = qp.get('v');
            const alg = qp.get('alg');


            if (!c || !iv || !k) throw new Error('Parámetros faltantes');
            if (v !== '1' || alg !== 'A256GCM') throw new Error('Versión/algoritmo no soportado');


            const key = await this.crypto.importKeyRaw(k);
            const data = await this.crypto.decryptJson(c, iv, key) as { p: string; t: string };
            if (!data?.p) throw new Error('Datos no válidos');


            const wa = `https://wa.me/${data.p}${data.t ? `?text=${encodeURIComponent(data.t)}` : ''}`;
            this.message = `Redirigiendo a ${wa}`;
            // Pequeña espera para que el usuario vea algo si abre en la misma pestaña
            setTimeout(() => { window.location.href = wa; }, 150);
        } catch (err: any) {
            console.error(err);
            this.message = `No se pudo abrir el enlace cifrado. ${err?.message || ''}`;
        }
    }
}