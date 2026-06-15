/* =====================================================================
   ONE PIECE · BITÁCORA DE VIAJE — DATOS DE CONTENIDO
   =====================================================================

   ► CÓMO AÑADIR UNA SAGA NUEVA (cuando salga en el futuro):
     Copia una línea de tipo "saga" y pégala en su lugar cronológico
     dentro del array CONTENT. Cada entrada es un objeto:

       { id:'s-mi-saga', type:'saga', title:'Saga de ...', start:1200, end:1234 }

     - id    : identificador ÚNICO y estable (no lo cambies luego, porque
               con él se guarda si la tienes marcada a mano). Usa un slug.
     - type  : 'saga' | 'movie' | 'ova' | 'special' | 'short' | 'omake'
     - title : lo que se muestra.
     - sub   : (opcional) subtítulo / título original.
     - start,end : (solo SAGAS) primer y último episodio.
                   Si la saga está EN EMISIÓN, pon  end: null  y se usará
                   automáticamente "el último episodio emitido" (ajustable).
     - after : (solo películas/ovas/especiales/cortos/omakes) el episodio
               TRAS EL CUAL se ve ese extra en la línea de visionado.

     El orden del array = el orden en que se pinta. Mantenlo cronológico.

   ► ÚLTIMO EPISODIO EMITIDO:
     Actualiza DEFAULT_LATEST_EPISODE con el último episodio que exista.
     (También se puede cambiar desde el botón "Ajustes" sin tocar código.)
   ===================================================================== */

const DEFAULT_LATEST_EPISODE = 1160; // ← actualízalo cuando salgan más episodios

/* Etiquetas legibles y emoji por tipo (para la interfaz y los ajustes). */
const TYPE_INFO = {
  saga:    { label: 'Saga',     plural: 'Sagas',     icon: '🏴‍☠️' },
  movie:   { label: 'Película', plural: 'Películas', icon: '🎬' },
  ova:     { label: 'OVA',      plural: 'OVAs',      icon: '💿' },
  special: { label: 'Especial', plural: 'Especiales',icon: '📺' },
  short:   { label: 'Corto',    plural: 'Cortos',    icon: '🎞️' },
  omake:   { label: 'Omake',    plural: 'Omakes',    icon: '✨' },
};

