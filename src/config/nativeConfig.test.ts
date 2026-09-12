import { readFileSync } from 'fs';
import { resolve } from 'path';

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
    expect(appConfig.web).toMatchObject({
      output: 'static',
      name: 'GemmaCards',
      shortName: 'GemmaCards',
      favicon: './assets/icon.png',
      themeColor: '#050506',
      backgroundColor: '#050506',
    });
  });

  it('configures app-version-based EAS updates for this Expo project', () => {
    expect(appConfig.runtimeVersion).toEqual({ policy: 'appVersion' });
    expect(appConfig.updates).toEqual({
      url: 'https://u.expo.dev/bd9b5e9a-128b-4448-baf4-71974f85c529',
    });
    expect(easConfig.build.preview.channel).toBe('preview');
    expect(easConfig.build.production.channel).toBe('production');
  });

  it('provides a manual-only parameterized update workflow', () => {
    const workflowPath = resolve(__dirname, '../../.eas/workflows/publish-update.yml');
    const workflow = readFileSync(workflowPath, 'utf8');

    expect(workflow).toContain('workflow_dispatch:');
    expect(workflow).toContain('channel: ${{ inputs.channel }}');
    expect(workflow).toContain('platform: ${{ inputs.platform }}');
    expect(workflow).toContain('message: ${{ inputs.message }}');
    expect(workflow).toContain('upload_sentry_sourcemaps: ${{ inputs.upload_sentry_sourcemaps }}');
    expect(workflow).toContain("if: ${{ inputs.rollout_percentage == '10' }}");
    expect(workflow).toContain("if: ${{ inputs.rollout_percentage == '25' }}");
    expect(workflow).toContain("if: ${{ inputs.rollout_percentage == '50' }}");
    expect(workflow).toContain("if: ${{ inputs.rollout_percentage == '100' }}");
    expect(workflow.match(/rollout_percentage: (10|25|50)$/gm)).toHaveLength(3);
    expect(workflow).not.toContain('rollout_percentage: 100');
    expect(workflow).not.toContain('rollout_percentage: ${{ inputs.rollout_percentage }}');
    expect(workflow).not.toContain('push:');
    expect(workflow).not.toContain('private_key_path:');
  });
});
