module.exports = {
  eleventyComputed: { permalink: data => data.vehicleCatalog.enabled ? "/cars/index.html" : false },
};
