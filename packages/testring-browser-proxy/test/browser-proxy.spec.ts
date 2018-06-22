/// <reference types="node" />
/// <reference types="mocha" />

import * as path from 'path';
import * as chai from 'chai';

import { BrowserProxy } from '../src/browser-proxy';
import { BrowserProxyMessageTypes, BrowserProxyActions } from '../src/structs';

import { TransportMock } from './transport.mock';

const onActionPlugin = path.resolve(__dirname, './fixtures/on-action.ts');
const onActionAsyncPlugin = path.resolve(__dirname, './fixtures/on-action-async.ts');
const commandMock = {
    action: BrowserProxyActions.click,
    arguments: ['foo', 'bar'],
};

describe('Browser proxy', () => {
    it('should listen to incoming messages and call onAction hook when gets message', (callback) => {
        const uid = 'testUid';
        const transport = new TransportMock();
        new BrowserProxy(transport as any, onActionPlugin);

        transport.on(BrowserProxyMessageTypes.response, (response) => {
            chai.expect(response).to.have.property('uid', uid);
            chai.expect(response).not.to.have.property('exception');

            callback();
        });

        transport.emit(
            BrowserProxyMessageTypes.execute,
            {
                uid,
                command: commandMock,
            },
        );
    });

    it('should work with async hooks', (callback) => {
        const uid = 'testUid';
        const transport = new TransportMock();
        new BrowserProxy(transport as any, onActionAsyncPlugin);

        transport.on(BrowserProxyMessageTypes.response, (response) => {
            chai.expect(response).to.have.property('uid', uid);
            chai.expect(response).not.to.have.property('exception');

            callback();
        });

        transport.emit(
            BrowserProxyMessageTypes.execute,
            {
                uid,
                command: commandMock,
            },
        );
    });

    it('should broadcast response with exception if onAction hook fails', (callback) => {
        const uid = 'testUid';
        const transport = new TransportMock();
        new BrowserProxy(transport as any, onActionPlugin);

        transport.on(
            BrowserProxyMessageTypes.response,
            (response) => {
                chai.expect(response).to.have.property('uid', uid);
                chai.expect(response).to.have.property('exception');

                callback();
            }
        );

        transport.emit(
            BrowserProxyMessageTypes.execute,
            {
                uid,
                command:  {
                    action: 'barrelRoll' as BrowserProxyActions,
                    arguments: ['foo', 'bar'],
                },
            },
        );
    });
});
