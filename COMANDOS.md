# 📋 Lista de Aplicaciones Comunes

Este documento contiene una lista organizada de aplicaciones populares que puedes abrir desde PowerShell, ya sea usando su nombre directo, URI (en apps UWP), o ruta completa.

---

## 🛠 Herramientas del Sistema

| Aplicación              | Comando PowerShell                                     |
|-------------------------|--------------------------------------------------------|
| Bloc de notas           | `notepad`                                              |
| Calculadora             | `calc`                                                 |
| Editor del Registro     | `regedit`                                              |
| Administrador de Tareas | `taskmgr`                                              |
| Símbolo del sistema     | `cmd`                                                  |
| PowerShell              | `powershell`                                           |
| Configuración de Windows| `start ms-settings:`                                   |
| Panel de control        | `control`                                              |
| Explorador de archivos  | `explorer`                                             |
| Administración de discos| `diskmgmt.msc`                                         |
| Monitor de recursos     | `resmon`                                               |
| Servicios               | `services.msc`                                         |

---

## 📝 Productividad / Oficina

| Aplicación             | Comando PowerShell                                      |
|------------------------|---------------------------------------------------------|
| Microsoft Word         | `winword`                                               |
| Microsoft Excel        | `excel`                                                 |
| Microsoft PowerPoint   | `powerpnt`                                              |
| OneNote                | `onenote`                                               |
| Outlook                | `outlook`                                               |
| Google Chrome          | `chrome` (si está en PATH)                              |
| Mozilla Firefox        | `firefox` (si está en PATH)                             |
| Microsoft Edge         | `msedge`                                                |

---

## 🎵 Multimedia

| Aplicación             | Comando PowerShell / Ruta                              |
|------------------------|---------------------------------------------------------|
| Reproductor de Windows Media | `wmplayer`                                   |
| VLC Media Player       | `"C:\Program Files\VideoLAN\VLC\vlc.exe"`              |
| Fotos (UWP)            | `ms-photos:`                                     |
| Paint                  | `mspaint`                                              |
| Audacity               | `"C:\Program Files (x86)\Audacity\audacity.exe"`       |

---

## 💻 Desarrollo

| Aplicación             | Comando PowerShell / Ruta                              |
|------------------------|---------------------------------------------------------|
| Visual Studio Code     | `code` (si está en PATH)                               |
| Visual Studio          | `devenv`                                               |
| Git Bash               | `"C:\Program Files\Git\git-bash.exe"`                 |
| Android Studio         | `"C:\Program Files\Android\Android Studio\bin\studio64.exe"` |
| Node.js CLI            | `node`                                                 |
| Python                 | `python`                                               |

---

## 📌 Notas

- Puedes verificar si una app está instalada con:
  ```powershell
  Get-StartApps
    ```
- Tambien puedes mirar mas comandos con:
  ```powershell
  Get-Command -Type Application
    ```