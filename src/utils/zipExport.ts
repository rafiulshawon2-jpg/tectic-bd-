import JSZip from 'jszip';
import { EXTENSION_FILES } from '../services/extensionSource';

export async function downloadExtensionZip(): Promise<void> {
  const zip = new JSZip();

  // Add all extension files to root of the zip archive
  for (const file of EXTENSION_FILES) {
    zip.file(file.path, file.content);
  }

  // Add README instructions inside the zip
  const readmeContent = `# TecTic Bd – Smart Group Publisher Chrome Extension
Version: 1.0.0
Author: TecTic Bd

## Installation Instructions (Takes 30 seconds):

1. Unzip this downloaded archive into a folder on your computer (e.g. ~/Downloads/tectic-bd-extension).
2. Open Google Chrome and type in the address bar:
   chrome://extensions
3. In the top-right corner of the Extensions page, enable "Developer mode" (toggle switch).
4. Click the "Load unpacked" button in the top-left corner.
5. Select the unzipped folder containing manifest.json.
6. Done! The TecTic Bd publisher icon will appear in your Chrome toolbar.
7. Click the extension icon to verify "Connected" status with the web dashboard.
`;
  zip.file('README.txt', readmeContent);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);

  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'tectic-bd-group-publisher-extension-v1.0.0.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
