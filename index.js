#!/usr/bin/env node

let shell = require('shelljs');
let colors = require('colors');
let fs = require('fs');
let templates = require('./templates/templates.js')

let appName = process.argv[2];
let appDirectory = `${process.cwd()}/${appName}`;

const createReactApp = () => {
  return new Promise(resolve => {
    if (appName) {
      shell.exec(`create-react-app ${appName}`, () => {
        console.log("Created react app");
        resolve(true);
      });
    } else {
      console.log("\nNo app name was provided.".red);
      console.log("\nProvide an app name in the following format: ");
      console.log("\ncreate-react-redux-router-app ", "app-name\n".cyan);
      resolve(false);
    }
  });
}

const cdIntoNewApp = () => {
  return new Promise(resolve => {
    shell.exec(`cd ${appName}`, () => { resolve(); });
  });
}

const packages = [
  { name: 'typescript', package: true },
  { name: 'redux', package: true },
  { name: 'react-router', package: true, types: true },
  { name: 'react-redux', package: true, types: true },
  { name: 'redux-thunk', package: true },
  { name: 'react-router-dom', package: true, types: true },
  { name: 'react-dom', package: false, types: true }
];

const installPackages = () => {
  return new Promise(resolve => {
    let promises = [];
    console.log(`\nInstalling packages and typings\n`.cyan);
    promises[0] = new Promise(res => {
      shell.exec(`cd ${appName} && npm install --save ${packages.filter(p => p.package).map(p => p.name).join(' ')}`, () => {
        console.log("\nFinished installing packages\n".green);
        res();
      });
    });
    promises[1] = new Promise(res => {
      shell.exec(`cd ${appName} && npm install --save ${packages.filter(p => p.types).map(p => `@types/${p.name}`).join(' ')}`, () => {
        console.log("\nFinished installing typings\n".green);
        res();
      });
    });
    Promise.all(promises).then(() => { resolve() });
  });
};


const cleanUpList = ['App.js', 'App.css', 'App.test.js', 'index.css', 'index.js', 'logo.svg'];
const cleanUpTemplates = () => {
  return new Promise(resolve => {
    let promises = [];
    cleanUpList.forEach((entry, i) => {
      promises[i] = new Promise(res => {
        fs.unlink(`${appDirectory}/src/${entry}`, (err) => {
          if (err) { return console.log(err); }
          res();
        });
      });
    });
    Promise.all(promises).then(() => { resolve() });
  });
}

const updateTemplates = () => {
  return new Promise(resolve => {
    let promises = [];
    Object.keys(templates).forEach((entry, i) => {
      if (!templates[entry].content) {
        promises[i] = new Promise(res => {
          fs.writeFile(`${appDirectory}/src/${entry}`, templates[entry], function (err) {
            if (err) { return console.log(err); }
            res();
          })
        })
      } else {
        promises[i] = new Promise(res => {
          let path = `${appDirectory}${templates[entry].root ? '/' : '/src/'}${templates[entry].path ? templates[entry].path + '/' : ''}`;
          if (templates[entry].path && !fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          fs.writeFile(`${path}${templates[entry].filename}`, templates[entry].content, function (err) {
            if (err) { return console.log(err); }
            res();
          })
        })
      }
    });
    Promise.all(promises).then(() => { resolve() });
  })
}

const run = async () => {
  let success = await createReactApp();
  if (!success) {
    console.log('Something went wrong while trying to create a new React app using create-react-app'.red);
    return false;
  }
  await cdIntoNewApp();
  await installPackages();
  await updateTemplates();
  await cleanUpTemplates();
  console.log("All done");
}

run();
