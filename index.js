const core = require('@actions/core');
const findFabricVersion = require("./version");

async function run() {
  try {
    const minecraftVersion = core.getInput('minecraftVersion');
    core.info(`Finding Fabric version for ${minecraftVersion} ...`);

    const {apiVersion, loaderVersion} = await findFabricVersion(minecraftVersion);

    core.setOutput('apiVersion', apiVersion);
    core.setOutput('loaderVersion', loaderVersion);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
