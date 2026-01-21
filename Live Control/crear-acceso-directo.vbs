Set oWS = WScript.CreateObject("WScript.Shell")
sLinkFile = oWS.SpecialFolders("Desktop") & "\🎸 Live Control.lnk"
Set oLink = oWS.CreateShortcut(sLinkFile)
oLink.TargetPath = WScript.ScriptFullName.Replace(WScript.ScriptName, "START_AQUI.bat")
oLink.WorkingDirectory = WScript.ScriptFullName.Replace(WScript.ScriptName, "")
oLink.Description = "Live Control - AmpliTube MIDI Controller"
oLink.IconLocation = "C:\Windows\System32\shell32.dll,14"
oLink.WindowStyle = 1
oLink.Save

MsgBox "✓ Acceso directo creado en el escritorio!" & vbCrLf & vbCrLf & "Nombre: 🎸 Live Control" & vbCrLf & vbCrLf & "Haz doble clic para iniciar el servidor.", vbInformation, "Live Control"

