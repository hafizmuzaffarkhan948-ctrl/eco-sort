
import { BinCategory, BinInfo } from './types';

export const BIN_GUIDE: BinInfo[] = [
  {
    category: BinCategory.GREEN,
    colorClass: 'bg-green-500',
    bgClass: 'bg-green-50',
    textClass: 'text-green-800',
    labelEn: 'Recycle',
    labelUr: 'ری سائیکل',
    itemsEn: ['Clean plastic bottles', 'Metal cans', 'Clean cardboard']
  },
  {
    category: BinCategory.YELLOW,
    colorClass: 'bg-yellow-400',
    bgClass: 'bg-yellow-50',
    textClass: 'text-yellow-800',
    labelEn: 'Compost',
    labelUr: 'کھاد',
    itemsEn: ['Food waste', 'Organic waste', 'Dirty pizza boxes']
  },
  {
    category: BinCategory.RED,
    colorClass: 'bg-red-500',
    bgClass: 'bg-red-50',
    textClass: 'text-red-800',
    labelEn: 'Hazard',
    labelUr: 'خطرناک',
    itemsEn: ['Batteries', 'Electronics', 'Chemicals', 'Medical']
  },
  {
    category: BinCategory.GREY,
    colorClass: 'bg-gray-500',
    bgClass: 'bg-gray-50',
    textClass: 'text-gray-800',
    labelEn: 'Trash',
    labelUr: 'کچرا',
    itemsEn: ['Wrappers', 'Soft plastic', 'Unrecognizable items']
  }
];
