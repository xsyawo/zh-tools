export interface TreeOptions {
  /** 节点 ID 字段名，默认 'id' */
  idKey?: string
  /** 父节点 ID 字段名，默认 'parentId' */
  parentIdKey?: string
  /** 子节点字段名，默认 'children' */
  childrenKey?: string
  /** 根节点的 parentId 值，默认 null */
  rootValue?: any
}

export interface TreeNode<T = any> extends Record<string, any> {
  children?: TreeNode<T>[]
}

function getOptions(options?: TreeOptions): Required<TreeOptions> {
  return {
    idKey: 'id',
    parentIdKey: 'parentId',
    childrenKey: 'children',
    rootValue: null,
    ...options,
  }
}

/**
 * 将扁平列表转为树形结构
 * @param list - 扁平数据列表
 * @param options - 配置选项
 * @returns 树形结构数组
 * @example listToTree([{ id: 1, parentId: null, name: 'Root' }])
 */
export function listToTree<T extends Record<string, any>>(list: T[], options?: TreeOptions): TreeNode<T>[] {
  const opts = getOptions(options)
  const { idKey, parentIdKey, childrenKey, rootValue } = opts
  const map = new Map<any, TreeNode<T>>()
  const tree: TreeNode<T>[] = []

  for (const item of list) {
    map.set(item[idKey], { ...item, [childrenKey]: [] })
  }

  for (const item of list) {
    const node = map.get(item[idKey])!
    const parentId = item[parentIdKey]
    if (parentId === rootValue || parentId === undefined || parentId === null) {
      tree.push(node)
    } else {
      const parent = map.get(parentId)
      if (parent) {
        parent[childrenKey].push(node)
      } else {
        // 父节点不在当前列表中，作为根节点处理
        tree.push(node)
      }
    }
  }

  return tree
}

/**
 * 将树形结构展平为列表（深度优先）
 * @param tree - 树形结构数组
 * @param options - 配置选项
 * @returns 扁平列表
 */
export function treeToList<T>(tree: TreeNode<T>[], options?: TreeOptions): T[] {
  const opts = getOptions(options)
  const { childrenKey } = opts
  const result: T[] = []

  function walk(nodes: TreeNode<T>[]) {
    for (const node of nodes) {
      const { [childrenKey]: children, ...rest } = node
      result.push(rest as T)
      if (children?.length) {
        walk(children)
      }
    }
  }

  walk(tree)
  return result
}

/**
 * 递归查找树节点，返回第一个匹配的节点
 * @param tree - 树形结构数组
 * @param predicate - 匹配函数
 * @returns 匹配的节点或 null
 */
export function findTreeNode<T>(tree: TreeNode<T>[], predicate: (node: TreeNode<T>) => boolean): TreeNode<T> | null {
  for (const node of tree) {
    if (predicate(node)) return node
    if (node.children?.length) {
      const found = findTreeNode(node.children, predicate)
      if (found) return found
    }
  }
  return null
}

/**
 * 查找节点路径（从根到目标节点），用于面包屑导航
 * @param tree - 树形结构数组
 * @param predicate - 匹配函数
 * @returns 路径节点数组
 */
export function findTreePath<T>(tree: TreeNode<T>[], predicate: (node: TreeNode<T>) => boolean): TreeNode<T>[] {
  for (const node of tree) {
    if (predicate(node)) return [node]
    if (node.children?.length) {
      const path = findTreePath(node.children, predicate)
      if (path.length) {
        return [node, ...path]
      }
    }
  }
  return []
}

/**
 * 过滤树节点（保留层级关系，子节点匹配则保留父节点）
 * @param tree - 树形结构数组
 * @param predicate - 匹配函数
 * @returns 过滤后的树
 */
export function filterTree<T>(tree: TreeNode<T>[], predicate: (node: TreeNode<T>) => boolean): TreeNode<T>[] {
  const result: TreeNode<T>[] = []
  for (const node of tree) {
    const children = node.children?.length ? filterTree(node.children, predicate) : []
    if (predicate(node) || children.length) {
      result.push({ ...node, children: children.length ? children : undefined })
    }
  }
  return result
}

/**
 * 遍历树节点（广度优先）
 * @param tree - 树形结构数组
 * @param fn - 回调函数
 */
export function walkTree<T>(tree: TreeNode<T>[], fn: (node: TreeNode<T>) => void): void {
  const queue = [...tree]
  let head = 0
  while (head < queue.length) {
    const node = queue[head++]
    fn(node)
    if (node.children?.length) {
      queue.push(...node.children)
    }
  }
}

/**
 * 映射树节点生成新树
 * @param tree - 树形结构数组
 * @param fn - 映射函数
 * @returns 新树
 */
export function mapTree<T, R>(tree: TreeNode<T>[], fn: (node: TreeNode<T>) => R): R[] {
  return tree.map(node => {
    const newNode = fn(node)
    if (node.children?.length) {
      ;(newNode as any).children = mapTree(node.children, fn)
    }
    return newNode
  })
}
