import Ember, { Component, computed, inject } from 'ember';
import mixin from 'someMixin';
import layout from 'layout';

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

  baz: Ember.computed.alias('foo.bar'),

  _secretMethod() {
    // custom secret method logic
  },

  vehicle: alias('car'),
});
