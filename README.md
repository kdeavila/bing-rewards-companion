# Bing Rewards Companion

Una app web para gestionar y ejecutar busquedas de Bing Rewards desde una interfaz limpia, rapida y enfocada en productividad.

[!TIP]
Ideal para personas que quieren automatizar su rutina diaria sin perder control del progreso y del tiempo entre busquedas.

Este proyecto esta pensado para dos tipos de personas:

- Quien solo quiere usar la herramienta de forma sencilla.
- Quien tiene mente abierta, quiere revisar el codigo y mejorarlo.

---

## Que hace esta app

- Muestra topics de busqueda y te ayuda a ejecutarlos rapido.
- Tiene dos modos de uso:
	- Daily Points: 20 busquedas.
	- Bing Star: 25 busquedas.
- Incluye contador, barra de progreso y cooldown entre busquedas.
- Si haces mucho scroll y pierdes la cabecera, aparece un panel flotante con estado actual (progreso + tiempo + acceso rapido para volver arriba).

[!IMPORTANT]
La app diferencia el flujo por modo para mantener coherencia entre el objetivo y la cantidad de topics mostrados.

---

## Como usarla

1. Instala dependencias.
2. Levanta el entorno de desarrollo.
3. Abre la app en tu navegador.
4. Elige el modo (`Daily Points` o `Bing Star`).
5. Inicia la automatizacion o ejecuta busquedas manuales.

### Instalacion

```bash
bun install
```

[!NOTE]
Recomendado usar la version estable mas reciente de Bun para evitar diferencias en lockfile y tooling.

### Desarrollo

```bash
bun run dev
```

### Build de produccion

```bash
bun run build
```

### Preview local de produccion

```bash
bun run preview
```

[!WARNING]
Antes de usar automatizacion, revisa permisos del navegador para popups y valida el comportamiento en tu sesion de Bing.

---

## Fuente de topics (coherencia por modo)

- `Bing Star`: usa topics recientes de HN Algolia con pagina de 25 resultados.
- `Daily Points`: usa un set mas controlado y variado (20 resultados), orientado a un flujo diario consistente.

API de referencia:

- HN Algolia API: https://hn.algolia.com/api

[!NOTE]
`Bing Star` usa topics recientes desde HN Algolia, mientras `Daily Points` prioriza consistencia diaria.

---

## Stack tecnico

- Astro + React
- Material UI (MUI) + Emotion
- CSS global
- Bun para scripts y manejo de dependencias