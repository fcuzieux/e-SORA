import JSZip from 'jszip';
import { kml } from '@tmcw/togeojson';

export interface ProcessedGeoFile {
  name: string;
  data: any;
  type: 'kml' | 'kmz' | 'geojson';
  images?: ProcessedImage[];
  groundOverlays?: GroundOverlay[];
}

export interface ProcessedImage {
  name: string;
  url: string;
  blob: Blob;
}

export interface GroundOverlay {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  rotation?: number;
  opacity?: number;
}

/**
 * Extracts images from KMZ archive and creates blob URLs
 */
async function extractImagesFromKmz(zip: JSZip): Promise<ProcessedImage[]> {
  const images: ProcessedImage[] = [];
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif'];

  for (const [filename, zipEntry] of Object.entries(zip.files)) {
    if (!zipEntry.dir) {
      const lowerFilename = filename.toLowerCase();
      const isImage = imageExtensions.some(ext => lowerFilename.endsWith(ext));
      
      if (isImage) {
        try {
          const imageBlob = await zipEntry.async('blob');
          const imageUrl = URL.createObjectURL(imageBlob);
          
          images.push({
            name: filename,
            url: imageUrl,
            blob: imageBlob
          });
        } catch (error) {
          console.warn(`Failed to extract image ${filename}:`, error);
        }
      }
    }
  }

  return images;
}

/**
 * Parses GroundOverlay elements from KML document
 */
function parseGroundOverlays(kmlDoc: Document, images: ProcessedImage[]): GroundOverlay[] {
  const groundOverlays: GroundOverlay[] = [];
  const overlayElements = kmlDoc.querySelectorAll('GroundOverlay');

  overlayElements.forEach((overlay, index) => {
    try {
      const name = overlay.querySelector('name')?.textContent || `Ground Overlay ${index + 1}`;
      const description = overlay.querySelector('description')?.textContent || '';
      
      // Get icon/image reference
      const iconElement = overlay.querySelector('Icon href');
      let imageUrl = iconElement?.textContent || '';
      
      // If it's a relative path, find the corresponding extracted image
      if (imageUrl && !imageUrl.startsWith('http')) {
        const matchingImage = images.find(img => 
          img.name === imageUrl || img.name.endsWith(imageUrl)
        );
        if (matchingImage) {
          imageUrl = matchingImage.url;
        }
      }

      // Get LatLonBox bounds
      const latLonBox = overlay.querySelector('LatLonBox');
      if (!latLonBox || !imageUrl) return;

      const north = parseFloat(latLonBox.querySelector('north')?.textContent || '0');
      const south = parseFloat(latLonBox.querySelector('south')?.textContent || '0');
      const east = parseFloat(latLonBox.querySelector('east')?.textContent || '0');
      const west = parseFloat(latLonBox.querySelector('west')?.textContent || '0');
      const rotation = parseFloat(latLonBox.querySelector('rotation')?.textContent || '0');

      // Get color/opacity if available
      const colorElement = overlay.querySelector('color');
      let opacity = 1;
      if (colorElement) {
        const colorValue = colorElement.textContent;
        if (colorValue && colorValue.length === 8) {
          // KML color format is AABBGGRR, alpha is first two characters
          const alpha = parseInt(colorValue.substring(0, 2), 16);
          opacity = alpha / 255;
        }
      }

      groundOverlays.push({
        id: `ground-overlay-${index}`,
        name,
        description,
        imageUrl,
        bounds: { north, south, east, west },
        rotation,
        opacity
      });
    } catch (error) {
      console.warn(`Failed to parse ground overlay ${index}:`, error);
    }
  });

  return groundOverlays;
}

/**
 * Processes KMZ files by extracting and parsing the contained KML and images
 */
