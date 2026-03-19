import { mockServer } from './node';
import { offline } from './offline';
import { logMockRequest } from './utils';

mockServer.events.on('request:start', logMockRequest)

mockServer.listen()

offline.listen(3000);

export * from '../main';
