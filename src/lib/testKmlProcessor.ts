import { processGeoFile } from './kmzProcessor.ts';

async function testKmlProcessing() {
  // Create a mock KML file
  const kmlContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <kml xmlns="http://www.opengis.net/kml/2.2">
      <Document>
        <name>Test KML</name>
        <GroundOverlay>
          <name>Test Overlay</name>
          <Icon>
            <href>test-image.jpg</href>
          </Icon>
          <LatLonBox>
            <north>40.0</north>
            <south>30.0</south>
            <east>-100.0</east>
            <west>-110.0</west>
          </LatLonBox>
        </GroundOverlay>
      </Document>
    </kml>
  `;

  // Create a Blob from the KML content
  const kmlBlob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
  const kmlFile = new File([kmlBlob], 'test.kml', { type: 'application/vnd.google-earth.kml+xml' });

  try {
    const result = await processGeoFile(kmlFile);
    console.log('KML Processing Result:', result);
  } catch (error) {
    console.error('Error processing KML file:', error);
  }
}

testKmlProcessing();
