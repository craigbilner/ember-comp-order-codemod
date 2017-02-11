# Ember comp order codemod

To conform to [this linting rule](https://github.com/netguru/eslint-plugin-ember/blob/master/docs/rules/order-in-components.md),
this codemod sorts an Ember component's properties to an agreed standard.

## Changes

### willChange

```js
import Ember, { Component, computed, inject } from 'ember';
import mixin from 'someMixin';
import layout from 'layout';
import ENUM from 'enum';

const { service } = inject;
const { alias } = computed;

export default Component.extend(mixin, {
  role: 'sloth',

  i18n: service(),

  classNames: ['foo', 'bar'],

  classNameBindings: ['foo.bar', 'bar.baz'],

  animationDelay: Ember.testing ? 10 : 20,

  onVehicleChange: observer('vehicle', function() {
    // observer logic
  }),

  layout,

  levelOfHappiness: computed('attitude', 'health', function() {
    return this.get('attitude') * this.get('health') * Math.random();
  }),

  user: Ember.inject.service('user'),

  init() {
    // custom init logic
  },

  onTestChange: Ember.observer('test', function() {
    // observer logic
  }),

  actions: {
    sneakyAction() {
      return this._secretMethod();
    }
  },

  didInsertElement() {
    // custom didInsertElement logic
  },

  foo: ENUM.BAR,

  baz: Ember.computed.alias('foo.bar'),

  _secretMethod() {
    // custom secret method logic
  },

  vehicle: alias('car'),
});
```

will become

```js
import Ember, { Component, computed, inject } from 'ember';
import mixin from 'someMixin';
import layout from 'layout';
import ENUM from 'enum';

const { service } = inject;
const { alias } = computed;

export default Component.extend(mixin, {
  i18n: service(),

  user: Ember.inject.service('user'),

  animationDelay: Ember.testing ? 10 : 20,

  classNameBindings: ['foo.bar', 'bar.baz'],

  classNames: ['foo', 'bar'],

  foo: ENUM.BAR,

  layout,

  role: 'sloth',

  baz: Ember.computed.alias('foo.bar'),

  vehicle: alias('car'),

  levelOfHappiness: computed('attitude', 'health', function() {
    return this.get('attitude') * this.get('health') * Math.random();
  }),

  onTestChange: Ember.observer('test', function() {
    // observer logic
  }),

  onVehicleChange: observer('vehicle', function() {
    // observer logic
  }),

  didInsertElement() {
    // custom didInsertElement logic
  },

  init() {
    // custom init logic
  },

  actions: {
    sneakyAction() {
      return this._secretMethod();
    }
  },

  _secretMethod() {
    // custom secret method logic
  },
});
```

### wontChange

named configs

```js
import Ember from 'ember';
import componentConfig from 'config';

export default Ember.Component.extend(componentConfig);
```