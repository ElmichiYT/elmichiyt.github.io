# Opciones ClassiCube
Opciones para el `options.txt` de ClassiCube. Esto posiblemente sea útil para personalizar un poco más el juego.

## server-services
Esta opción es el que indica la URL a la API deseada. Es el que se utiliza para el inicio de sesión y la lista de servidores.  
**Tipo de entrada:** URL
```txt
server-services=
```

## http-skinserver
Esta opción es para indicar la URL para el servidor que aloja las texturas. Podría servir para añadir un Proxy o un CDN propio.  
**Tipo de entrada:** URL
```txt
http-skinserver=
```

## forceopenal
Esta opción fuerza el uso de OpenAL en vez de usar el backend de audio nativo. Esto podría ser útil en caso de que tengas problemas con el audio.  
**Tipo de entrada:** true/false
```txt
forceopenal=
```

## win-raw-input
Esta opción simplemente hace que ClassiCube lea los datos en crudo (RAW) de lo que envía el mouse, para más precisión.  
**Tipo de entrada:** true/false
```txt
win-raw-input=
```

## auto-pause
Esta opción se supone (según) que el juego se pausa solo al momento de perder el foco. Sinceramente ni hasta yo entendí qué o qué.  
**Tipo de entrada:** true/false
```txt
auto-pause
```

## selected-block-outline
Esta opción especifica opciones del outline de los bloques seleccionados.

### Color
**Tipo de entrada:** Color HEX
```txt
selected-block-outline-color=
```

### Opacidad
**Tipo de entrada:** Un caracter HEX (Ej: F, 6, A, etc.)
```txt
selected-block-outline-opacity=
```

### Grosor
**Tipo de entrada:** Píxeles
```txt
selected-block-outline-scale=
```

## Offset
Esta opción cambia el offset del contenido en las direcciones **X** y **Y**.

```txt
offset-x=
offset-y=
```
---
### Gracias leer hasta abajo.<br>Todo fue escrito por [![ElmichiYT](https://github.com/ElmichiYT.png?size=16) ElmichiYT](https://github.com/ElmichiYT).