@echo off
setlocal enabledelayedexpansion

title LogicForge v1.0.0 Launcher

:: Clear screen and display banner
cls
echo ========================================================
echo                   LOGICFORGE v1.0.0
echo              FPGA DEVELOPMENT ENVIRONMENT
echo ========================================================
echo.

:: Get directory of launcher script cleanly (handles trailing backslash)
set "SCRIPT_DIR=%~dp0"
if "%SCRIPT_DIR:~-1%"=="\" set "SCRIPT_DIR=%SCRIPT_DIR:~0,-1%"

:: Set up log directory and log file path
if not exist "%SCRIPT_DIR%\logs" mkdir "%SCRIPT_DIR%\logs"
set "STARTUP_LOG=%SCRIPT_DIR%\logs\startup.log"

:: Write log header
echo [%DATE% %TIME%] LogicForge v1.0.0 Startup Initiated > "%STARTUP_LOG%"
echo [%DATE% %TIME%] Script Directory: %SCRIPT_DIR% >> "%STARTUP_LOG%"
echo [%DATE% %TIME%] OS: %OS% >> "%STARTUP_LOG%"

echo Checking system requirements...
echo.

:: Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [!] Required dependency missing: Node.js
    echo [%DATE% %TIME%] Missing dependency: Node.js >> "%STARTUP_LOG%"
    echo.
    echo LogicForge requires Node.js ^(v18 or higher^) to run the FPGA toolchain and Desktop UI.
    echo.
    set /p INSTALL_NODE="Would you like to automatically install Node.js via winget? [Y/N]: "
    if /i "!INSTALL_NODE!"=="Y" (
        echo.
        echo Attempting automatic installation via winget...
        echo [%DATE% %TIME%] Attempting winget install OpenJS.NodeJS >> "%STARTUP_LOG%"
        winget install --id OpenJS.NodeJS -e --source winget
        if !ERRORLEVEL! equ 0 (
            echo [OK] Node.js installed successfully.
            echo [%DATE% %TIME%] Node.js installed via winget >> "%STARTUP_LOG%"
            echo Please restart this launcher to refresh system PATH environment.
            pause
            exit /b 0
        ) else (
            echo [ERROR] Automatic installation via winget failed.
            echo Please install Node.js manually from https://nodejs.org/
            echo [%DATE% %TIME%] winget installation failed >> "%STARTUP_LOG%"
            pause
            exit /b 1
        )
    ) else (
        echo Launcher aborted by user. Please install Node.js to launch LogicForge.
        pause
        exit /b 1
    )
)

for /f "tokens=*" %%i in ('node -v 2^>nul') do set "NODE_VER=%%i"
echo [OK] Node.js detected (!NODE_VER!)
echo [%DATE% %TIME%] Node.js version: !NODE_VER! >> "%STARTUP_LOG%"

:: Check npm
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [!] Required dependency missing: npm
    echo [%DATE% %TIME%] Missing dependency: npm >> "%STARTUP_LOG%"
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v 2^>nul') do set "NPM_VER=%%i"
echo [OK] npm detected (v!NPM_VER!)
echo [%DATE% %TIME%] npm version: v!NPM_VER! >> "%STARTUP_LOG%"

:: Self-healing: Check node_modules
if not exist "%SCRIPT_DIR%\node_modules" (
    echo.
    echo [!] node_modules directory missing. Running automatic dependency installation...
    echo [%DATE% %TIME%] Installing npm dependencies... >> "%STARTUP_LOG%"
    cd /d "%SCRIPT_DIR%"
    call npm install
    if !ERRORLEVEL! neq 0 (
        echo [ERROR] npm install failed. Check internet connection and permissions.
        echo [%DATE% %TIME%] npm install failed >> "%STARTUP_LOG%"
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed successfully.
) else (
    echo [OK] Project dependencies detected
)

:: Self-healing: Check build artifacts
if not exist "%SCRIPT_DIR%\packages\core\dist\index.js" (
    echo.
    echo [!] Workspace build artifacts missing. Compiling LogicForge packages...
    echo [%DATE% %TIME%] Building workspace packages... >> "%STARTUP_LOG%"
    cd /d "%SCRIPT_DIR%"
    call npx tsc -b
    if !ERRORLEVEL! neq 0 (
        echo [ERROR] Package build failed.
        echo [%DATE% %TIME%] TypeScript build failed >> "%STARTUP_LOG%"
        pause
        exit /b 1
    )
    echo [OK] Workspace compilation clean.
) else (
    echo [OK] LogicForge runtime ready
)

echo.
echo FPGA TOOLCHAIN STATUS
echo.

:: Detect optional toolchains
where iverilog >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Icarus Verilog
    echo [%DATE% %TIME%] Toolchain iverilog: AVAILABLE >> "%STARTUP_LOG%"
) else (
    echo [--] Icarus Verilog ^(Optional - simulation unavailable until installed^)
    echo [%DATE% %TIME%] Toolchain iverilog: MISSING >> "%STARTUP_LOG%"
)

where yosys >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] Yosys Synthesis Engine
    echo [%DATE% %TIME%] Toolchain yosys: AVAILABLE >> "%STARTUP_LOG%"
) else (
    echo [--] Yosys Synthesis Engine ^(Optional - RTL synthesis unavailable until installed^)
    echo [%DATE% %TIME%] Toolchain yosys: MISSING >> "%STARTUP_LOG%"
)

where nextpnr-ice40 >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] nextpnr-ice40 Place ^& Route
    echo [%DATE% %TIME%] Toolchain nextpnr-ice40: AVAILABLE >> "%STARTUP_LOG%"
) else (
    echo [--] nextpnr-ice40 ^(Optional - iCE40 PnR unavailable until installed^)
    echo [%DATE% %TIME%] Toolchain nextpnr-ice40: MISSING >> "%STARTUP_LOG%"
)

where openFPGALoader >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo [OK] openFPGALoader Hardware Flasher
    echo [%DATE% %TIME%] Toolchain openFPGALoader: AVAILABLE >> "%STARTUP_LOG%"
) else (
    echo [--] openFPGALoader ^(Optional - board programming unavailable until installed^)
    echo [%DATE% %TIME%] Toolchain openFPGALoader: MISSING >> "%STARTUP_LOG%"
)

echo.
echo LogicForge can start normally.
echo.
echo.
echo Launching LogicForge Desktop IDE...
echo [%DATE% %TIME%] Launching Desktop application... >> "%STARTUP_LOG%"

cd /d "%SCRIPT_DIR%"
call npx tsc -b

start http://localhost:3000

call npm --workspace=apps/desktop run dev

echo.
echo [%DATE% %TIME%] LogicForge session closed cleanly. >> "%STARTUP_LOG%"


