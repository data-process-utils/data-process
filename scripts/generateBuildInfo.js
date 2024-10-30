const fs = require("fs");
const path = require("path");

// Carrega o conteúdo do package.json
const packageJson = require("../package.json");

const buildInfo = {
    version: packageJson.version, // usa a versão do package.json
    buildTime: new Date().toISOString(),
};

fs.writeFileSync(
    path.join(__dirname, "../buildInfo.json"),
    JSON.stringify(buildInfo, null, 2)
);
