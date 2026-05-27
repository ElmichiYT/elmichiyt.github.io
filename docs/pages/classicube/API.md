# ClassiCube API
Esta página mostrará lo mayor posible sobre la API de ClassiCube.

## Skins API
- Skins: [https://cdn.classicube.net/skin/USERNAME.png](https://cdn.classicube.net/skin/USERNAME.png)
- Caras: [https://cdn.classicube.net/face/USERNAME.png](https://cdn.classicube.net/face/USERNAME.png)

Puedes ver skins de ClassiCube aquí: [https://pizzaclap43.github.io/skins/](https://pizzaclap43.github.io/skins/)
## La API para código
El nombre de dominio que debe utilizar para todas las solicitudes es www.classicube.net  
Se recomienda encarecidamente incluir siempre una barra diagonal al final de su solicitud.  
Debes incluir el encabezado Host: www.classicube.net en tu solicitud; de lo contrario, recibirás una página de error que indica que "no se permite el acceso directo a la IP" .  
Se le enviará una cookie con la etiqueta 'session'; debe enviarla con cada solicitud para que la API funcione.

### Cómo interpretar las secciones de uso
\> indica un ejemplo de datos entrantes (datos que recibirá).  
\< indica un ejemplo de datos salientes (datos que enviará).  

### /api/login/
**Uso: Te autentica en el sitio y te permite realizar acciones que requieren autenticación.**

**Uso:**
envía una solicitud GET a /api/login/ para obtener el "token", luego envía una solicitud POST a la misma página con los siguientes parámetros:

**username** &mdash; el nombre de usuario de la cuenta con la que te estás autenticando.  
**password** &mdash; La contraseña de la cuenta con la que te estás autenticando  
**token** &mdash; El token de su solicitud anterior

`< GET /api/login/`
```text
> {  
> "nombre de usuario": null,  
> "autenticado": falso,  
> "token": "f033ab37c30201f73f142449d037028d",  
> "errores": []  
>}
```

`< POST /api/login/
<username=AndrewPH&password=examplePassW0rd&token=f033ab37c30201f73f142449d037028d>`
```text
> {  
> "nombre de usuario": "AndrewPH",  
> "autenticado": verdadero,  
> "token": "33e75ff09dd601bbe69f351039152189",  
> "errores": []  
> }
```
	
Errores  
token - El token que enviaste era incorrecto.  
nombre de usuario : El nombre de usuario que enviaste no existe.  
Contraseña : La contraseña que enviaste es incorrecta.  
Verificación : El usuario aún no está verificado. Seguirás conectado, pero no podrás obtener pases para servidores multijugador.  
/api/myip/  
Uso: Devuelve su dirección IP externa.

Uso
Envía una solicitud GET a `/api/myip/`
```text
< GET /api/myip

> 127.0.0.1
```

## Recurso
Para ver la API para MCGalaxy: https://www.classicube.net/api/docs/server
___

## /api/player/
Uso: Te proporciona una lista de información sobre el jugador asociado con el nombre dado, que incluye: banderas del foro, hora registrada como marca de tiempo Unix, nombre de usuario con mayúsculas y minúsculas correctas y su ID numérico.

Uso
Envía una solicitud GET a `/api/player/` con el nombre de un solo jugador (no importa si el nombre contiene mayúsculas o minúsculas).
```text
< GET /api/player/exampleuser1

> {"flags: ["a","b","d","e","m"], "id": 100, "premium": false, "registered": 1376450557, "username": "ExampleUSER1"}
```

## /api/players/
Uso: Proporciona estadísticas sobre las cuentas de Classicube. Actualmente solo devuelve el número total de cuentas registradas.

Uso
Envía una solicitud GET a `/api/players/`.
```text
< GET /api/players/

> {"playercount": 10000}
```

## Información basada en www.classicube.net