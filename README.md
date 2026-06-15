# 🏴‍☠️ GrandLineLog

Un marcador de progreso para ver **One Piece** con temática pirata. Lleva la cuenta de los capítulos vistos y marca sagas, películas, OVAs, especiales, cortos y omakes a lo largo de toda la línea de visionado cronológica.

Página 100 % estática (HTML + CSS + JavaScript *vanilla*, sin dependencias ni build). El progreso se guarda solo en el navegador con `localStorage`.

> *"El que será el Rey de los Piratas… ¡eres tú!"* ⚓

---

## ✨ Características

- **Dos formas de contar el progreso:**
  - 📅 **Diario** — eliges una fecha de inicio (y opcionalmente desde qué capítulo) y cada día suma 1 capítulo automáticamente.
  - ✍️ **Manual** — escribes el número exacto de capítulos que llevas.
- **Marcador grande y visible**: capítulos vistos, barra de progreso, % y conteo de *sagas* y *extras* completados. La saga en curso se resalta con su propia barra parcial y un ⛵ "estás aquí".
- **Auto-marcado por tipo** (en ⚙️ Ajustes): sagas, películas, OVAs, especiales, cortos y omakes se pueden marcar solos al pasar su episodio en la línea de visionado. Con el auto desactivado, marcas/desmarcas tú a mano (útil si te saltaste algo). Al desactivar, se conserva lo ya marcado.
- **🎨 Dos temas conmutables:**
  - *Grand Line* — mapa de viaje con carteles **Wanted** que se sellan al completarse.
  - *Bitácora* — diario del capitán con Log Pose y estética de pergamino.
- **💾 Copia de seguridad**: exporta/importa tu progreso como archivo `.json` o como código de texto, para tener backup o moverlo a otro navegador/PC.
- **🧭 Botón "Ir a la saga actual"** que aparece solo cuando la saga en curso no está a la vista.

---

## 🚀 Uso

No necesita instalación ni servidor: **abre `index.html`** en tu navegador (doble clic).

> Requiere conexión solo para cargar las tipografías de Google Fonts; el resto funciona sin internet.

---

## ➕ Añadir una saga futura

Cuando salga una saga nueva, edita **`data.js`** y añade una línea en su lugar cronológico dentro del array `CONTENT`:

```js
{ id:'s-nueva-saga', type:'saga', title:'Saga de ...', start:1234, end:1260 },
```

La saga en emisión (**Elbaph**) tiene `end: null`, así que usa automáticamente el último episodio emitido. Ese número (`DEFAULT_LATEST_EPISODE`) se ajusta en `data.js` o desde el propio botón de **Ajustes**. Todo está comentado al inicio del archivo.

---

## 📂 Estructura

```
GrandLineLog/
├── index.html   # estructura de la página
├── styles.css   # los dos temas visuales
├── app.js       # lógica de conteo, marcado y guardado
└── data.js      # lista de todo el contenido (aquí se añaden sagas)
```

## 🛠️ Tecnología

HTML5 · CSS3 (variables, animaciones) · JavaScript ES6+ · `localStorage` · `IntersectionObserver`.

---

*One Piece* es obra de Eiichiro Oda. Este es un proyecto personal de fan, sin ánimo de lucro.