const CONTENT = [
  { id:'s-romance-dawn', type:'saga', title:'Saga de Romance Dawn', start:1, end:3 },
  { id:'s-buggy',        type:'saga', title:'Saga de Buggy', start:4, end:8 },
  { id:'ova-ganzack',    type:'ova',  title:'Derrotar al pirata Ganzack', sub:'OVA', after:8 },

  { id:'s-kuro',         type:'saga', title:'Saga del Capitán Kuro', start:9, end:18 },
  { id:'m-1',            type:'movie',title:'Película 1 · One Piece, La Película', sub:'ONE PIECE: The Movie', after:18 },

  { id:'s-krieg',        type:'saga', title:'Saga de Don Krieg', start:19, end:30 },
  { id:'s-arlong',       type:'saga', title:'Saga de Arlong Park', start:31, end:45 },
  { id:'sp-tv1',         type:'special', title:'Especial TV 1 · Aventura en el ombligo del mar', sub:'Umi no Heso no Daibouken-hen', after:45 },

  { id:'s-buggy-crew',   type:'saga', title:'Saga de la tripulación de Buggy', start:46, end:47 },
  { id:'s-loguetown',    type:'saga', title:'Saga de Loguetown', start:48, end:53 },
  { id:'m-2',            type:'movie',title:'Película 2 · La aventura de la Isla del Reloj', sub:'Clockwork Island Adventure', after:53 },

  { id:'s-dragon',       type:'saga', title:'Saga del dragón milenario', start:54, end:61 },
  { id:'sh-jango',       type:'short',title:'El carnaval de baile de Jango', sub:"Jango's Dance Carnival", after:61 },

  { id:'s-whiskey',      type:'saga', title:'Saga de Whiskey Peak', start:62, end:67 },
  { id:'s-coby',         type:'saga', title:'Saga de Coby y Helmeppo', start:68, end:69 },
  { id:'s-little-garden',type:'saga', title:'Saga de Little Garden', start:70, end:77 },
  { id:'s-drum',         type:'saga', title:'Saga de la Isla de Drum', start:78, end:91 },
  { id:'sh-soccer',      type:'short',title:'¡El rey del fútbol de los sueños!', after:91 },
  { id:'m-3',            type:'movie',title:'Película 3 · El reino de Chopper en la isla de los animales extraños', sub:'Chinjuu-jima no Chopper Oukoku', after:91 },

  { id:'s-arabasta',     type:'saga', title:'Saga de Arabasta', start:92, end:130 },
  { id:'m-4',            type:'movie',title:'Película 4 · La aventura sin salida', sub:'Dead End no Bouken', after:130 },

  { id:'s-mugiwara',     type:'saga', title:'Saga de los Sombrero de Paja', start:131, end:135 },
  { id:'s-zenny',        type:'saga', title:'Saga de Zenny', start:136, end:138 },
  { id:'sp-tv2',         type:'special', title:'Especial TV 2 · ¡Ábrete, gran mar! El enorme sueño del padre', sub:'Oounabara ni Hirake! Dekkai Dekkai Chichi no Yume!', after:138 },

  { id:'s-niebla',       type:'saga', title:'Saga de la niebla arcoíris', start:139, end:143 },
  { id:'m-5',            type:'movie',title:'Película 5 · La espada sagrada maldita', sub:'Norowareta Seiken', after:143 },

  { id:'s-jaya',         type:'saga', title:'Saga de Jaya', start:144, end:152 },
  { id:'s-skypiea',      type:'saga', title:'Saga de Skypiea', start:153, end:195 },
  { id:'s-g8',           type:'saga', title:'Saga del G-8', start:196, end:206 },
  { id:'s-davy',         type:'saga', title:'Saga Davy Back Fight', start:207, end:219 },
  { id:'sh-baseball',    type:'short',title:'¡Objetivo! El rey del béisbol pirata', after:219 },
  { id:'sp-tv3',         type:'special', title:'Especial TV 3 · ¡Protege! El último gran escenario', sub:'Mamore! Saigo no Oobutai', after:219 },

  { id:'s-oceans-dream', type:'saga', title:"Saga Ocean's Dream", start:220, end:224 },
  { id:'m-6',            type:'movie',title:'Película 6 · El Barón Omatsuri y la isla secreta', sub:'Omatsuri Danshaku to Himitsu no Shima', after:224 },

  { id:'s-aokiji',       type:'saga', title:'Saga de Aokiji', start:225, end:228 },
  { id:'m-7',            type:'movie',title:'Película 7 · El soldado mecánico gigante del castillo Karakuri', sub:'Karakuri-jou no Mecha Kyohei', after:228 },

  { id:'s-water7',       type:'saga', title:'Saga de Water 7', start:229, end:252 },
  { id:'sp-tv4',         type:'special', title:'Especial TV 4 · Las memorias del detective jefe Sombrero de Paja Luffy', sub:'Mugiwara no Luffy Oyabun Torimonochou', after:252 },

  { id:'s-umi-ressha',   type:'saga', title:'Saga del Umi Ressha', start:253, end:263 },
  { id:'s-enies',        type:'saga', title:'Saga de Enies Lobby', start:264, end:312 },
  { id:'m-8',            type:'movie',title:'Película 8 · Episode of Alabasta: La princesa del desierto y los piratas', sub:'Episode of Alabasta', after:312 },

  { id:'s-sunny',        type:'saga', title:'Saga del Thousand Sunny', start:313, end:325 },
  { id:'om-1-5',         type:'omake',title:'Omakes 1 al 5', after:325 },
  { id:'m-9',            type:'movie',title:'Película 9 · Episode of Chopper Plus: Floración en invierno, el milagro del cerezo', sub:'Episode of Chopper Plus', after:325 },

  { id:'s-ice-hunter',   type:'saga', title:'Saga de Ice Hunter', start:326, end:336 },
  { id:'s-thriller',     type:'saga', title:'Saga de Thriller Bark', start:337, end:381 },
  { id:'ova-romance-dawn',type:'ova', title:'Romance Dawn Story', sub:'OVA', after:381 },

  { id:'s-spa',          type:'saga', title:'Saga de Spa Island', start:382, end:384 },
  { id:'s-tobiuo',       type:'saga', title:'Saga de los Tobiuo Riders', start:385, end:389 },
  { id:'s-sabaody',      type:'saga', title:'Saga del Archipiélago Sabaody', start:390, end:407 },
  { id:'s-amazon',       type:'saga', title:'Saga de Amazon Lily', start:408, end:421 },
  { id:'s-impel',        type:'saga', title:'Saga de Impel Down', start:422, end:456 },
  { id:'ova-ep0',        type:'ova',  title:'Episodio 0: Strong World', sub:'OVA', after:429 },
  { id:'m-10',           type:'movie',title:'Película 10 · Strong World', sub:'ONE PIECE FILM: STRONG WORLD', after:429 },

  { id:'s-marineford',   type:'saga', title:'Saga de Marineford', start:457, end:490 },
  { id:'m-11',           type:'movie',title:'Película 11 · Mugiwara Chase', sub:'ONE PIECE 3D: Mugiwara Chase', after:490 },

  { id:'s-3d2y',         type:'saga', title:'Saga 3D2Y', start:491, end:516 },
  { id:'s-reunion',      type:'saga', title:'Saga de la reunión de los Sombrero de Paja', start:517, end:522 },
  { id:'sp-nami',        type:'special', title:'Episodio de Nami', sub:'Episode of Nami', after:522 },
  { id:'sp-3d2y',        type:'special', title:'Episodio 3D2Y', sub:'3D2Y', after:522 },

  { id:'s-gyojin',       type:'saga', title:'Saga de la Isla Gyojin', start:523, end:574 },
  { id:'sp-luffy',       type:'special', title:'Episodio de Luffy', sub:'Episode of Luffy', after:574 },

  { id:'s-z-ambition',   type:'saga', title:'Saga de la Ambición de Z', start:575, end:578 },
  { id:'sp-merry',       type:'special', title:'Episodio de Merry', sub:'Episode of Merry', after:578 },
  { id:'ova-glorious',   type:'ova',  title:'Glorious Island', sub:'OVA', after:578 },
  { id:'m-12',           type:'movie',title:'Película 12 · Film Z', sub:'ONE PIECE FILM: Z', after:578 },

  { id:'s-punk-hazard',  type:'saga', title:'Saga de Punk Hazard', start:579, end:625 },
  { id:'s-caesar',       type:'saga', title:'Saga de la recuperación de Caesar', start:626, end:628 },

  { id:'s-dressrosa',    type:'saga', title:'Saga de Dressrosa', start:629, end:746 },
  { id:'sp-sabo',        type:'special', title:'Episodio de Sabo', sub:'Episode of Sabo', after:678 },
  { id:'sp-nebulandia',  type:'special', title:'Adventure of Nebulandia', after:746 },

  { id:'s-silver-mine',  type:'saga', title:'Saga de Silver Mine', start:747, end:750 },
  { id:'sp-heart-gold',  type:'special', title:'Heart of Gold', after:750 },
  { id:'m-13',           type:'movie',title:'Película 13 · Film Gold', sub:'ONE PIECE FILM: GOLD', after:750 },

  { id:'s-zou',          type:'saga', title:'Saga de Zou', start:751, end:779 },
  { id:'s-novatos',      type:'saga', title:'Saga de los marines novatos', start:780, end:782 },

  { id:'s-whole-cake',   type:'saga', title:'Saga de la Isla Whole Cake', start:783, end:877 },
  { id:'m-14',           type:'movie',title:'Película 14 · Estampida', sub:'ONE PIECE: STAMPEDE', after:877 },
  { id:'sp-east-blue',   type:'special', title:'Episode of East Blue', sub:'Episode of East Blue', after:877 },

  { id:'s-reverie',      type:'saga', title:'Saga del Nivel Reverie', start:878, end:889 },
  { id:'s-wano-country', type:'saga', title:'Saga del País de Wano', start:890, end:894 },
  { id:'s-wano',         type:'saga', title:'Saga de Wano', start:895, end:1028 },
  { id:'sp-skypiea',     type:'special', title:'Episode of Skypiea', sub:'Episode of Sorajima', after:1028 },

  { id:'s-film-red-intro',type:'saga',title:'Introducción a Film Red', start:1029, end:1030 },
  { id:'m-15',           type:'movie',title:'Película 15 · Film Red', sub:'ONE PIECE FILM: RED', after:1030 },

  { id:'s-wano-final',   type:'saga', title:'Saga final de Wano', start:1031, end:1071 },
  { id:'s-egghead',      type:'saga', title:'Saga de Egghead', start:1072, end:1155 },
  { id:'sp-fan-letter',  type:'special', title:'One Piece Fan Letter', sub:'Especial (2024)', after:1122 },

  // Saga en emisión: end:null usa "el último episodio emitido" automáticamente.
  { id:'s-elbaph',       type:'saga', title:'Saga de Elbaph', start:1156, end:null },
];
