
'use strict';

jest.autoMockOff();
const defineTest = require('jscodeshift/dist/testUtils').defineTest;

defineTest(__dirname, 'transform', null, 'reorder-component');
defineTest(__dirname, 'transform', null, 'ignores-identifier');
