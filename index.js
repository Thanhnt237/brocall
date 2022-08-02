const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const noble = require('@abandonware/noble');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegrationInWorker: true,
            allowRendererProcessReuse: false
        },
    });
    ipcMain.handle('ping', () => "pong")
    ipcMain.handle('noble', () => {
        noble.on('stateChange', function(state) {
            if (state === 'poweredOn') {
                console.log("start scanning: ...")
                noble.startScanning(()=>{
                    console.log("callback scanning: ...")
                });
            } else {
                noble.stopScanning();
            }
        });
    })
    win.webContents.openDevTools()
    win.loadFile('index.html');
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});