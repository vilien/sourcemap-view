import { decode } from 'vlq';

interface Sourcemap {
  version: number,
  sources: string[],
  names: string[],
  mappings: string,
  file: string,
  sourcesContent: string[],
  sourceRoot: string
}

/**
 * Accumulate map by vlq code
 * @param origin Origin map
 * @param vlq    Vlq code
 */
const accMap = (origin: number[], vlq: string) => {
  const source = decode(vlq);
  origin[0] = (origin[0] || 0) + (source[0] || 0);
  origin[1] = (origin[1] || 0) + (source[1] || 0);
  origin[2] = (origin[2] || 0) + (source[2] || 0);
  origin[3] = (origin[3] || 0) + (source[3] || 0);
  origin[4] = (origin[4] || 0) + (source[4] || 0);
  return origin;
}

/**
 * View the original code from the sourcemap based on the error lineno and colno. 
 * @param {string} sourcemap 
 */
const sourcemapView = (sourcemap: Sourcemap) => {

  const mappings = (sourcemap.mappings || '').split(';').map(
    (line: string) => line.split(',')
  );

  // Cache generated line map
  const prevLineMaps: number[][] = [];

  return (lineNo: number, colNo: number) => {
    const line = lineNo - 1;
    const col = colNo - 1;
    // Wrong line.
    if (!mappings[line]) return null;

    // Init the map, move to previous line map if it exists.
    let map: number[] = prevLineMaps[line - 1] || [];

    // Recaculate when previous line map is not found.
    if (line > 0 && line > prevLineMaps.length) {
      map = prevLineMaps[prevLineMaps.length - 1] || [];
      mappings.some((lineItem, index) => {
        if (index < prevLineMaps.length) return false;
        map[0] = 0; // reset column of next line
        lineItem.forEach(item => accMap(map, item));
        prevLineMaps.push([...map]);
        return index + 1 >= line;
      });
    }

    map[0] = 0; // reset column of next line

    // Pinpoint the map in current line.
    mappings[line].some((item: string) => {
      accMap(map, item);
      return map[0] >= col;
    });

    // Wrong col.
    if (map[0] !== col) return null;

    return {
      file: map[1] && sourcemap.sources ? sourcemap.sources[map[1]] : null,
      lineNo: map[2] ? map[2] + 1 : 0,
      colNo: map[3] ? map[3] : 0,
      name: map[4] && sourcemap.names ? sourcemap.names[map[4]]: null,
      content: map[1] && sourcemap.sourcesContent ? sourcemap.sourcesContent[map[1]] : null,
    };
  }
}

export default sourcemapView;
