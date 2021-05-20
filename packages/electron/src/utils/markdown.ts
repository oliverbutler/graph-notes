import yaml from 'js-yaml';
import lineReader from 'line-reader';
import _ from 'lodash';
import dirTree, { DirectoryTree } from 'directory-tree';

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
  deletedAt?: null | string;
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

  return json.xeo ? json.xeo : null;
};

/**
 * Read a markdown header, returns the header if it is valid
 * @param path
 * @returns
 */
export const readXeoMarkdownHeader = async (
  path: string
): Promise<XeoMarkdownHeader | undefined> => {
  const result = await readMarkdownHeader(path);

  if (!result) return undefined;

  if (isValidXeoMarkdownHeader(result)) return result;
  else return undefined;
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
 * @param tree
 */
const recursivelyPopulateDirectoryTree = async (
  tree: DirectoryTree
): Promise<RecursiveProps> => {
  const xeoHeader = await (tree.extension === '.md'
    ? readXeoMarkdownHeader(tree.path)
    : undefined);

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

  return await recursivelyPopulateDirectoryTree(tree);
};
