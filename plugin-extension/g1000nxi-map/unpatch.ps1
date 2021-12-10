$localAppDataPath = -join($env:LOCALAPPDATA, '\Packages\Microsoft.FlightSimulator_8wekyb3d8bbwe\LocalCache\UserCfg.opt') 
$appDataPath = -join($env:APPDATA, '\Microsoft.FlightSimulator_8wekyb3d8bbwe\LocalCache\UserCfg.opt') 

Write-Output ''
Write-Output 'Restoring backup G1000 NXi MFD.js file.........'

#Get MSFS application installation path
if(Test-Path -Path $localAppDataPath){
    # For MS Store version of game
    $UserCfg = Get-Content $localAppDataPath -Raw
}
elseif(Test-Path -Path $appDataPath){
    # For steam version of game
    $UserCfg = Get-Content $appDataPath -Raw
}
else{
    throw 'The MSFS UserCfg.opt does not exist.'
}

$installationPath = [regex]::match($UserCfg, 'InstalledPackagesPath "((.|\n)*?)"').Groups[1].Value

################## Update MFD.js file #####################

$mfd_file_path = -join($installationPath, '\Official\OneStore\workingtitle-g1000nxi\html_ui\Pages\VCockpit\Instruments\NavSystems\WTG1000\MFD\MFD.js')
$mfd_backup_file_path = -join($installationPath, '\Official\OneStore\workingtitle-g1000nxi\html_ui\Pages\VCockpit\Instruments\NavSystems\WTG1000\MFD\MFD.js.backup')

$input = Get-Content $mfd_file_path -Raw

# Make a copy of original first
$isPatched = $input -match 'Patched by msfs-touch-panel'
if(-not $isPatched) 
{
    Write-output 'MFD.js has been patched. No restoration is needed.'
    Write-Output ''
    Exit
}

if(Test-Path -Path $mfd_backup_file_path) {
    
    Move-Item -Force -Path $mfd_backup_file_path -Destination $mfd_file_path
    Write-Output 'G1000 NXi has been restored to its original state.'
    Write-Output ''
}
else {
    Write-Output 'MFD.js backup file does not exist. Please reinstall G1000 NXi add-on in MSFS to remove all traces of the patch.'
    Write-Output ''
}