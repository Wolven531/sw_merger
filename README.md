# Summoners War Merger (hosted at [GitHub Pages](https://wolven531.github.io/sw_merger/))

## Goals

- Demonstrate **full stack** technical capabilities 💻
- Demonstrate _rapid_ 🏁 prototyping
- Make useful tool for gaming
  - I am an **avid** SW player (as are most of my friends) 🤓
  - A **lot** of my friends play SW 😎

### Goal - Sharpen `Angular 2.0` skills

- Utilize TypeScript for the Angular application
  - ✅ All components are to be written in TypeScript, as the Angular team suggests (and Angular quick start generates)
  - ✅ Utilize properties and components properly
  - ✅ Utilize import / export and modular design (appropriately split classes, modules, components, css, and html)
  - ✅ Utilize dependency injection (e.g. inject data service / mock data service)
  - ⏳ Add proper routing (and hash navigation where applicable)
- Maintain CSS Quality
  - ✅ No `!important` flags are to be used in the CSS
  - ✅ Only `em` units are to be used in the CSS
  - ✅ No repeated identifiers
  - ⏳ Add build step to automatically verify CSS formatting / quality (something like ESLint for CSS)
- Customize and enhance site from generated code
  - ⏳ Add accurate favicon to admin site (after creating one)
  - ⏳ Add FB OpenGraph (and other social platforms) meta tags

### Goal - Sharpen general `JavaScript` skills

- Utilize `Babel`
  - ✅ Practice setting up automatic code transpilation
- Utilize ESlint
  - ⛑ Safer code
  - 🙌 Nicely formatted
  - ❤️ Visual Studio Code has a beautiful integration for this already
- Utilize ES6+ where possible
  - ✅ const vs let
  - ✅ Template literals
  - ✅ Tagged template literals ([Mozilla's MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) was very useful)

### Goal - Sharpen general server engineering skills

- ✅ Explore new `brotli` encoding (and other image / video encodings)
- ✅ Practice `NodeJS` package management (`package.json`, `npm`, `nodemon`)
- ✅ Practice `GitHub` issue tracking and project management
- ✅ Practice integrating multiple data sources
  - ✅ [SummonersWar.co](https://summonerswar.co)
  - ✅ [SWFR (SW France)](http://www.swfr.tv/summon-simulator) 🇫🇷

## Technologies

- Angular `2.0`
  - [Angular Quickstart](https://angular.io/guide/quickstart) was the most useful here (no surprise there, 🤣)
- Babel transpiler
  - **LOTS** of help from [this](https://github.com/babel/example-node-server)  (babel example node server) repository (from the babel team itself)
  - [es6-features.org](http://es6-features.org/) was useful for reference on new features
  - [pawelgrzybek.com](https://pawelgrzybek.com/whats-new-in-ecmascript-2017/) helped a bit too
  - [eventbrite](https://www.eventbrite.com/engineering/learning-es6-for-of-loop/) has a surprisingly cogent article
  - [exploringjs.com](http://exploringjs.com/es6/ch_oop-besides-classes.html) was beyond helpful
- Node `v6.11.0`
- NPM `3.10.10`
- Visual Studio Code `1.13.1`

![Angular 2.0][logoAngular] ![Babel][logoBabel] ![Node v6.11.0][logoNode] ![NPM 3.10.10][logoNpm] ![Visual Studio Code 1.13.1][logoVsc] 

[logoAngular]: ./SummSim/public/img/logo_angular.png "AngularJS"
[logoBabel]: ./SummSim/public/img/logo_babel.png "Babel"
[logoNode]: ./SummSim/public/img/logo_node.png "NodeJS"
[logoNpm]: ./SummSim/public/img/logo_npm.png "NPM"
[logoVsc]: ./SummSim/public/img/logo_vsc.png "Visual Studio Code [logo has MIT license]"
