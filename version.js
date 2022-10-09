const fetch = require('cross-fetch')

let findFabricVersion = async function (minecraftVersion) {
    if (typeof minecraftVersion !== 'string') {
        throw new Error('minecraftVersion not a string');
    }

    const response = await fetch('https://maven.fabricmc.net/jdlist.txt');
    const json = await response.text();
    const lines = json.split('\n').reverse();
    const loaderVersion = lines.find(it => it.startsWith('fabric-loader-'));
    let apiVersion = lines.find(it => it.startsWith('fabric-api-') && it.endsWith(`+${minecraftVersion}`) );
    const baseMinecraftVersion = minecraftVersion.split('.').slice(0, 2).join('.');
    if(!apiVersion) {
        apiVersion = lines.find(it => it.match(new RegExp(`fabric-api-.+\\+${baseMinecraftVersion}\\..+`, 'g')));
    }
    if(!apiVersion) {
        apiVersion = lines.find(it => it.startsWith('fabric-api-') && it.endsWith(`+${baseMinecraftVersion}`));
    }
    if (apiVersion && loaderVersion) {
        return {apiVersion: apiVersion.substring("fabric-api-".length), loaderVersion: loaderVersion.substring("fabric-loader-".length)};
    } else {
        throw new Error(`No version found for ${minecraftVersion}`);
    }
};

module.exports = findFabricVersion;
