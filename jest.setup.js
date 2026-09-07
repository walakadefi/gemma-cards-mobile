/* global jest */

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  return {
    Ionicons: ({ name, ...props }) => React.createElement(Text, { ...props, name }, name),
  };
});
