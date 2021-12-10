$execPath = $args[0]
$execPath = $execPath.Trim("'")
if($PSScriptRoot -ne '') {
    $execPath = -join($PSScriptRoot + '\..\..')
}

Write-output 'Removing symoblic links for Web Panels feature............'

$developmentPath = -join($execPath, '\reactclient\public\assets')
$productionPath = -join($execPath, '\reactclient\assets')

if (Test-Path -Path $developmentPath) {
    $assetsPath = $developmentPath
}
else {
    $assetsPath = $productionPath
}

# ################## Remove Symbolic links #####################

# Remove all symbolic links first without touching original content folders
Get-ChildItem $assetsPath -Recurse -Attributes ReparsePoint | % { $_.Delete() }

# ## Additional folder links for Fonts location
# $path = [IO.Path]::GetFullPath(-join($assetsPath, '\shared\scss\fonts'))
# cmd /c rmdir /s /q $path

# ## Working Title G1000 NXi
# $path = [IO.Path]::GetFullPath(-join($assetsPath, '\g1000nxi'))
# cmd /c rmdir /s /q $path

# ## Flybywire A320 neo (points to community folder)
# $path = [IO.Path]::GetFullPath(-join($assetsPath, '\fbwa32nx'))
# cmd /c rmdir /s /q $path

# $path = [IO.Path]::GetFullPath(-join($assetsPath, '\shared\images\nd\'))
# cmd /c rmdir /s /q $path

# ## Asobo CJ4
# $path = [IO.Path]::GetFullPath(-join($assetsPath, '\cj4'))
# cmd /c rmdir /s /q $path

# ## All Asobo non-airliners
# $path= [IO.Path]::GetFullPath(-join($assetsPath, '\asobo'))
# cmd /c rmdir /s /q $path

Write-output ''