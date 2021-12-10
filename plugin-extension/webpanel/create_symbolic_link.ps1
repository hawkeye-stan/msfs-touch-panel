$execPath = $args[0]
$execPath = $execPath.Trim("'")
if($PSScriptRoot -ne '') {
    $execPath = -join($PSScriptRoot + '\..\..')
}

Write-output 'Begin to create symobolic folders link for Web Panels feature.................'

$localAppDataPath = -join($env:LOCALAPPDATA, '\Packages\Microsoft.FlightSimulator_8wekyb3d8bbwe\LocalCache\UserCfg.opt') 
$appDataPath = -join($env:APPDATA, '\Microsoft.FlightSimulator_8wekyb3d8bbwe\LocalCache\UserCfg.opt') 

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
$officialPath = -join($installationPath, '\Official\OneStore');
$communityPath = -join($installationPath, '\Community');

$developmentPath = -join($execPath, '\reactclient\public\assets')
$productionPath = -join($execPath, '\reactclient\assets')

if (Test-Path -Path $developmentPath) {
    $assetsPath = $developmentPath
}
else {
    $assetsPath = $productionPath
}

################## Create Symbolic links #####################

## Additional folder links for Fonts location (different plane uses different font folder location)
$linkPath = -join($assetsPath, '\shared\scss\fonts')
$targetPath = -join($assetsPath, '\..\fonts\')
New-Item -ItemType SymbolicLink -Path $linkPath -Target $targetPath -Force 

## Working Title G1000 NXi
$linkPath = -join($assetsPath, '\g1000nxi\html_ui')
$targetPath = -join($officialPath, '\workingtitle-g1000nxi\html_ui\')
New-Item -ItemType SymbolicLink -Path $linkPath -Target $targetPath -Force 

## Flybywire A320 neo (points to community folder)
$linkPath = -join($assetsPath, '\fbwa32nx\html_ui')
$targetPath = -join($communityPath, '\flybywire-aircraft-a320-neo\html_ui\')
New-Item -ItemType SymbolicLink -Path $linkPath -Target $targetPath -Force 

$linkPath = -join($assetsPath, '\fbwa32nx\html_ui\Pages\VCockpit\Instruments\Airliners\Shared')
$targetPath = -join($officialPath, '\asobo-vcockpits-instruments-airliners\html_ui\Pages\VCockpit\Instruments\Airliners\Shared\')
New-Item -ItemType SymbolicLink -Path $linkPath -Target $targetPath -Force 

$linkPath = -join($assetsPath, '\shared\images\nd\AIRPLANE.svg')
$targetPath = -join($communityPath, '\flybywire-aircraft-a320-neo\html_ui\images\ND\AIRPLANE.svg')
New-Item -ItemType SymbolicLink -Path $linkPath -Target $targetPath -Force 

## Asobo CJ4
$linkPath = -join($assetsPath, '\cj4\html_ui')
$targetPath = -join($officialPath, '\asobo-vcockpits-instruments-cj4\html_ui\')
New-Item -ItemType SymbolicLink -Path $linkPath -Target $targetPath -Force 

$linkPath = -join($assetsPath, '\cj4\html_ui\Pages\VCockpit\Instruments\Airliners\Shared')
$targetPath = -join($officialPath, '\asobo-vcockpits-instruments-airliners\html_ui\Pages\VCockpit\Instruments\Airliners\Shared\')
New-Item -ItemType SymbolicLink -Path $linkPath -Target $targetPath -Force 

$linkPath = -join($assetsPath, '\cj4\html_ui\Pages\VCockpit\Instruments\Shared')
$targetPath = -join($officialPath, '\asobo-vcockpits-instruments\html_ui\Pages\VCockpit\Instruments\Shared\')
New-Item -ItemType SymbolicLink -Path $linkPath -Target $targetPath -Force 

## All Asobo non-airliners
$linkPath = -join($assetsPath, '\asobo\html_ui')
$targetPath = -join($officialPath, '\asobo-vcockpits-instruments\html_ui\')
New-Item -ItemType SymbolicLink -Path $linkPath -Target $targetPath -Force 

Write-output ''