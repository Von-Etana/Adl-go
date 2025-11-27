# ADLgo APK Build Script
# This script helps you build an APK for the ADLgo mobile app

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ADLgo Mobile App - APK Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if EAS CLI is installed
Write-Host "Checking EAS CLI installation..." -ForegroundColor Yellow
try {
    $easVersion = eas --version 2>&1
    Write-Host "✓ EAS CLI is installed: $easVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ EAS CLI is not installed" -ForegroundColor Red
    Write-Host "Installing EAS CLI..." -ForegroundColor Yellow
    npm install -g eas-cli
}

Write-Host ""
Write-Host "Build Options:" -ForegroundColor Cyan
Write-Host "1. Preview Build (APK for testing - Recommended)" -ForegroundColor White
Write-Host "2. Development Build (APK with debugging)" -ForegroundColor White
Write-Host "3. Production Build (APK for release)" -ForegroundColor White
Write-Host "4. Check EAS Login Status" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

Set-Location "apps\mobile"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Building Preview APK..." -ForegroundColor Green
        Write-Host "This will create an APK that can be installed on any Android device." -ForegroundColor Yellow
        Write-Host ""
        eas build --profile preview --platform android
    }
    "2" {
        Write-Host ""
        Write-Host "Building Development APK..." -ForegroundColor Green
        Write-Host "This will create an APK with debugging capabilities." -ForegroundColor Yellow
        Write-Host ""
        eas build --profile development --platform android
    }
    "3" {
        Write-Host ""
        Write-Host "Building Production APK..." -ForegroundColor Green
        Write-Host "This will create a production-ready APK." -ForegroundColor Yellow
        Write-Host ""
        eas build --profile production --platform android
    }
    "4" {
        Write-Host ""
        Write-Host "Checking EAS login status..." -ForegroundColor Yellow
        eas whoami
        Write-Host ""
        Write-Host "If you're not logged in, run: eas login" -ForegroundColor Cyan
    }
    "5" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit
    }
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        exit
    }
}

Set-Location "..\..\"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Build process initiated!" -ForegroundColor Green
Write-Host "The build will be processed on Expo's servers." -ForegroundColor Yellow
Write-Host "You'll receive a download link when complete." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
