"""Genera los iconos y la imagen para redes sociales a partir del logo 2.

Uso:  python tools/generar_imagenes.py
Salida: site/assets/img/ (favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, og-image.jpg)

La marca se dibuja con los mismos poligonos de logo-mark.svg (vector calcado del logo 2),
asi los iconos quedan nitidos a cualquier tamano. La imagen og-image se recorta del JPG
original para conservar el logotipo tal cual.
"""
from pathlib import Path

from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "tools" / "src" / "logo-2.jpg"
DESTINO = RAIZ / "site" / "assets" / "img"

NAVY = (30, 37, 48)
BLANCO = (255, 255, 255)
PLATA = (169, 173, 182)
PLATA_DIAMANTE = (179, 183, 191)

# Coordenadas en el viewBox 0 0 621 483 de logo-mark.svg
ANCHO_MARCA, ALTO_MARCA = 621, 483
TRAZO_IZQ = [(263, 0), (321, 0), (93, 419), (228, 322), (177, 420), (98, 483), (0, 483)]
TRAZO_DER = [(359, 3), (621, 483), (526, 483), (445, 420), (398, 334), (418, 334), (535, 426), (334, 57)]
DIAMANTE_IZQ = [(310, 200), (275, 264), (310, 328)]
DIAMANTE_DER = [(310, 200), (345, 264), (310, 328)]


def icono(lado: int, proporcion: float) -> Image.Image:
    """Cuadrado azul noche con la marca centrada ocupando `proporcion` del ancho."""
    escala_ss = 4  # supersampling para bordes suaves
    L = lado * escala_ss
    img = Image.new("RGB", (L, L), NAVY)
    d = ImageDraw.Draw(img)
    k = (L * proporcion) / ANCHO_MARCA
    ox = (L - ANCHO_MARCA * k) / 2
    oy = (L - ALTO_MARCA * k) / 2

    def pts(poly):
        return [(ox + x * k, oy + y * k) for x, y in poly]

    d.polygon(pts(TRAZO_IZQ), fill=BLANCO)
    d.polygon(pts(TRAZO_DER), fill=PLATA)
    d.polygon(pts(DIAMANTE_IZQ), fill=BLANCO)
    d.polygon(pts(DIAMANTE_DER), fill=PLATA_DIAMANTE)
    return img.resize((lado, lado), Image.LANCZOS)


def og_image() -> Image.Image:
    """1200x630 recortado del logo original (marca + logotipo)."""
    src = Image.open(ORIGEN).convert("RGB")
    ancho = src.width
    alto = round(ancho * 630 / 1200)
    centro_y = 985  # centro vertical aproximado del bloque marca + texto
    top = max(0, centro_y - alto // 2)
    return src.crop((0, top, ancho, top + alto)).resize((1200, 630), Image.LANCZOS)


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    icono(180, 0.62).save(DESTINO / "apple-touch-icon.png", optimize=True)
    icono(192, 0.56).save(DESTINO / "icon-192.png", optimize=True)
    icono(512, 0.56).save(DESTINO / "icon-512.png", optimize=True)
    icono(64, 0.70).save(DESTINO / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    og_image().save(DESTINO / "og-image.jpg", quality=86, optimize=True, progressive=True)
    for f in sorted(DESTINO.iterdir()):
        print(f"{f.name:24} {f.stat().st_size / 1024:7.1f} KB")


if __name__ == "__main__":
    main()
