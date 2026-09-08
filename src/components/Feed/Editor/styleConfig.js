/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const ALLOWED_COLORS = [
  'rgb(0, 0, 0)',
  'rgb(255, 255, 255)',
  'rgb(255, 0, 0)',
  'rgb(0, 255, 0)',
  'rgb(0, 0, 255)',
  'rgb(255, 255, 0)',
  'rgb(255, 0, 255)',
  'rgb(0, 255, 255)',
];

const ALLOWED_FONT_SIZES = ['10px', '12px', '14px', '15px', '16px', '18px', '20px', '24px'];

export function parseAllowedColor(input) {
  return ALLOWED_COLORS.includes(input) ? input : '';
}

export function parseAllowedFontSize(input) {
  return ALLOWED_FONT_SIZES.includes(input) ? input : '';
}
