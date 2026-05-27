function escapeHtmlAttribute(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildFullscreenMediaShell(innerHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            width: 100%;
            height: 100%;
            background: #000;
            overflow: hidden;
            overscroll-behavior: none;
            touch-action: none;
            position: fixed;
          }
          .player-shell {
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        <div class="player-shell">
          ${innerHtml}
        </div>
      </body>
    </html>
  `;
}

export function buildDirectVideoHtml(videoUrl: string): string {
  const safeSrc = escapeHtmlAttribute(videoUrl);
  const video = `
    <video
      controls
      autoplay
      playsinline
      webkit-playsinline
      src="${safeSrc}"
      style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;"
    ></video>
  `;
  return buildFullscreenMediaShell(video);
}
