/**
 iZ³ | Izzzio blockchain - https://izzz.io

 Copyright 2018 Izio LLC (OOO "Изио")

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

const logger = new (require('./logger'))();
const storj = require('./instanceStorage');
const KeyValue = require('./keyvalue');
const CacheStorage = require('./cacheStorage')
const levelup = require('levelup');
const memdown = require('memdown');
const leveldown = require('leveldown');

/**
 * Blockchain manager object
 * Provide some useful functional for data synchronization
 */

class Blockchain {
    constructor() {
        this.config = storj.get('config');
        //this.levelup = levelup(leveldown(this.config.workDir + '/blocks'));
        //this.levelup = levelup(memdown());//levelup(this.config.workDir + '/blocks');
        this.db = new KeyValue(this.config.blocksDB);
        this.cache = CacheStorage(this.config['cacheLiveTime']);
    }

    getLevelup() {
        return this.db.getLevelup();
    }

    getDb() {
        return this.db;
    }

    get(key, callback) {
        let that = this;
        that.db.get(key, callback);
    }

    put(key, value, callback) {
        let that = this;
        that.db.put(key, value, callback);
    }

    async getAsync(key) {
      if (this.cache.isInCache(key)) {
        return this.cache.get(key);
      }
      let value = await this.db.getAsync(key);
      this.cache.add(key, value);
      return value;

      // return this.db.getAsync(key).then(
      //   function(value) {
      //     cache.add(value);
      //     return value;
      //   }
      // ).catch(
      //   function(error) {
      //     throwError();
      //   }
      // );
    }

    putAsync(key, data) {
        return this.db.putAsync(key, data);
    }

    del(key, callback) {
        let that = this;
        that.db.del(key, callback);
    }

    delAsync(key) {
        return this.db.delAsync(key);
    }

    close(callback) {
        let that = this;
        that.db.close(callback);
    }

    closeAsync() {
        return this.db.closeAsync();
    }

    save(callback) {
        let that = this;
        that.db.save(callback);
    }

    saveAsync() {
        return this.db.saveAsync();
    }
}

module.exports = Blockchain;
