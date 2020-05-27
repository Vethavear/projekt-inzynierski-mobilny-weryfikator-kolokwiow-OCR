<h4 align="center">Mobile colloquium verifier using QR technology</h4>

<p align="center">
  <a >
    <img src="https://user-images.githubusercontent.com/26926726/83023223-e9d0c580-a02c-11ea-908b-e63e2919f39b.png"
         alt="Main">
  </a>
</p>

## Project Overview 🎉

Engineer project made for teachers. It allows user to verify student answers using smartphone, and sending them to database.
It needs answers encrypted in QR code right on test.
This app is part of a two app system, second app was made by my friend [Krystian Drozd](https://github.com/drozd1krystian). He did web app for creating unique coloquiums with proper answers encrypted in QR code.

## Tech/framework used 🔧

| Tech                                                    | Description                              |
| ------------------------------------------------------- | ---------------------------------------- |
| [Ionic](https://ionicframework.com)                           | Free and open source, Ionic offers a library of mobile-optimized UI components, gestures, and tools for building fast, highly interactive apps.   |
| [Cordova](https://cordova.apache.org)                       | Apache Cordova is an open-source mobile development framework. It allows you to use standard web technologies - HTML5, CSS3, and JavaScript for cross-platform development. Applications execute within wrappers targeted to each platform, and rely on standards-compliant API bindings to access each device's capabilities such as sensors, data, network status, etc.   |
| [Angular](https://angular.io)                      | Platform for building mobile and desktop web applications   |
| [Jasmine](https://jasmine.github.io)  |Jasmine is a behavior-driven development framework for testing JavaScript code. It does not depend on any other JavaScript frameworks. It does not require a DOM. And it has a clean, obvious syntax so that you can easily write tests.
| [Google Mobile Vision OCR](https://www.npmjs.com/package/cordova-plugin-mobile-ocr)  |The Text Recognition API recognizes text in any Latin based language. It also represents the structure of recognized text, including paragraphs and lines.Text Recognition can automate tedious data entry for credit cards, receipts, and business cards, as well as help organize photos, translate documents, or increase accessibility. Apps can even keep track of real objects, such as reading the numbers on trains.

## Screenshots 📺
<p align="center"> Settings panel:</p>
<p align="center"> 
    <img src="https://user-images.githubusercontent.com/26926726/83023234-eccbb600-a02c-11ea-96ce-72aa00e2bddd.png" alt="Settings">
</p>
<p align="center"> Capturing answers after QR scan:</p>
<p align="center"> 
    <img src="https://user-images.githubusercontent.com/26926726/83023254-f0f7d380-a02c-11ea-9f7a-c77f0391ea1a.png" alt="OCR">
</p>
<p align="center"> Correcting not readable answers:</p>
<p align="center"> 
    <img src="https://user-images.githubusercontent.com/26926726/83023272-f5bc8780-a02c-11ea-8aa0-7ea4e0f95158.png" alt="Correcting answers">
</p>
<p align="center"> Queue student results if device is offline:</p>
<p align="center"> 
    <img src="https://user-images.githubusercontent.com/26926726/83023286-fbb26880-a02c-11ea-9bc6-ecfeda5df190.png" alt="Queue">
</p>

## Installation 💾
Install .apk which is availbe under releases. App is tested for Android, it should also run on iOS but I didn't have any iOS smartphone to test it by myself.

To run in developer enviroment I recommend using Visual Studio Code. Also, you need to have Android Studio installed.

For Windows 7:
- npm install
- ionic cordova run android -device --livereload
- if any package will be missing install it with npm install <missing_package_name>

For Windows 10:
- npm install
- npm install ionic -g (unfortunately you need to instal Ionic globally on Windows 10)
- ionic cordova run android -device --livereload
- if any package will be missing install it with npm install <missing_package_name>



## Available scripts

| Command                   | Description                   |     |
| ------------------------- | ----------------------------- | --- |
| `ionic cordova run android -device --livereload`           | run app on connected android device with livereload      |     |
| `ionic cordova build android`           | build .apk        |     |
| `ionic cordova run android`            | Run tests                     |     |


## License 🔱
Rights belongs to University of Rzeszów, as this is my engineer project.
