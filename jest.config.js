module.exports = {
  preset: 'react-native',
  //preset: '@testing-library/react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // moduleNameMapper: {
  //   '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
  //     'jest-transform-stub',
  //   '\\.(css|less)$': 'identity-obj-proxy',
  // },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@?react-navigation)',
  ],
};
