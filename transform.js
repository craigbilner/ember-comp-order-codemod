const TYPES = {
  SERVICE: 'SERVICE',
  DEFAULTVAL: 'DEFAULTVAL',
  COMPSINGLE: 'COMPSINGLE',
  COMPMULTI: 'COMPMULTI',
  OBSERVER: 'OBSERVER',
  LIFECYCLE: 'LIFECYCLE',
  ACTIONS: 'ACTIONS',
  CUSTOM: 'CUSTOM',
};

const ORDER = {
  [TYPES.SERVICE]: 1,
  [TYPES.DEFAULTVAL]: 2,
  [TYPES.COMPSINGLE]: 3,
  [TYPES.COMPMULTI]: 4,
  [TYPES.OBSERVER]: 5,
  [TYPES.LIFECYCLE]: 6,
  [TYPES.ACTIONS]: 7,
  [TYPES.CUSTOM]: 8,
};

const LIFECYCLEEVENTS = [
  'init',
  'didReceiveAttrs',
  'willRender',
  'didInsertElement',
  'didRender',
  'didUpdateAttrs',
  'didReceiveAttrs',
  'willUpdate',
  'willRender',
  'didUpdate',
  'didRender',
  'willDestroyElement',
  'willClearRender',
  'didDestroyElement',
];

const isQualifiedComponent = j => [
  j.CallExpression,
  {
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'MemberExpression',
        property: {
          type: 'Identifier',
          name: 'Component',
        },
      },
      property: {
        type: 'Identifier',
        name: 'extend',
      },
    },
  },
];

const isExtendedComponent = j => [
  j.CallExpression,
  {
    callee: {
      type: 'MemberExpression',
      object: {
        type: 'Identifier',
        name: 'Component',
      },
      property: {
        type: 'Identifier',
        name: 'extend',
      },
    },
  },
];

const getComponents = (j, root) => {
  const emberComps = root.find(...isQualifiedComponent(j));
  const comps = root.find(...isExtendedComponent(j));
  const nodes = [];

  emberComps.forEach(value => nodes.push(value.node));
  comps.forEach(value => nodes.push(value.node));

  return nodes;
};

const isLifecycle = name => LIFECYCLEEVENTS.includes(name);

const isService = ({ value: { callee } }) =>
callee
&& ((callee.name === 'service')
|| (callee.object
&& callee.object.object
&& callee.object.object.name === 'Ember'
&& callee.object.property.name === 'inject'
&& callee.property.name === 'service'));

const isDefaultValue = ({ value: { type } }) =>
type === 'Identifier' || type === 'Literal' || type === 'ArrayExpression' || type === 'ConditionalExpression';

const isObserver = ({ value: { type, callee: { name, object, property } = {} } }) =>
type === 'CallExpression'
&& ((name === 'observer') || (object && object.name === 'Ember' && property.name === 'observer'));

const isSingleLineCall = ({ value: { type, loc } }) => type === 'CallExpression' && loc.start.line === loc.end.line;

const isCallExpression = ({ value: { type } }) => type === 'CallExpression';

const isLifecycleMethod = ({ value: { type }, key: { name } }) => type === 'FunctionExpression' && isLifecycle(name);

const isActionBlock = ({ key: { name } }) => name === 'actions';

const categoriseProps = (node) => {
  let type;

  if (isService(node)) {
    type = TYPES.SERVICE;
  } else if (isDefaultValue(node)) {
    type = TYPES.DEFAULTVAL;
  } else if (isObserver(node)) {
    type = TYPES.OBSERVER;
  } else if (isSingleLineCall(node)) {
    type = TYPES.COMPSINGLE;
  } else if (isCallExpression(node)) {
    type = TYPES.COMPMULTI;
  } else if (isLifecycleMethod(node)) {
    type = TYPES.LIFECYCLE;
  } else if (isActionBlock(node)) {
    type = TYPES.ACTIONS;
  } else {
    type = TYPES.CUSTOM;
  }

  return {
    type,
    node,
  };
};

const byName = (a, b) => {
  if (a.node.key.name > b.node.key.name) {
    return 1;
  }

  if (a.node.key.name < b.node.key.name) {
    return -1;
  }

  return 0;
};

const sortByType = (a, b) => {
  if (ORDER[a.type] > ORDER[b.type]) {
    return 1;
  }

  if (ORDER[a.type] < ORDER[b.type]) {
    return -1;
  }

  return 0;
};

const toNode = ({ node }) => node;

const orderProps = props =>
  props.map(categoriseProps).sort(byName).sort(sortByType).map(toNode);

const transform = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);

  const components = getComponents(j, root);
  components.forEach((node) => {
    const objIndx = node.arguments.length - 1;

    if (node.arguments[objIndx].type === 'ObjectExpression') {
      /* eslint-disable no-param-reassign */
      node.arguments[objIndx].properties = orderProps(node.arguments[objIndx].properties);
      /* eslint-disable no-param-reassign */
    }
  });

  return root.toSource();
};

module.exports = transform;
