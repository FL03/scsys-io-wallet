/*
  Appellation: settings-screen <module>
  Contrib: @FL03
*/
'use client';
//
import * as React from 'react';
//
// components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// feature-specific
import { SettingsTabs } from '../widgets';

export const ConfigurationPanel: React.FC<
  React.ComponentProps<typeof Card>
> = ({ ...props }) => {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsTabs/>
      </CardContent>
    </Card>
  );
};
ConfigurationPanel.displayName = 'SettingsScreen';

export default ConfigurationPanel;
