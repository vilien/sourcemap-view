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
 * View the original code from the sourcemap based on the error lineno and colno. 
 * @param {string} sourcemap 
 */
const sourcemapView = (sourcemap: Sourcemap) => {

  const mappings = (sourcemap.mappings || '').split(';').map(
    (line: string) => line.split(',')
  );

  return (lineNo: number, colNo: number) => {
    const line = lineNo - 1;
    const col = colNo - 1;
    // Wrong line.
    if (!mappings[line]) return null;

    // Find the map.
    let map: number[] = [];
    mappings[line].some((item: string) => {
      const c = decode(item);
      map = [
        (map[0] || 0) + c[0],
        (map[1] || 0) + (c[1] || 0),
        (map[2] || 0) + (c[2] || 0),
        (map[3] || 0) + (c[3] || 0),
        (map[4] || 0) + (c[4] || 0),
      ];
      return map[0] >= col;
    });

    // Wrong col.
    if (map[0] !== col) return null;

    return {
      file: map[1] && sourcemap.sources ? sourcemap.sources[map[1]] : null,
      lineNo: map[2] ? map[2] + 1 : 0,
      colNo: map[3] ? map[3] + 1 : 0,
      name: map[4] && sourcemap.names ? sourcemap.names[map[4]]: null,
      content: map[1] && sourcemap.sourcesContent ? sourcemap.sourcesContent[map[1]] : null,
    };
  }
}

export default sourcemapView;
