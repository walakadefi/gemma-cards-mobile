const appConfig = require('../../app.json').expo;
const easConfig = require('../../eas.json');

describe('native app configuration', () => {
  it('defines stable iOS and Android application identities', () => {
    expect(appConfig.ios).toMatchObject({ bundleIdentifier: 'com.gemmacards.app', buildNumber: '1', supportsTablet: true });
    expect(appConfig.android).toMatchObject({ package: 'com.gemmacards.app', versionCode: 1, edgeToEdgeEnabled: true, permissions: [] });
  });

  it('references native icon and splash assets', () => {
    expect(appConfig.icon).toBe('./assets/icon.png');
    expect(appConfig.android.adaptiveIcon).toMatchObject({ foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#050506' });
    expect(appConfig.splash).toMatchObject({ image: './assets/splash-icon.png', backgroundColor: '#050506' });
  });

  it('provides internal and production build profiles', () => {
    expect(easConfig.build.development.developmentClient).toBe(true);
    expect(easConfig.build.preview.distribution).toBe('internal');
    expect(easConfig.build.production.autoIncrement).toBe(true);
  });

  it('exports route HTML for worldwide web hosting', () => {
    expect(appConfig.web).toMatchObject({ output: 'static' });
  });
});
