import { logMockRequest } from '../../src/helpers';
import { mockServer } from './node';
import { offline } from './offline';

mockServer.events.on('request:start', logMockRequest)


mockServer.listen()

offline.listen(3000);

export * from '../main';
