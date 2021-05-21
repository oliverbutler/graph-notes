import yaml from 'js-yaml';
import lineReader from 'line-reader';
import fs from 'fs';
import _ from 'lodash';
import dirTree, { DirectoryTree } from 'directory-tree';
import { v4 as uuidv4 } from 'uuid';

/**
 * Asynchronous wrapper to read lines of a file, allows stopping with a false boolean
 * @param filename
 * @param processLine
 * @returns
 */
function readLines(
  filename: string,
  processLine: (line: string) => Promise<boolean>
): Promise<void> {
  return new Promise((resolve, reject) => {
    lineReader.eachLine(filename, (line, last, callback) => {
      if (!callback) throw new Error('panic');
      processLine(line)
        .then((result: boolean) =>
          result ? (last ? resolve() : callback()) : resolve()
        )
        .catch(reject);
    });
  });
}

interface XeoMarkdownHeaderIcon {
  emoji?: string;
  uri?: string;
}

interface XeoMarkdownHeaderCoverPhoto {
  uri?: string;
}

interface XeoMarkdownHeaderGraphProperties {
  locked?: boolean;
  hidden: boolean;
}

/**
 * Unknown object, possibly has these valid fields
 */
interface XeoMarkdownHeaderUnsanitized {
  id?: string;
  xeoVersion?: number;
  database?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  synchronizedAt?: string;
  icon?: XeoMarkdownHeaderIcon;
  coverPhoto?: XeoMarkdownHeaderCoverPhoto;
  tags?: string[];
  links?: string[];
  graph?: XeoMarkdownHeaderGraphProperties;
  properties?: Record<string, any>; // todo flesh this definition out
}

/**
 * Valid implementation of the Xeo markdown header, has specific required fields
 */
interface XeoMarkdownHeader {
  id: string;
  xeoVersion: number;
  database?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  synchronizedAt?: string;
  icon?: XeoMarkdownHeaderIcon;
  coverPhoto?: XeoMarkdownHeaderCoverPhoto;
  tags: string[];
  links: string[];
  graph: XeoMarkdownHeaderGraphProperties;
  properties?: Record<string, any>; // todo flesh this definition out
}

/**
 * Check if header is valid implementation
 *
 * todo make more accurate
 */
export const isValidXeoMarkdownHeader = (
  header: XeoMarkdownHeaderUnsanitized
): header is XeoMarkdownHeader => {
  if (typeof header.id !== 'string') return false;
  if (typeof header.xeoVersion !== 'number') return false;

  return true;
};

/**
 * Returns the YAML header of (any) file and returns the JSON interpretation
 *
 * @param path
 * @returns
 */
export const readMarkdownHeader = async (path: string): Promise<any | null> => {
  let index = 0;
  let yamlString: string[] = [];

  // hack for empty file
  if (fs.readFileSync(path).length === 0) return null;

  await readLines(path, async (line) => {
    // End if not YAML
    if (index == 0 && line !== '---') return false;
    // End if end of YAML
    if (index > 0 && line === '---') return false;

    yamlString.push(line);
    index++;
    return true;
  });

  const json: any = yaml.load(yamlString.join('\n'));

  if (!json) return null;

  return json;
};

/**
 * Read a markdown header, returns the header if it is valid
 * @param path
 * @returns
 */
export const readXeoMarkdownHeader = async (
  path: string
): Promise<XeoMarkdownHeader | null> => {
  const result = await readMarkdownHeader(path);

  if (!result) return null;

  if (!result.xeo) return null;

  const xeo = result.xeo;

  if (isValidXeoMarkdownHeader(xeo)) return xeo;
  else return null;
};

/**
 * Write/override Xeo markdown header
 *
 * @param path
 * @param header
 */
export const writeXeoMarkdownHeader = async (
  path: string,
  header: XeoMarkdownHeader
) => {
  // Read the existing header, override xeo property but keep others
  const existingHeader = await readMarkdownHeader(path);

  let newYamlString = yaml
    .dump({
      ...existingHeader,
      xeo: header,
    })
    .split('\n');

  newYamlString.unshift('---');
  newYamlString[newYamlString.length - 1] = '---';

  // make life easier, read whole file to an array
  let fileContent = fs.readFileSync(path).toString().split('\n');

  // Find
  let finalIndex = 0;
  for (let i = 1; i < fileContent.length; i++) {
    if (fileContent[0] !== '---') {
      break;
    }
    if (fileContent[i] === '---') {
      finalIndex = i + 1;
      break;
    }
  }

  // Remove the existing header
  fileContent = fileContent.slice(finalIndex, fileContent.length);

  fileContent = newYamlString.concat(fileContent);

  fs.writeFileSync(path, fileContent.join('\n'), {
    encoding: 'utf8',
    flag: 'w',
  });
};

/**
 * Generate new Xeo header and write it to an existing file
 *
 * @param path
 */
export const generateXeoMarkdownHeader = async (path: string) => {
  const xeoHeader: XeoMarkdownHeader = {
    id: uuidv4(),
    xeoVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
    links: [],
    graph: {
      locked: false,
      hidden: false,
    },
  };

  await writeXeoMarkdownHeader(path, xeoHeader);
};

/**
 * Build a file tree from a given directory
 *
 * @param path
 * @returns DirectoryTree
 */
export const getFileTree = (path: string): DirectoryTree => {
  const tree = dirTree(path);

  return tree;
};

interface VaultDirectoryTree extends DirectoryTree {
  pageId?: string;
  children?: VaultDirectoryTree[];
}

interface RecursiveProps {
  tree?: VaultDirectoryTree;
  pages?: Record<string, XeoMarkdownHeader>;
}

/**
 * For each of the leafs in the tree, add the respective page ID, and also return an array of the cumulative xeo headers
 *
 * todo if the MD file has no header, initialize one
 *
 * @param tree
 */
const recursivelyPopulateDirectoryTree = async (
  tree: DirectoryTree
): Promise<RecursiveProps> => {
  // console.log(tree);

  let xeoHeader = await (tree.extension === '.md' && tree.type === 'file'
    ? readXeoMarkdownHeader(tree.path)
    : undefined);

  // if the markdown header isn't present, create it, also preserve any other YAML a user may have created
  if (tree.type === 'file' && tree.extension === '.md' && !xeoHeader) {
    console.log('re-generating: ', tree.path);
    generateXeoMarkdownHeader(tree.path);
  }

  const returned = await (tree.children
    ? Promise.all(
        tree.children.map((childTree) => {
          return recursivelyPopulateDirectoryTree(childTree);
        })
      )
    : undefined);

  let returnedXeoHeaders: Record<string, XeoMarkdownHeader> = {};
  let children: VaultDirectoryTree[] = [];

  if (returned)
    returned.forEach((r) => {
      r.tree && children.push(r.tree);
      if (r.pages) returnedXeoHeaders = { ...returnedXeoHeaders, ...r.pages };
    });

  // Push the curr files xeo header
  if (xeoHeader) {
    returnedXeoHeaders[xeoHeader.id] = xeoHeader;
  }

  const newTree: VaultDirectoryTree = {
    ...tree,
    pageId: xeoHeader?.id,
    children: children,
  };

  return {
    tree: newTree,
    pages: returnedXeoHeaders,
  };
};

/**
 * Returns a populated directory
 * @param path
 */
export const getPopulatedFileTree = async (
  path: string
): Promise<RecursiveProps> => {
  const tree = getFileTree(path);

  return recursivelyPopulateDirectoryTree(tree);
};
