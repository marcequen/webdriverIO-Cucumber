// Ejecutar la configuracion de WebdriverIO en repo vacio con esta configuracoin:

// Equipo $ npx wdio run ./wdio.conf.js
// ?Error: Could not execute "run" due to missing configuration.
//         (Como no encuentra la configuracion pregunta si deseas crearla ahora)
// Would you like to create one ? Yes
//
// =========================
// WDIO Configuration Helper
// =========================
// ? Where is your automation backend located? On my local machine
// ? Which framework do you want to use? cucumber
// ? Do you want to run WebdriverIO commands synchronous or asynchronous? sync
// ? Are you using a compiler? No!
// ? Where are your feature files located? ./features/**/*.feature
// ? Where are your step definitions located ? ./ features / step - definitions / steps.js
// ? Do you want WebdriverIO to autogenerate some test files? Yes
// ? Do you want to use page objects (https://martinfowler.com/bliki/PageObject.html)? Yes
// ? Where are your page objects located? ./features/pageobjects/**/*.js
// ? Which reporter do you want to use? spec, allure
// ? Do you want to add a service to your test setup? chromedriver
// ? What is the base url ? http ://localhost
//
// Resultado: Crea el archjivo de configuracion y archivos de ejemplo.
//           Agrego las siguientes carpetas y archivos en este orden:
//
//            features
//                pageobjects
//  1                    login.page.js
//  2                    page.js
//  3                    secure.page.js
//                step-definitios
//  4                    login.features
//  5                    steps.js
//            wdio.config.js
//
// Contenido de los archivos:

// 1-
//                      page.js =>
/**
 * Pagina principal que contiene todos los metodos, selectores y funcionalidades
 * que seran compartidas a travez de cualquier page object.
 *
 * Comienza exportando el archivo:
 */
module.exports = class Page {
  /**
   * Desde aqui abre la subpagina de Page usando
   * @param path. en la subpagina (ejemplo: /path/to/page.html)
   */
  open(path) {
    return browser.url(`https://the-internet.herokuapp.com/${path}`);
  }
};
//; Fin del metodo. Fin del archivo
//
// 2-
//                      secure.page.js =>
// Importa desde page.js
const Page = require("./page");
/**
 * Subpagina que contendra selectores y metodos especificos
 * para paginas especificadas aqui mismo
 */
//Ejemplo:

class SecurePage extends Page {
  /**
   * Se define selector usando getters
   */
  get flashAlert() {
    return $("#flash");
  }
}

//Exporta el archivo.
module.exports = new SecurePage();

//; Fin de la clase. Fin del archivo
//
// 3-
//                      login.page.js =>
//
//
/**
 * Al igual que el anterior, esta es una subpagina que contendra selectores y metodos
 * especificos para paginas especificadas aqui mismo
 */
//Ejemplo:

class LoginPage extends Page {
  /**
   * Se define selector usando getters
   */

  get inputUsername() {
    return $("#username");
  }

  get inputPassword() {
    return $("#password");
  }

  get btnSubmit() {
    return $('button[type="submit"]');
  }

  /**
   * Llama a los metodos para encapsular el codigo de automatizacion
   * para interactuar con la/las paginas
   * Ejemplo: Pagina para logueo de usuario con contraseña
   */
  login(username, password) {
    this.inputUsername.setValue(username);
    this.inputPassword.setValue(password);
    this.btnSubmit.click();
  }

  /**
   * Sobreescribe opciones especificas para adaptarlas al objeto de la pagina
   */
  open() {
    return super.open("login");
  }
}

// Exporta el archivo
module.exports = new LoginPage();

// Fin del metodo. Fin del archivo
//
//
// 4-
//                      login.features =>
//

/**
 * Archivo de caracteristicas en formato Gherkin para indicar las opciones a seguir
 * en los pasos de la automatizacion.
 * Este archivo es de donde Wdio/Cucumber toma las variables de cada psao.
 * Cada escenario puede tener diferentes tipos de datos
 */
//
//
//Ejemplo integrado de la configurwcion de Wdio:
//
// Se define la caracteristica que se desea automatizar:
//
// Feature: The Internet Guinea Pig Website
//
// Se define el escenario donde trabajara el usuario final:
//
// Scenario Outline: As a user, I can log into the secure area
//
// Se dan los pasos que deben ocurrir en cada etapa con los comandos Gherkin:
//
// Given I am on the login page
// When I login with <username> and <password>
// Then I should see a flash message saying <message>
//
// Se dan las variables a tener en cuenta en los metodos y clases
// que realizan la automatizacon:
//
// Examples:

//     Var1       Var2                   Resultado esperado
//   | username | password             | message                        |
//   | tomsmith | SuperSecretPassword! | You logged into a secure area! |
//   | foobar   | barfoo               | Your username is invalid!      |

//
// Fin del archivo
//
//
// 5-
//                      Steps.js =>
//
// Ejecuta la automatizacion.
//
// Importa los metodos (de features, estilo Gherkin) y los busca y ejecuta
const { Given, When, Then } = require("@cucumber/cucumber");
const LoginPage = require("../pageobjects/login.page");
const SecurePage = require("../pageobjects/secure.page");
const pages = {
  login: LoginPage,
};

// Ejecuta el paso "Dado que...(lo que esta encerrado entre barras /.../)"
// y busca el escenario en Features
Given(/^I am on the (\w+) page$/, (page) => {
  pages[page].open();
});

// Ejecuta el paso "Cuando... (lo que esta encerrado entre barras /.../)"
// e ingresa las variables de Features
When(/^I login with (\w+) and (.+)$/, (username, password) => {
  LoginPage.login(username, password);
});

// Ejecuta el paso "Entonces...(lo que esta encerrado entre barras /.../)"
// comparando lo encontrado versus lo esperado
Then(/^I should see a flash message saying (.*)$/, (message) => {
  expect(SecurePage.flashAlert).toBeExisting();
  expect(SecurePage.flashAlert).toHaveTextContaining(message);
});

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
