module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find and modify the source-map-loader rule to exclude @mediapipe/tasks-vision
      webpackConfig.module.rules.forEach((rule) => {
        if (rule.use) {
          rule.use.forEach((use) => {
            if (use.loader && use.loader.includes('source-map-loader')) {
              if (!use.options) use.options = {};
              use.options.filterSourceMappingUrl = (url, resourcePath) => {
                // Skip source map processing for mediapipe
                if (resourcePath.includes('@mediapipe/tasks-vision')) {
                  return false;
                }
                return true;
              };
            }
          });
        }
      });

      return webpackConfig;
    },
  },
};