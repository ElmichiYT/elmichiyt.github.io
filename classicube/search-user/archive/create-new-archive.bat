@echo off
echo    APP 1.0
echo =============
timeout -t 1 /nobreak >nul
echo.

if exist "%date:/=-%" (
    echo La carpeta de Archive "%date:/=-%" ya existe.
    pause
    goto :eof
)

echo Creando carpeta
mkdir %date:/=-%

:reinput
set /p "openFolder=Abrir carpeta? (S/N): "

if /i "%openFolder%"="S" (
    start "" "%date:/=-%"
    pause
    goto :eof
)
if /i "%openFolder%"=="N" goto :eof
goto reinput

:: Seguridad
goto :eof