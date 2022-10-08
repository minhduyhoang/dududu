import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject('CACHE_MANAGER') private cacheManager: Cache) {}

  private defaultTtl = 3600; // 1 hour

  async clearCacheByPattern(pattern: string) {
    const keys = await this.cacheManager.store.keys();
    const userCaches = keys.filter((el: string) => el.includes(pattern));
    if (userCaches.length > 0) await this.cacheManager.del(userCaches);
  }

  async reset() {
    await this.cacheManager.reset();
  }

  async get(key: string): Promise<any> {
    const value: any = await this.cacheManager.get(key);

    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  async set(key: string, value: string | Record<string, any>, ttlInSec?: number): Promise<any> {
    const ttl = ttlInSec ? ttlInSec : this.defaultTtl;

    if (ttl >= 0) await this.cacheManager.set(key, JSON.stringify(value), { ttl });
    else await this.cacheManager.set(key, JSON.stringify(value));
  }

  async exist(key: string): Promise<boolean> {
    const num = await this.cacheManager.get(key);

    return !!num;
  }

  async del(key: string) {
    return this.cacheManager.del(key);
  }

  async setLock(identifier: string, ttl: number): Promise<boolean> {
    const key = `lock:${identifier}`;
    const lock = await this.cacheManager.get(key);
    if (lock) {
      return true;
    } else {
      await this.cacheManager.set(key, 'true', { ttl });
      return false;
    }
  }

  async remember(key: string, cb: Function, ttlInSec?: number): Promise<any> {
    const exists = await this.get(key);
    if (!exists) {
      try {
        const response = await cb();
        if (ttlInSec) {
          await this.set(key, response, ttlInSec);
        } else {
          await this.set(key, response);
        }
        return response;
      } catch (error) {
        return null;
      }
    }
    return exists;
  }
}
