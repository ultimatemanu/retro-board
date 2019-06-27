import chalk from 'chalk';
import emoji from 'node-emoji'; // https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json
import nedb from './nedb';
import postgres from './postgres';
import config from './config';
import { Store } from '../types';

export default (): Promise<Store> => {
  const computer = emoji.get('computer');
  const y = chalk.yellow.bind(chalk);
  if (config.DB_TYPE === 'postgres') {
    console.log(
      chalk`{yellow ${computer}   Using ${chalk.red('Postgres')} database}`
    );
    return postgres();
  }
  chalk`{yellow ${computer}   Using ${chalk.red('NeDB')} database}`;
  return nedb();
};
