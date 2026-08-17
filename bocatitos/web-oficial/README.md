# Bocatitos · web oficial

Web que se le entrega al cliente. **Es una copia del modelo 1 de Manu**
(`bocatitos/Manu/modelo-12-tres-momentos`), el que eligió Bocatitos en la
reunión del 13-08-2026, con los cambios que pidió aplicados encima.

El original de Manu se conserva **intacto** en su carpeta, como referencia y
como reconocimiento de su autoría. Todo el trabajo posterior se hace aquí.

> Diseño, maquetación, paleta, tipografía, hero con vídeo y animaciones:
> **autoría de Manu**. `assets/styles.css` sigue siendo el suyo sin un solo
> cambio.

## Qué se añadió sobre el original

| Cambio | Dónde |
|---|---|
| Pedido por WhatsApp (carrito, ingredientes, tamaños, mesa por QR) | `assets/pedido.js` + `assets/pedido.css` (ficheros nuevos) |
| Pop-up de delivery de viernes a domingo | `assets/pedido.js` |
| Se retiran los accesos rápidos flotantes | `assets/app.js` |
| Categorías de la carta como pestañas independientes | `assets/app.js` |
| Reordenación de los tres momentos según la hora | `assets/app.js` + `index.html` |
| CTA de reseña de Google delante de los comentarios | `index.html` |
| Carta real de agosto 2026 con precios (53 platos) | `desayuno.html`, `tapas.html`, `streetfood.html` |
| Traducciones de los platos a 5 idiomas | `assets/i18n.js` |

## Si añades platos a mano

Cada plato necesita su botón con estos atributos, o el carrito no lo verá:

```html
<button class="add-btn" type="button" data-add
        data-slug="la-gourmet"
        data-nombre="LA GOURMET"
        data-precio="9.90"          <!-- punto decimal, no coma -->
        data-precio-media=""        <!-- vacío si no tiene media ración -->
        data-ing="Carne smash 100% vacuna|Doble bacon|Queso de cabra">
  <span aria-hidden="true">+</span><span data-i18n="cart.add">Añadir</span>
</button>
```

Y las pestañas: cada botón lleva `data-cat="smash"` y su sección
`data-catsec="smash"`.

⚠️ Los botones de plato llevan `data-precio-media`, igual que el selector de
tamaño del modal. Al buscar ese atributo hay que acotar la búsqueda al modal o
el precio de la media ración sale vacío.

## Probar en local

```bash
python -m http.server 4400   # y abrir http://localhost:4400
```

Para ver el pop-up de delivery cualquier día: añadir `?popup=1` a la URL.
Para simular una mesa: `?mesa=L1`.

## Despliegue

Ver `proyectos/bocatitos-redesign/PLAN-demo-final-y-presupuesto-2026-08-17.md`
y la documentación en `nuxion-docs/documentación/bocatitos/demo-4-web-bocatitos-v1.html`.

## Pendiente del cliente

- Código exacto del verde para la carta de desayuno.
- Fotos reales de producto (bebidas, croissants, salmorejo y solomillos usan
  fotos de archivo).
