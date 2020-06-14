import {CallExpression} from '@babel/types';

export enum CallType {
  NONE,
  NORMAL,
  CALLMEM,
  MEM,
}

/**
 * 仅仅检查 it 与 describe 语句块
 * @param {*} item
 */
export function checkCallExpression(item: CallExpression): CallType {
  if (item.type !== 'CallExpression') {
    return CallType.NONE;
  }

  if (
    item.callee.type === 'Identifier' &&
    (item.callee.name === 'it' || item.callee.name === 'describe')
  ) {
    return CallType.NORMAL;
  }

  if (
    item.callee.type === 'CallExpression' &&
    item.callee.callee.type === 'MemberExpression' &&
    item.callee.callee.object.type === 'Identifier' &&
    item.callee.callee.object.name === 'it'
  ) {
    return CallType.CALLMEM;
  }

  if (
    item.callee.type === 'MemberExpression' &&
    item.callee.object.type === 'Identifier' &&
    (item.callee.object.name === 'it' || item.callee.object.name === 'describe')
  ) {
    return CallType.MEM;
  }

  return CallType.NONE;
}
