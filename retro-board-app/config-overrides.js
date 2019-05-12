const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const rewireYarnWorkspaces = require('react-app-rewire-yarn-workspaces');

/* config-overrides.js */
module.exports = function override(config, env) {
  config = rewireReactHotLoader(config, env);
  config = rewireYarnWorkspaces(config, env);
  return config;
}