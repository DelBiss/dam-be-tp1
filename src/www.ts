require('dotenv').config();
import 'reflect-metadata';
import { container } from './inversify.config';
import { Server } from './server';
import { TYPES } from './types';

console.log(''.padEnd(80,'-'))
const server: Server = container.get<Server>(TYPES.Server);
server.init();
