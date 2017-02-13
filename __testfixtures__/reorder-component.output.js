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
