import fs from 'fs';
import path from 'path';
import { Configuration } from '../types';

const fileExist = fs.existsSync(
  path.resolve(__dirname, '../../../config/configuration.json')
);

let config: Configuration;

if (fileExist) {
  config = require('../../../config/configuration.json');
} else {
  config = require('../../../config/configuration_template.json');
}

export default config;
