/* =====================================================================
   ONE PIECE · BITÁCORA DE VIAJE — DATOS DE CONTENIDO
   =====================================================================

   ► CÓMO AÑADIR UNA SAGA NUEVA (cuando salga en el futuro):
     Copia una línea de tipo "saga" y pégala en su lugar cronológico
     dentro del array CONTENT. Cada entrada es un objeto:

       { id:'s-mi-saga', type:'saga',
         title:{ es:'Saga de ...', en:'... Arc' }, start:1200, end:1234 }

     - id    : identificador ÚNICO y estable (no lo cambies luego, porque
               con él se guarda si la tienes marcada a mano). Usa un slug.
     - type  : 'saga' | 'movie' | 'ova' | 'special' | 'short' | 'omake'
     - title : OBJETO bilingüe { es:'...', en:'...' }.
     - sub   : (opcional) subtítulo / título original. Puede ser un texto
               normal (si es igual en ambos idiomas, p. ej. el romaji) o un
               objeto bilingüe { es:'...', en:'...' }.
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

/* Etiquetas legibles (bilingües) y emoji por tipo. */
const TYPE_INFO = {
  saga:    { label:{ es:'Saga',     en:'Arc'     }, plural:{ es:'Sagas',      en:'Arcs'     }, icon:'🏴‍☠️' },
  movie:   { label:{ es:'Película', en:'Movie'   }, plural:{ es:'Películas',  en:'Movies'   }, icon:'🎬' },
  ova:     { label:{ es:'OVA',      en:'OVA'     }, plural:{ es:'OVAs',       en:'OVAs'     }, icon:'💿' },
  special: { label:{ es:'Especial', en:'Special' }, plural:{ es:'Especiales', en:'Specials' }, icon:'📺' },
  short:   { label:{ es:'Corto',    en:'Short'   }, plural:{ es:'Cortos',     en:'Shorts'   }, icon:'🎞️' },
  omake:   { label:{ es:'Omake',    en:'Omake'   }, plural:{ es:'Omakes',     en:'Omakes'   }, icon:'✨' },
};

