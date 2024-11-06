// this is main cron file which runs every automatic script
// info: process.platform returns operation system if u need

// in pm2 you should run automaic.js like this: 'pm2 start automatic.js',
// because node will find the paths of scripts

// node-cron
// ┌─ second (optional)
// │ ┌─ minute
// │ │ ┌─ hour
// │ │ │ ┌─ day of month
// │ │ │ │ ┌─ month
// │ │ │ │ │ ┌─ day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *

// field	value
// second	0-59
// minute	0-59
// hour	    0-23
// day of month	1-31
// month	1-12 (or names)
// day of week	0-7 (or names, 0 or 7 are sunday)

const cron = require('node-cron');
const shell = require('shelljs');

const scripts = ['node deleteAdDdosBlackIps.js', 'node deleteAdvertiserShortSession.js'];

console.log('Started automatic.js . It runs scripts: \n' + scripts)

// every monday around 4 a.m.
cron.schedule('0 30 4 * * 1', () => {
  console.log('----- 1) schedule run ----- at time: ' +
    `(${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date().getFullYear())} ` +
    `${(new Date().getHours())}:${(new Date().getMinutes())}) `);

  if (shell.exec(scripts[0]).code !== 0) {
    console.log('Error script: ---------------> \n>>> ' + scripts[0] + ' <<< cannot be executed...');
  }
});

// every day around 4 a.m.
cron.schedule('0 0 4 * * *', () => {
  console.log('----- 2) schedule run ----- at time: ' +
    `(${(new Date().getDate())}.${(new Date().getMonth() + 1)}.${(new Date().getFullYear())} ` +
    `${(new Date().getHours())}:${(new Date().getMinutes())}) `);

  if (shell.exec(scripts[1]).code !== 0) {
    console.log('Error script: ---------------> \n>>> ' + scripts[1] + ' <<< cannot be executed...');
  }
});