const fs = require("node:fs");
const path = require("node:path");
const { createCatalog } = require("../../lib/vehicle-catalog.cjs");
const site = require("./site.json");
module.exports = () => {
  const preview = process.env.LP_CATALOG_PREVIEW === "1";
  if (!preview && site.catalogEnabled !== true) return createCatalog([], site, false);
  const directory = path.join(__dirname, "vehicles");
  const vehicles = fs.readdirSync(directory).filter(name => name.endsWith(".json")).sort()
    .map(name => JSON.parse(fs.readFileSync(path.join(directory, name), "utf8")));
  return createCatalog(vehicles, site, preview);
};