const CONTENT = [
  { id:'s-romance-dawn', type:'saga', title:{ es:'Saga de Romance Dawn', en:'Romance Dawn Arc' }, start:1, end:3 },
  { id:'s-buggy',        type:'saga', title:{ es:'Saga de Buggy', en:'Buggy Arc' }, start:4, end:8 },
  { id:'ova-ganzack',    type:'ova',  title:{ es:'Derrotar al pirata Ganzack', en:'Defeat the Pirate Ganzack!' }, sub:'OVA', after:8 },

  { id:'s-kuro',         type:'saga', title:{ es:'Saga del Capitán Kuro', en:'Captain Kuro Arc' }, start:9, end:18 },
  { id:'m-1',            type:'movie',title:{ es:'Película 1 · One Piece, La Película', en:'Movie 1 · One Piece: The Movie' }, sub:'ONE PIECE: The Movie', after:18 },

  { id:'s-krieg',        type:'saga', title:{ es:'Saga de Don Krieg', en:'Don Krieg Arc' }, start:19, end:30 },
  { id:'s-arlong',       type:'saga', title:{ es:'Saga de Arlong Park', en:'Arlong Park Arc' }, start:31, end:45 },
  { id:'sp-tv1',         type:'special', title:{ es:'Especial TV 1 · Aventura en el ombligo del mar', en:"TV Special 1 · Adventure in the Ocean's Navel" }, sub:'Umi no Heso no Daibouken-hen', after:45 },

  { id:'s-buggy-crew',   type:'saga', title:{ es:'Saga de la tripulación de Buggy', en:"Buggy's Crew Arc" }, start:46, end:47 },
  { id:'s-loguetown',    type:'saga', title:{ es:'Saga de Loguetown', en:'Loguetown Arc' }, start:48, end:53 },
  { id:'m-2',            type:'movie',title:{ es:'Película 2 · La aventura de la Isla del Reloj', en:'Movie 2 · Clockwork Island Adventure' }, sub:'Clockwork Island Adventure', after:53 },

  { id:'s-dragon',       type:'saga', title:{ es:'Saga del dragón milenario', en:'Thousand-Year Dragon Arc' }, start:54, end:61 },
  { id:'sh-jango',       type:'short',title:{ es:'El carnaval de baile de Jango', en:"Jango's Dance Carnival" }, sub:"Jango's Dance Carnival", after:61 },

  { id:'s-whiskey',      type:'saga', title:{ es:'Saga de Whiskey Peak', en:'Whisky Peak Arc' }, start:62, end:67 },
  { id:'s-coby',         type:'saga', title:{ es:'Saga de Coby y Helmeppo', en:'Coby and Helmeppo Arc' }, start:68, end:69 },
  { id:'s-little-garden',type:'saga', title:{ es:'Saga de Little Garden', en:'Little Garden Arc' }, start:70, end:77 },
  { id:'s-drum',         type:'saga', title:{ es:'Saga de la Isla de Drum', en:'Drum Island Arc' }, start:78, end:91 },
  { id:'sh-soccer',      type:'short',title:{ es:'¡El rey del fútbol de los sueños!', en:'Dream Soccer King!' }, after:91 },
  { id:'m-3',            type:'movie',title:{ es:'Película 3 · El reino de Chopper en la isla de los animales extraños', en:"Movie 3 · Chopper's Kingdom on the Island of Strange Animals" }, sub:'Chinjuu-jima no Chopper Oukoku', after:91 },

  { id:'s-arabasta',     type:'saga', title:{ es:'Saga de Arabasta', en:'Arabasta Arc' }, start:92, end:130 },
  { id:'m-4',            type:'movie',title:{ es:'Película 4 · La aventura sin salida', en:'Movie 4 · Dead End Adventure' }, sub:'Dead End no Bouken', after:130 },

  { id:'s-mugiwara',     type:'saga', title:{ es:'Saga de los Sombrero de Paja', en:'Straw Hats Arc' }, start:131, end:135 },
  { id:'s-zenny',        type:'saga', title:{ es:'Saga de Zenny', en:'Zenny Arc' }, start:136, end:138 },
  { id:'sp-tv2',         type:'special', title:{ es:'Especial TV 2 · ¡Ábrete, gran mar! El enorme sueño del padre', en:"TV Special 2 · Open Upon the Great Sea! A Father's Huge Dream!" }, sub:'Oounabara ni Hirake! Dekkai Dekkai Chichi no Yume!', after:138 },

  { id:'s-niebla',       type:'saga', title:{ es:'Saga de la niebla arcoíris', en:'Rainbow Mist Arc' }, start:139, end:143 },
  { id:'m-5',            type:'movie',title:{ es:'Película 5 · La espada sagrada maldita', en:'Movie 5 · The Cursed Holy Sword' }, sub:'Norowareta Seiken', after:143 },

  { id:'s-jaya',         type:'saga', title:{ es:'Saga de Jaya', en:'Jaya Arc' }, start:144, end:152 },
  { id:'s-skypiea',      type:'saga', title:{ es:'Saga de Skypiea', en:'Skypiea Arc' }, start:153, end:195 },
  { id:'s-g8',           type:'saga', title:{ es:'Saga del G-8', en:'G-8 Arc' }, start:196, end:206 },
  { id:'s-davy',         type:'saga', title:{ es:'Saga Davy Back Fight', en:'Davy Back Fight Arc' }, start:207, end:219 },
  { id:'sh-baseball',    type:'short',title:{ es:'¡Objetivo! El rey del béisbol pirata', en:'Take Aim! The Pirate Baseball King!' }, after:219 },
  { id:'sp-tv3',         type:'special', title:{ es:'Especial TV 3 · ¡Protege! El último gran escenario', en:'TV Special 3 · Protect! The Last Great Performance' }, sub:'Mamore! Saigo no Oobutai', after:219 },

  { id:'s-oceans-dream', type:'saga', title:{ es:"Saga Ocean's Dream", en:"Ocean's Dream Arc" }, start:220, end:224 },
  { id:'m-6',            type:'movie',title:{ es:'Película 6 · El Barón Omatsuri y la isla secreta', en:'Movie 6 · Baron Omatsuri and the Secret Island' }, sub:'Omatsuri Danshaku to Himitsu no Shima', after:224 },

  { id:'s-aokiji',       type:'saga', title:{ es:'Saga de Aokiji', en:'Aokiji Arc' }, start:225, end:228 },
  { id:'m-7',            type:'movie',title:{ es:'Película 7 · El soldado mecánico gigante del castillo Karakuri', en:'Movie 7 · The Giant Mechanical Soldier of Karakuri Castle' }, sub:'Karakuri-jou no Mecha Kyohei', after:228 },

  { id:'s-water7',       type:'saga', title:{ es:'Saga de Water 7', en:'Water 7 Arc' }, start:229, end:252 },
  { id:'sp-tv4',         type:'special', title:{ es:'Especial TV 4 · Las memorias del detective jefe Sombrero de Paja Luffy', en:'TV Special 4 · The Detective Memoirs of Chief Straw Hat Luffy' }, sub:'Mugiwara no Luffy Oyabun Torimonochou', after:252 },

  { id:'s-umi-ressha',   type:'saga', title:{ es:'Saga del Umi Ressha', en:'Sea Train Arc' }, start:253, end:263 },
  { id:'s-enies',        type:'saga', title:{ es:'Saga de Enies Lobby', en:'Enies Lobby Arc' }, start:264, end:312 },
  { id:'m-8',            type:'movie',title:{ es:'Película 8 · Episode of Alabasta: La princesa del desierto y los piratas', en:'Movie 8 · Episode of Alabasta: The Desert Princess and the Pirates' }, sub:'Episode of Alabasta', after:312 },

  { id:'s-sunny',        type:'saga', title:{ es:'Saga del Thousand Sunny', en:'Thousand Sunny Arc' }, start:313, end:325 },
  { id:'om-1-5',         type:'omake',title:{ es:'Omakes 1 al 5', en:'Omakes 1 to 5' }, after:325 },
  { id:'m-9',            type:'movie',title:{ es:'Película 9 · Episode of Chopper Plus: Floración en invierno, el milagro del cerezo', en:'Movie 9 · Episode of Chopper Plus: Bloom in Winter, the Miracle Sakura' }, sub:'Episode of Chopper Plus', after:325 },

  { id:'s-ice-hunter',   type:'saga', title:{ es:'Saga de Ice Hunter', en:'Ice Hunter Arc' }, start:326, end:336 },
  { id:'s-thriller',     type:'saga', title:{ es:'Saga de Thriller Bark', en:'Thriller Bark Arc' }, start:337, end:381 },
  { id:'ova-romance-dawn',type:'ova', title:{ es:'Romance Dawn Story', en:'Romance Dawn Story' }, sub:'OVA', after:381 },

  { id:'s-spa',          type:'saga', title:{ es:'Saga de Spa Island', en:'Spa Island Arc' }, start:382, end:384 },
  { id:'s-tobiuo',       type:'saga', title:{ es:'Saga de los Tobiuo Riders', en:'Flying Fish Riders Arc' }, start:385, end:389 },
  { id:'s-sabaody',      type:'saga', title:{ es:'Saga del Archipiélago Sabaody', en:'Sabaody Archipelago Arc' }, start:390, end:407 },
  { id:'s-amazon',       type:'saga', title:{ es:'Saga de Amazon Lily', en:'Amazon Lily Arc' }, start:408, end:421 },
  { id:'s-impel',        type:'saga', title:{ es:'Saga de Impel Down', en:'Impel Down Arc' }, start:422, end:456 },
  { id:'ova-ep0',        type:'ova',  title:{ es:'Episodio 0: Strong World', en:'Episode 0: Strong World' }, sub:'OVA', after:429 },
  { id:'m-10',           type:'movie',title:{ es:'Película 10 · Strong World', en:'Movie 10 · Strong World' }, sub:'ONE PIECE FILM: STRONG WORLD', after:429 },

  { id:'s-marineford',   type:'saga', title:{ es:'Saga de Marineford', en:'Marineford Arc' }, start:457, end:490 },
  { id:'m-11',           type:'movie',title:{ es:'Película 11 · Mugiwara Chase', en:'Movie 11 · Straw Hat Chase' }, sub:'ONE PIECE 3D: Mugiwara Chase', after:490 },

  { id:'s-3d2y',         type:'saga', title:{ es:'Saga 3D2Y', en:'3D2Y Arc' }, start:491, end:516 },
  { id:'s-reunion',      type:'saga', title:{ es:'Saga de la reunión de los Sombrero de Paja', en:"Straw Hats' Reunion Arc" }, start:517, end:522 },
  { id:'sp-nami',        type:'special', title:{ es:'Episodio de Nami', en:'Episode of Nami' }, sub:'Episode of Nami', after:522 },
  { id:'sp-3d2y',        type:'special', title:{ es:'Episodio 3D2Y', en:'Episode 3D2Y' }, sub:'3D2Y', after:522 },

  { id:'s-gyojin',       type:'saga', title:{ es:'Saga de la Isla Gyojin', en:'Fish-Man Island Arc' }, start:523, end:574 },
  { id:'sp-luffy',       type:'special', title:{ es:'Episodio de Luffy', en:'Episode of Luffy' }, sub:'Episode of Luffy', after:574 },

  { id:'s-z-ambition',   type:'saga', title:{ es:'Saga de la Ambición de Z', en:"Z's Ambition Arc" }, start:575, end:578 },
  { id:'sp-merry',       type:'special', title:{ es:'Episodio de Merry', en:'Episode of Merry' }, sub:'Episode of Merry', after:578 },
  { id:'ova-glorious',   type:'ova',  title:{ es:'Glorious Island', en:'Glorious Island' }, sub:'OVA', after:578 },
  { id:'m-12',           type:'movie',title:{ es:'Película 12 · Film Z', en:'Movie 12 · Film Z' }, sub:'ONE PIECE FILM: Z', after:578 },

  { id:'s-punk-hazard',  type:'saga', title:{ es:'Saga de Punk Hazard', en:'Punk Hazard Arc' }, start:579, end:625 },
  { id:'s-caesar',       type:'saga', title:{ es:'Saga de la recuperación de Caesar', en:'Caesar Retrieval Arc' }, start:626, end:628 },

  { id:'s-dressrosa',    type:'saga', title:{ es:'Saga de Dressrosa', en:'Dressrosa Arc' }, start:629, end:746 },
  { id:'sp-sabo',        type:'special', title:{ es:'Episodio de Sabo', en:'Episode of Sabo' }, sub:'Episode of Sabo', after:678 },
  { id:'sp-nebulandia',  type:'special', title:{ es:'Adventure of Nebulandia', en:'Adventure of Nebulandia' }, after:746 },

  { id:'s-silver-mine',  type:'saga', title:{ es:'Saga de Silver Mine', en:'Silver Mine Arc' }, start:747, end:750 },
  { id:'sp-heart-gold',  type:'special', title:{ es:'Heart of Gold', en:'Heart of Gold' }, after:750 },
  { id:'m-13',           type:'movie',title:{ es:'Película 13 · Film Gold', en:'Movie 13 · Film Gold' }, sub:'ONE PIECE FILM: GOLD', after:750 },

  { id:'s-zou',          type:'saga', title:{ es:'Saga de Zou', en:'Zou Arc' }, start:751, end:779 },
  { id:'s-novatos',      type:'saga', title:{ es:'Saga de los marines novatos', en:'Marine Rookie Arc' }, start:780, end:782 },

  { id:'s-whole-cake',   type:'saga', title:{ es:'Saga de la Isla Whole Cake', en:'Whole Cake Island Arc' }, start:783, end:877 },
  { id:'m-14',           type:'movie',title:{ es:'Película 14 · Estampida', en:'Movie 14 · Stampede' }, sub:'ONE PIECE: STAMPEDE', after:877 },
  { id:'sp-east-blue',   type:'special', title:{ es:'Episode of East Blue', en:'Episode of East Blue' }, sub:'Episode of East Blue', after:877 },

  { id:'s-reverie',      type:'saga', title:{ es:'Saga del Nivel Reverie', en:'Reverie Arc' }, start:878, end:889 },
  { id:'s-wano-country', type:'saga', title:{ es:'Saga del País de Wano', en:'Wano Country Arc' }, start:890, end:894 },
  { id:'s-wano',         type:'saga', title:{ es:'Saga de Wano', en:'Wano Arc' }, start:895, end:1028 },
  { id:'sp-skypiea',     type:'special', title:{ es:'Episode of Skypiea', en:'Episode of Skypiea' }, sub:'Episode of Sorajima', after:1028 },

  { id:'s-film-red-intro',type:'saga',title:{ es:'Introducción a Film Red', en:'Film Red Introduction' }, start:1029, end:1030 },
  { id:'m-15',           type:'movie',title:{ es:'Película 15 · Film Red', en:'Movie 15 · Film Red' }, sub:'ONE PIECE FILM: RED', after:1030 },

  { id:'s-wano-final',   type:'saga', title:{ es:'Saga final de Wano', en:'Final Wano Arc' }, start:1031, end:1071 },
  { id:'s-egghead',      type:'saga', title:{ es:'Saga de Egghead', en:'Egghead Arc' }, start:1072, end:1155 },
  { id:'sp-fan-letter',  type:'special', title:{ es:'One Piece Fan Letter', en:'One Piece Fan Letter' }, sub:{ es:'Especial (2024)', en:'Special (2024)' }, after:1122 },

  // Saga en emisión: end:null usa "el último episodio emitido" automáticamente.
  { id:'s-elbaph',       type:'saga', title:{ es:'Saga de Elbaph', en:'Elbaph Arc' }, start:1156, end:null },
];
