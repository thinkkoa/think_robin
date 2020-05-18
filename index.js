/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/4/29
 */
const helper = require('think_lib');
// const logger = require('think_logger');

(function () {

    let _uniqueId = 1;

    const uniqueId = function () {
        return 'peer_' + (_uniqueId++);
    };

    const Peers = function () {
        this._peerMap = {};
        this._length = 0;
    };

    Peers.prototype.size = function () {
        return this._length;
    };


    Peers.prototype.add = function (peer) {
        if (!peer) {
            return false;
        }


        let key = 'id' in peer ? peer.id : (peer.id = uniqueId());

        if (!(key in this._peerMap)) {
            this._length++;
        }

        this._peerMap[key] = this._reset(peer);

        return key;
    };


    Peers.prototype.remove = function (key) {


        if (typeof key === 'function') {

            this.each(function (peer) {
                if (key(peer) === true) {
                    this.remove(peer.id);
                }
            }, this);

            return;
        }

        if (key in this._peerMap) {
            delete this._peerMap[key];
            this._length--;
        }
    };


    Peers.prototype.each = function (fn, context) {
        for (let _key in this._peerMap) {
            fn.call(context, this._peerMap[_key]);
        }
    };

    Peers.prototype.reset = function () {
        this.each(function (peer) {
            this._reset(peer);
        }, this);
    };

    Peers.prototype._reset = function (peer) {
        if (peer instanceof Array) {
            peer.map(Peers._reset, Peers);
            return null;
        }

        peer.weight = helper.toInt(peer.weight) || 0;
        peer.currentWeight = helper.toInt(peer.weight) || 0;
        peer.effectiveWeight = helper.toInt(peer.weight) || 0;

        return peer;
    };


    Peers.prototype.get = function () {

        let bestPeer, peer, peerKey;

        if (this._length === 0) {
            return null;
        }


        if (this._length === 1) {
            for (peerKey in this._peerMap) {
                break;
            }
            return this._peerMap[peerKey];
        }

        let totalEffectiveWeight = 0;

        for (peerKey in this._peerMap) {
            peer = this._peerMap[peerKey];

            totalEffectiveWeight += peer.effectiveWeight;
            peer.currentWeight += peer.effectiveWeight;

            if (peer.effectiveWeight < peer.weight) {
                peer.effectiveWeight++;
            }


            if (!bestPeer || bestPeer.currentWeight < peer.currentWeight) {
                bestPeer = peer;
            }
        }

        if (bestPeer) {
            bestPeer.currentWeight -= totalEffectiveWeight;
        }

        return bestPeer;
    };

    module.exports = Peers;
})();