export async function processKmzFile(file: File): Promise<ProcessedGeoFile[]> {
  try {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);
    const results: ProcessedGeoFile[] = [];

    // Extract all images first
    const images = await extractImagesFromKmz(zipContent);

    // Look for KML files in the KMZ archive
    for (const [filename, zipEntry] of Object.entries(zipContent.files)) {
      if (filename.toLowerCase().endsWith('.kml') && !zipEntry.dir) {
        try {
          const kmlContent = await zipEntry.async('text');
          const parser = new DOMParser();
          const kmlDoc = parser.parseFromString(kmlContent, 'text/xml');
          
          // Check for parsing errors
          const parserError = kmlDoc.querySelector('parsererror');
          if (parserError) {
            console.warn(`Error parsing KML file ${filename}:`, parserError.textContent);
            continue;
          }

          // Parse ground overlays before converting to GeoJSON
          const groundOverlays = parseGroundOverlays(kmlDoc, images);

          const geoJson = kml(kmlDoc);
          
          if (geoJson && geoJson.features && geoJson.features.length > 0) {
            results.push({
              name: `${file.name}/${filename}`,
              data: geoJson,
              type: 'kmz',
              images,
              groundOverlays
            });
          } else if (groundOverlays.length > 0) {
            // Even if no regular features, include if there are ground overlays
            results.push({
              name: `${file.name}/${filename}`,
              data: { type: 'FeatureCollection', features: [] },
              type: 'kmz',
              images,
              groundOverlays
            });
          }
        } catch (error) {
          console.error(`Error processing KML file ${filename} from KMZ:`, error);
        }
      }
    }

    if (results.length === 0) {
      throw new Error('No valid KML files found in KMZ archive');
    }

    return results;
  } catch (error) {
    console.error('Error processing KMZ file:', error);
    throw new Error(`Failed to process KMZ file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Processes various geo file formats (KML, KMZ, GeoJSON)
 */
export async function processGeoFile(file: File): Promise<ProcessedGeoFile[]> {
  const fileName = file.name.toLowerCase();
  
  try {
    if (fileName.endsWith('.kmz')) {
      return await processKmzFile(file);
    } else if (fileName.endsWith('.kml')) {
      const fileContent = await file.text();
      const parser = new DOMParser();
      const kmlDoc = parser.parseFromString(fileContent, 'text/xml');
      
      // Check for parsing errors
      const parserError = kmlDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error(`Invalid KML file: ${parserError.textContent}`);
      }

      // Parse ground overlays (though KML files won't have embedded images)
      const groundOverlays = parseGroundOverlays(kmlDoc, []);

      const geoJson = kml(kmlDoc);
      
      if (!geoJson || !geoJson.features || geoJson.features.length === 0) {
        if (groundOverlays.length === 0) {
          throw new Error('KML file contains no valid features or ground overlays');
        }
      }

      return [{
        name: file.name,
        data: geoJson || { type: 'FeatureCollection', features: [] },
        type: 'kml',
        groundOverlays
      }];
    } else if (fileName.endsWith('.geojson') || fileName.endsWith('.json')) {
      const fileContent = await file.text();
      const geoJson = JSON.parse(fileContent);
      
      // Validate GeoJSON structure
      if (!geoJson || typeof geoJson !== 'object') {
        throw new Error('Invalid GeoJSON format');
      }
      
      if (!geoJson.features && geoJson.type !== 'Feature' && geoJson.type !== 'FeatureCollection') {
        throw new Error('File does not contain valid GeoJSON features');
      }

      return [{
        name: file.name,
        data: geoJson,
        type: 'geojson'
      }];
    } else {
      throw new Error('Unsupported file format. Please use KML, KMZ, or GeoJSON files.');
    }
  } catch (error) {
    console.error(`Error processing geo file ${file.name}:`, error);
    throw error;
  }
}

/**
 * Validates if a file is a supported geo format
 */
export function isValidGeoFile(file: File): boolean {
  const fileName = file.name.toLowerCase();
  const supportedExtensions = ['.kml', '.kmz', '.geojson', '.json'];
  return supportedExtensions.some(ext => fileName.endsWith(ext));
}

/**
 * Gets the appropriate MIME types for geo file input
 */
export function getGeoFileMimeTypes(): string {
  return '.kml,.kmz,.geojson,.json,application/vnd.google-earth.kml+xml,application/vnd.google-earth.kmz,application/geo+json';
}

/**
 * Cleanup function to revoke blob URLs when no longer needed
 */
export function cleanupImageUrls(images: ProcessedImage[]): void {
  images.forEach(image => {
    URL.revokeObjectURL(image.url);
  });
}