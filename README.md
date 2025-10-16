# 🚀 Generador de Enlaces de WhatsApp (Cifrado + Emojis) — Angular ⚡️

Un proyecto **Angular moderno y standalone** que te permite generar **enlaces de WhatsApp cifrados**, evitando que el número de teléfono y el mensaje sean visibles a simple vista. Incluye además un **selector de emojis**, interfaz atractiva y un flujo completo de **encriptado → compartido → desencriptado → redirección a WhatsApp**.

---

## 🧠 ¿Cómo funciona?
1. Ingresas tu **número de teléfono (formato internacional)** y el **mensaje**.
2. La app cifra ambos valores usando **AES-GCM de 256 bits** (nativo del navegador).
3. Se genera un enlace cifrado, por ejemplo:
   ```text
   https://tuapp.com/#/open?c=Af4x...&iv=Q2...&k=O_...
   ```
4. Cuando alguien abre ese enlace, la app desencripta la información en el navegador y redirige a:
   ```text
   https://wa.me/59891234567?text=Hola%20😀
   ```

El número y el mensaje **no se exponen directamente** en el enlace compartido.

---

## ✨ Características principales
✅ Interfaz moderna y responsive (basada en el estilo original de WhatsApp).  
✅ Selector de emojis con búsqueda 🔍.  
✅ Validación del número en formato **E.164** (6–15 dígitos).  
✅ Generación de enlaces cifrados AES-GCM (256 bits).  
✅ Redirección automática al abrir el enlace.  
✅ Compatible con **hosting estático** (usa hash routing).  
✅ 100 % **TypeScript y Angular standalone**.

---

## 🧩 Tecnologías
- **Angular 18+** (standalone components)
- **TypeScript 5+**
- **Web Crypto API (AES-GCM)**
- **Routing por hash (#/open)** para compatibilidad total con GitHub Pages, Netlify, etc.

---

## 🛠️ Instalación y uso

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/wa-enlace-cifrado.git
   cd wa-enlace-cifrado
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar el proyecto:**
   ```bash
   ng serve -o
   ```

4. **Usar la aplicación:**
   - Ingresa el número y mensaje.
   - Presiona **“Generar enlace cifrado”**.
   - Copia o abre el enlace generado.
   - Al abrirlo en otra pestaña o dispositivo, redirige automáticamente a WhatsApp con tu mensaje.

---

## 🔐 Seguridad y limitaciones
- La clave de cifrado se incluye dentro del enlace para que el descifrado sea posible **sin backend**.  
  ⚠️ Esto significa que **quien posea el enlace completo puede verlo descifrado**.  
  Sin embargo, evita exposición directa del número o texto a simple vista o en analytics.
- Si deseas confidencialidad real, implementa un **servidor intermedio** que guarde las claves temporalmente o use tokens efímeros.

---

## 📂 Estructura principal
```
src/
├── app/
│   ├── app.component.ts       # Raíz del proyecto
│   ├── app.routes.ts          # Rutas principales
│   ├── crypto.service.ts      # Cifrado/descifrado AES-GCM
│   ├── generator.component.*  # Formulario principal + emojis + cifrado
│   └── open.component.ts      # Desencripta y redirige a WhatsApp
├── index.html
├── main.ts
└── styles.css
```

---

## 💬 Ejemplo visual
🔹 Pantalla principal con selector de emojis:  
![Pantalla principal](docs/demo-main.png)

🔹 Vista de redirección cifrada:  
![Redirección](docs/demo-open.png)

---

## 🌐 Despliegue rápido
Puedes publicarlo **sin backend** en:
- GitHub Pages
- Netlify
- Cloudflare Pages
- Vercel (SPA estática)

Solo asegúrate de mantener el **hash routing** (`#/open`).

---

## 🤝 Contribuciones
¡Toda mejora es bienvenida! 🙌
1. Haz un fork.
2. Crea una rama: `git checkout -b feature/nueva-funcion`.
3. Envía un PR.

---

## 🧾 Licencia
MIT © 2025 — Desarrollado con ❤️ y TypeScript.

---

> **Autor:** Tu nombre o alias  
> **Proyecto:** Generador de Enlaces de WhatsApp Cifrados — Angular