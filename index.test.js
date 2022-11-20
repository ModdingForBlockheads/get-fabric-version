const findFabricVersion = require('./version');
const process = require('process');
const cp = require('child_process');
const path = require('path');

test('throws invalid version', async () => {
    await expect(findFabricVersion(123)).rejects.toThrow('minecraftVersion not a string');
});

test('throws missing version', async () => {
    await expect(findFabricVersion('99.99.99')).rejects.toThrow("No version found for 99.99.99");
});

test('get exact api version', async () => {
    const {apiVersion} = await findFabricVersion('1.17');
    expect(apiVersion).toBe('0.46.1+1.17');
});

test('get previous minor api version', async () => {
    const {apiVersion} = await findFabricVersion('1.17.1');
    expect(apiVersion).toBe('0.46.1+1.17');
});

test('get base api version', async () => {
    const {apiVersion} = await findFabricVersion('1.16.2');
    expect(apiVersion).toBe('0.42.0+1.16');
});

test('get loader version', async () => {
    const {loaderVersion} = await findFabricVersion('1.19.2');
    const loaderVersionParts = loaderVersion.split('.');
    expect(loaderVersionParts.length).toBeGreaterThanOrEqual(2);
    expect(parseInt(loaderVersionParts[0])).toBeGreaterThanOrEqual(0);
    if(loaderVersionParts[0] === '0') {
        expect(parseInt(loaderVersionParts[1])).toBeGreaterThanOrEqual(14);
    }
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
    process.env['INPUT_MINECRAFTVERSION'] = '1.16.5';
    const ip = path.join(__dirname, 'index.js');
    const result = cp.execSync(`node "${ip}"`, {env: process.env}).toString();
    console.log(result);
})
