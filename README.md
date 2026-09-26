# TW Tools+

Extensión para [TurboWarp](https://turbowarp.org/) con más de 160 bloques nuevos: matemáticas, texto, listas, balas, colores, temporizadores y más.

---

## Cómo usarla

1. Abrí el [editor de TurboWarp](https://turbowarp.org/editor).
2. Tocá el botón **Añadir extensión** (abajo a la izquierda, el icono de bloques).
3. Elegí **Extensión personalizada** / **Custom Extension**.
4. Pegá este enlace (reemplazalo por el de tu repositorio si lo subiste a GitHub):

```text
https://raw.githubusercontent.com/TU_USUARIO/TU_REPO/main/twtoolsplus.js
```

5. Activá la opción **Ejecutar sin sandbox** / **Run without sandbox**.
6. Confirmá.

Vas a ver la categoría **Tools+** en la barra de bloques (icono de llave inglesa). Todos los bloques son gris oscuro y traen el icono a la izquierda.

---

## Qué incluye

| Sección | Para qué sirve |
|--------|----------------|
| **Math** | Redondear, mapear rangos, distancias, números romanos, probabilidad, suavizado |
| **Text** | Mayúsculas, reemplazar, cortar texto, Base64, IDs aleatorios |
| **Lists** | Ordenar, mezclar, filtrar, apilar (push/pop), elección al azar con pesos |
| **JSON / Dict** | Guardar y leer datos estructurados |
| **Storage** | Guardar puntajes u otras cosas entre partidas (en el navegador) |
| **Sprite / Stage** | Distancia a otros sprites, rebotar en bordes, seguir con suavidad, wrap |
| **Input** | Tecla pulsada este frame, clic derecho, scroll, doble clic |
| **Time** | Varios temporizadores, cooldowns, tween, “cada N frames” |
| **Bullets** | Velocidad hacia un punto, abanicos, homing, tiempo de vida (ideal para shooters) |
| **Color** | Mezclar colores, HSL, contraste, paletas |
| **Camera** | Cámara lógica para juegos con scroll |
| **Audio / Control / Geometry / Debug** | Extras de sonido, tareas programadas, geometría y logs |

---

## Ejemplo rápido (balas)

1. Creá un clon.
2. En el clon, usá **velocity X/Y towards (jugador) at speed 5**.
3. En un bucle: **move by velocity** → si **is off stage** → eliminá el clon.

---

## Importante

- Tiene que cargarse **sin sandbox**. Si no activás esa opción, no va a funcionar.
- Los proyectos que usen esta extensión **no se pueden subir a la web de Scratch**.
- Las listas trabajan con texto tipo `["a","b","c"]` (JSON), no con las listas nativas de Scratch directamente.

---

## Licencia

[Mozilla Public License 2.0](LICENSE) — podés usarla y modificarla respetando la licencia.
