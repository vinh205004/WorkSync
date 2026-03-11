@echo off
REM Setup Folder Structure for WorkSync React Native

echo Creating folder structure...

REM Screens
mkdir src\screens\Auth 2>nul
mkdir src\screens\Employee 2>nul
mkdir src\screens\Manager 2>nul
mkdir src\screens\Common 2>nul

REM Components
mkdir src\components\buttons 2>nul
mkdir src\components\inputs 2>nul
mkdir src\components\modals 2>nul
mkdir src\components\cards 2>nul
mkdir src\components\loaders 2>nul

REM Services
mkdir src\services\api 2>nul
mkdir src\services\storage 2>nul
mkdir src\services\notification 2>nul

REM Context, Utils, Types, Navigation, Hooks
mkdir src\context 2>nul
mkdir src\utils 2>nul
mkdir src\types 2>nul
mkdir src\navigation 2>nul
mkdir src\hooks 2>nul

REM Assets
mkdir assets\images 2>nul
mkdir assets\icons 2>nul
mkdir assets\fonts 2>nul

echo.
echo ✅ Folder structure created successfully!
echo.
pause