import { describe, it, expect } from 'vitest'
import { listToTree, treeToList, findTreeNode, findTreePath, filterTree, mapTree } from '../src/tree'

const flatData = [
  { id: 1, parentId: null, name: 'Root' },
  { id: 2, parentId: 1, name: 'Child 1' },
  { id: 3, parentId: 1, name: 'Child 2' },
  { id: 4, parentId: 2, name: 'Grandchild' },
]

describe('listToTree', () => {
  it('should convert flat list to tree', () => {
    const tree = listToTree(flatData)
    expect(tree).toHaveLength(1)
    expect(tree[0].name).toBe('Root')
    expect(tree[0].children).toHaveLength(2)
    expect(tree[0].children![0].children).toHaveLength(1)
  })
  it('should handle orphan nodes as roots', () => {
    const data = [
      { id: 1, parentId: null, name: 'A' },
      { id: 2, parentId: 999, name: 'B' },
    ]
    const tree = listToTree(data)
    expect(tree).toHaveLength(2)
  })
  it('should work with custom keys', () => {
    const data = [
      { key: 1, pKey: null, label: 'X' },
      { key: 2, pKey: 1, label: 'Y' },
    ]
    const tree = listToTree(data, { idKey: 'key', parentIdKey: 'pKey', childrenKey: 'kids' })
    expect(tree).toHaveLength(1)
    expect(tree[0].kids).toHaveLength(1)
  })
})

describe('treeToList', () => {
  it('should flatten tree back to list', () => {
    const tree = listToTree(flatData)
    const list = treeToList(tree)
    expect(list).toHaveLength(4)
  })
})

describe('findTreeNode', () => {
  it('should find node by predicate', () => {
    const tree = listToTree(flatData)
    const found = findTreeNode(tree, n => n.name === 'Grandchild')
    expect(found).not.toBeNull()
    expect(found!.name).toBe('Grandchild')
  })
  it('should return null for non-existent node', () => {
    const tree = listToTree(flatData)
    expect(findTreeNode(tree, n => n.name === 'Nope')).toBeNull()
  })
})

describe('findTreePath', () => {
  it('should return path from root to target', () => {
    const tree = listToTree(flatData)
    const path = findTreePath(tree, n => n.name === 'Grandchild')
    expect(path.map(n => n.name)).toEqual(['Root', 'Child 1', 'Grandchild'])
  })
})

describe('filterTree', () => {
  it('should filter keeping hierarchy', () => {
    const tree = listToTree(flatData)
    const filtered = filterTree(tree, n => n.name === 'Grandchild')
    expect(filtered).toHaveLength(1)
    expect(filtered[0].children![0].children![0].name).toBe('Grandchild')
  })
})

describe('mapTree', () => {
  it('should transform each node', () => {
    const tree = listToTree(flatData)
    const mapped = mapTree(tree, n => ({ label: n.name }))
    expect(mapped[0].label).toBe('Root')
    expect(mapped[0].children![0].label).toBe('Child 1')
  })
})
