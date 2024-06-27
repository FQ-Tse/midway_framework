/* eslint-disable node/no-unpublished-import */
import { Inject } from '@midwayjs/core';
import { TypeORMDataSourceManager } from '@midwayjs/typeorm';
import { format, parseISO } from 'date-fns';
import _ from 'lodash';
import { IObject } from '../interfaces';

export abstract class BaseService {
  @Inject()
  dataSourceManager: TypeORMDataSourceManager;

  /**
   * 设置sql
   * @param condition 条件是否成立
   * @param sql sql语句
   * @param params 参数
   */
  setSql(condition, sql, params) {
    let rSql = false;
    if (condition || (condition === 0 && condition !== '')) {
      rSql = true;
      for (let i = 0; i < params.length; i++) {
        if (typeof params[i] === 'string') {
          sql = sql.replace('?', `'${params[i]}'`);
        }
        if (typeof params[i] === 'number') {
          sql = sql.replace('?', params[i]);
        }
        // console.log(Object.prototype.toString.call(params[i]));
        if (Object.prototype.toString.call(params[i]) === '[object Array]') {
          //如果传入一个数组的情况
          let filter = '';
          params[i].forEach(element => {
            filter += `'${element}',`;
          });
          sql = sql.replace('?', filter.slice(0, filter.length - 1));
        }
      }
    }
    return rSql ? sql : '';
  }

  /**
   * 原生查询（获取数据源管理，并进行sql查询）
   * @param DataSourceName 数据源
   * @param sql sql语句
   * @param query 入参
   */
  async getDataSource(DataSourceName, sql, query) {
    const { page, size, order = 'createTime', sort } = query;
    const offset = page ? (page - 1) * size : 0;
    const dataSource = this.dataSourceManager.getDataSource(DataSourceName);
    if (page && size) {
      let filter = '';
      if (sort) {
        filter = sort;
      } else {
        filter = 'DESC';
      }

      if (sql.toLowerCase().indexOf('order by') !== -1) {
        sql += ` LIMIT ${offset},${size}`;
      } else {
        sql += ` ORDER BY ${order} ${filter} LIMIT ${offset},${size}`;
      }
    }
    const queryRunner = dataSource.createQueryRunner();
    const result = await queryRunner.query(sql);

    // 将下划线去除并将首字母大写
    for (let i = 0; i < result.length; i++) {
      const newObj = {};
      Object.keys(result[i]).forEach(key => {
        newObj[key.replace(/_(\w)/g, (match, p1) => p1.toUpperCase())] =
          result[i][key];
      });
      result[i] = newObj;
    }
    const dataCount = await queryRunner.query(this.getCountSql(sql));
    await queryRunner.release();
    result.forEach(element => {
      if (element.createTime) {
        element.createTime = format(
          parseISO(element.createTime),
          'yyyy-MM-dd HH:mm:ss'
        );
      }
      if (element.updateTime) {
        element.updateTime = format(
          parseISO(element.updateTime),
          'yyyy-MM-dd HH:mm:ss'
        );
      }
      if (element.payTime) {
        element.payTime = format(
          parseISO(element.payTime),
          'yyyy-MM-dd HH:mm:ss'
        );
      }
    });
    return {
      list: result,
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        total: parseInt(dataCount[0] ? dataCount[0]['count'] : 0),
      },
    };
  }

  async nativeQuery(DataSourceName, sql) {
    const dataSource = this.dataSourceManager.getDataSource(DataSourceName);
    const queryRunner = dataSource.createQueryRunner();
    const result = await queryRunner.query(sql);
    await queryRunner.release();
    result.forEach(element => {
      if (element.createTime) {
        element.createTime = format(
          parseISO(element.createTime),
          'yyyy-MM-dd HH:mm:ss'
        );
      }
      if (element.updateTime) {
        element.updateTime = format(
          parseISO(element.updateTime),
          'yyyy-MM-dd HH:mm:ss'
        );
      }
      if (element.payTime) {
        element.payTime = format(
          parseISO(element.payTime),
          'yyyy-MM-dd HH:mm:ss'
        );
      }
    });
    return result;
  }

  /**
   * 获得查询个数的SQL
   * @param sql
   */
  getCountSql(sql) {
    sql = sql.replace('LIMIT ', 'limit ');
    return `select count(*) as count from (${
      // eslint-disable-next-line no-control-regex
      sql.replace(new RegExp('\n', 'gm'), ' ').split('limit ')[0]
    }) a`;
  }

  /**
   * 参数安全性检查
   * @param params
   */
  async paramSafetyCheck(params) {
    const lp = params.toLowerCase();
    return !(
      lp.indexOf('update ') > -1 ||
      lp.indexOf('select ') > -1 ||
      lp.indexOf('delete ') > -1 ||
      lp.indexOf('insert ') > -1
    );
  }

  /**
   * 设置sql排序
   * @param sql sql语句
   * @param params 参数
   */
  setOrderSql(sql, params) {
    for (let i = 0; i < params.length; i++) {
      if (typeof params[i] === 'string') {
        sql = sql.replace('?', `${params[i]}`);
      }
    }
    return sql;
  }

  /***
   * 生成指定长度的随机码
   * @param length
   */
  randomCode(length) {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // 不包括 I、O
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * 在数组中找到并更新
   * @param array 数组
   * @param searchKey 检索的key
   * @param data 要更新的数据，必须包含检索的key
   * @param opts 可选参数 { ClassT:要实例化的类, isCover: 是否覆盖查找到的数据，默认是不覆盖 }
   */
  public findAndUpdateInArr<T>(
    array: T[],
    searchKey: string,
    data: IObject,
    opts: {
      ClassT?: { new (): T };
      isCover?: boolean;
    } = {}
  ): T {
    const { isCover = false, ClassT } = opts;
    let one = _.find(array, { [searchKey]: data[searchKey] });
    if (one) {
      if (isCover) _.assign(one, data);
    } else {
      const newData = ClassT ? new ClassT() : ({} as T);
      array.push(_.assign(newData, data));
      one = _.last(array);
    }
    return one as T;
  }
}
