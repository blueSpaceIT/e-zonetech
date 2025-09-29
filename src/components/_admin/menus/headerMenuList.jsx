'use client';
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { useQuery } from 'react-query';
import * as api from 'src/services';

export default function HeaderMenuList() {
  const { data, isLoading, refetch } = useQuery(['header-menus'], () => api.getHeaderMenus(), { enabled: true });
  const menus = data?.data || [];
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({ name: '', url: '' });
  const [subOpen, setSubOpen] = React.useState(false);
  const [currentMenu, setCurrentMenu] = React.useState(null);
  const [editingTree, setEditingTree] = React.useState(null); // deep-edit copy of currentMenu
  const [subForm, setSubForm] = React.useState({ name: '', url: '' });
  const [subEditingPath, setSubEditingPath] = React.useState(null); // array of indices, e.g. [0,1]
  const [subAddPath, setSubAddPath] = React.useState(null); // parent path where new submenu will be added
  const [expandedPaths, setExpandedPaths] = React.useState({});

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', url: '' });
    setOpen(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    setForm({ name: m.name, url: m.url });
    setOpen(true);
  };

  const handleCreateOrUpdate = async () => {
    try {
      if (editing) {
        await api.updateHeaderMenu(editing._id, form);
      } else {
        await api.createHeaderMenu(form);
      }
      setOpen(false);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this menu?')) return;
    try {
      await api.deleteHeaderMenu(id);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const openSubDialog = (menu) => {
    setCurrentMenu(menu);
    // normalize subMenus if server sent string
    const clone = JSON.parse(JSON.stringify(menu || {}));
    if (typeof clone.subMenus === 'string' && clone.subMenus.trim() !== '') {
      try {
        clone.subMenus = JSON.parse(clone.subMenus);
      } catch (e) {
        clone.subMenus = [];
      }
    }
    clone.subMenus = Array.isArray(clone.subMenus) ? clone.subMenus : [];
    setEditingTree(clone);
    setSubEditingPath(null);
    setSubAddPath(null);
    setSubForm({ name: '', url: '' });
    // expand nodes that already have subMenus so existing nested submenus are visible
    const map = buildExpandedMap(clone.subMenus);
    setExpandedPaths(map);
    setSubOpen(true);
  };

  // Build a map of expanded keys for nodes that already have children.
  // Keys use the same format as render: indices joined by '-'.
  function buildExpandedMap(list) {
    const map = {};
    function walk(items, path = []) {
      if (!Array.isArray(items)) return;
      items.forEach((it, idx) => {
        const p = [...path, idx];
        const key = p.join('-') || 'root';
        if (it && Array.isArray(it.subMenus) && it.subMenus.length > 0) {
          map[key] = true;
          walk(it.subMenus, p);
        }
      });
    }
    walk(list || [], []);
    return map;
  }

  // Helpers to work with nested path arrays
  const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj));

  const getNodeAtPath = (tree, path) => {
    if (!path || path.length === 0) return tree;
    let node = tree;
    for (let idx of path) {
      if (!node) return null;
      node.subMenus = Array.isArray(node.subMenus) ? node.subMenus : [];
      node = node.subMenus[idx];
    }
    return node;
  };

  const updateNodeAtPath = (tree, path, newNode) => {
    const t = cloneDeep(tree);
    if (!path || path.length === 0) {
      return newNode;
    }
    let node = t;
    for (let i = 0; i < path.length - 1; i++) {
      const idx = path[i];
      node.subMenus = Array.isArray(node.subMenus) ? node.subMenus : [];
      node = node.subMenus[idx];
      if (!node) break;
    }
    const last = path[path.length - 1];
    node.subMenus = Array.isArray(node.subMenus) ? node.subMenus : [];
    node.subMenus[last] = newNode;
    return t;
  };

  const removeNodeAtPath = (tree, path) => {
    const t = cloneDeep(tree);
    if (!path || path.length === 0) return t;
    let node = t;
    for (let i = 0; i < path.length - 1; i++) {
      const idx = path[i];
      node.subMenus = Array.isArray(node.subMenus) ? node.subMenus : [];
      node = node.subMenus[idx];
      if (!node) break;
    }
    const last = path[path.length - 1];
    node.subMenus = Array.isArray(node.subMenus) ? node.subMenus : [];
    node.subMenus.splice(last, 1);
    return t;
  };

  const addNodeAtParentPath = (tree, parentPath, newNode) => {
    const t = cloneDeep(tree);
    let parent = t;
    if (parentPath && parentPath.length > 0) {
      for (let idx of parentPath) {
        parent.subMenus = Array.isArray(parent.subMenus) ? parent.subMenus : [];
        parent = parent.subMenus[idx];
      }
    }
    parent.subMenus = Array.isArray(parent.subMenus) ? parent.subMenus : [];
    parent.subMenus.push(newNode);
    return t;
  };

  const handleSaveSubtree = async () => {
    if (!currentMenu || !editingTree) return;
    try {
      await api.updateHeaderMenu(currentMenu._id, editingTree);
      setSubOpen(false);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Save failed');
    }
  };

  const handleDeleteSubAtPath = (path) => {
    if (!currentMenu) return;
    if (!confirm('Delete this submenu?')) return;
    try {
      const newTree = removeNodeAtPath(editingTree, path);
      setEditingTree(newTree);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const handleStartEditAtPath = (path) => {
    const node = getNodeAtPath(editingTree, path) || { name: '', url: '' };
    setSubEditingPath(path);
    setSubForm({ name: node.name || '', url: node.url || '' });
  };

  const handleSaveEditAtPath = (path) => {
    const node = getNodeAtPath(editingTree, path) || { name: '', url: '' };
    const updated = { ...node, ...subForm };
    const newTree = updateNodeAtPath(editingTree, path, updated);
    setEditingTree(newTree);
    setSubEditingPath(null);
    setSubForm({ name: '', url: '' });
  };

  const handleStartAddAtPath = (parentPath) => {
    setSubAddPath(parentPath || []);
    setSubForm({ name: '', url: '' });
  };

  const handleAddAtPath = (parentPath) => {
    const newTree = addNodeAtParentPath(editingTree, parentPath, { ...subForm });
    setEditingTree(newTree);
    setSubAddPath(null);
    setSubForm({ name: '', url: '' });
    // expand parent so the new child is visible
    const key = (parentPath || []).join('-') || 'root';
    setExpandedPaths((s) => ({ ...s, [key]: true }));
  };

  const toggleExpand = (path) => {
    const key = (path || []).join('-') || 'root';
    setExpandedPaths((s) => ({ ...s, [key]: !s[key] }));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Header Menus</Typography>
        <Button variant="contained" onClick={openCreate}>
          Add Menu
        </Button>
      </Box>

      <Grid container spacing={2}>
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">Loading...</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : menus && menus.length > 0 ? (
          menus.map((m) => (
            <Grid item xs={12} sm={6} md={4} key={m._id}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{m.name}</Typography>
                  <Typography variant="body2">{m.url || '—'}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Button size="small" onClick={() => openEdit(m)}>
                      Edit
                    </Button>
                    <Button size="small" onClick={() => openSubDialog(m)}>
                      Manage Submenus
                    </Button>
                    <Button size="small" color="error" onClick={() => handleDelete(m._id)}>
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No header menus found.</Typography>
          </Grid>
        )}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Edit Menu' : 'Add Menu'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              margin="dense"
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="URL"
              fullWidth
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateOrUpdate}>
            {editing ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Submenu Manager Dialog (supports nested editing) */}
      <Dialog open={subOpen} onClose={() => setSubOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Manage Submenus for {currentMenu?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            {!editingTree || (editingTree.subMenus || []).length === 0 ? (
              <Typography variant="body2">No submenus.</Typography>
            ) : (
              // recursive render
              <Box>
                {function renderList(list, path = []) {
                  return (
                    <Box>
                      {list.map((s, idx) => {
                        const myPath = [...path, idx];
                        const key = myPath.join('-');
                        const isExpanded = !!expandedPaths[key];
                        return (
                          <Card key={key} sx={{ mb: 1 }}>
                            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="subtitle2">{s.name || '—'}</Typography>
                                <Typography variant="body2">{s.url || '—'}</Typography>
                                <Box sx={{ mt: 1 }}>
                                  <Button size="small" onClick={() => toggleExpand(myPath)}>
                                    {isExpanded ? 'Collapse' : 'Expand'}
                                  </Button>
                                  <Button size="small" onClick={() => handleStartAddAtPath(myPath)}>Add Child</Button>
                                </Box>
                              </Box>
                              <Box>
                                <Button size="small" onClick={() => handleStartEditAtPath(myPath)}>
                                  Edit
                                </Button>
                                <Button size="small" color="error" onClick={() => handleDeleteSubAtPath(myPath)}>
                                  Delete
                                </Button>
                              </Box>
                            </CardContent>
                            {isExpanded && s.subMenus && s.subMenus.length > 0 && (
                              <Box sx={{ pl: 3, pr: 1, pb: 1 }}>{renderList(s.subMenus, myPath)}</Box>
                            )}
                          </Card>
                        );
                      })}
                    </Box>
                  );
                }(editingTree.subMenus)}
              </Box>
            )}

            <Box sx={{ mt: 2, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
              <Typography variant="subtitle1">{subEditingPath ? 'Edit Submenu' : subAddPath ? 'Add Submenu (child)' : 'Add Submenu (root)'}</Typography>
              <TextField
                margin="dense"
                label="Name"
                fullWidth
                value={subForm.name}
                onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
              />
              <TextField
                margin="dense"
                label="URL"
                fullWidth
                value={subForm.url}
                onChange={(e) => setSubForm({ ...subForm, url: e.target.value })}
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button onClick={() => { setSubForm({ name: '', url: '' }); setSubEditingPath(null); setSubAddPath(null); }}>Clear</Button>
                {subEditingPath ? (
                  <Button variant="contained" onClick={() => handleSaveEditAtPath(subEditingPath)}>
                    Save
                  </Button>
                ) : subAddPath ? (
                  <Button variant="contained" onClick={() => handleAddAtPath(subAddPath)}>
                    Add
                  </Button>
                ) : (
                  <Button variant="contained" onClick={() => handleAddAtPath([])}>
                    Add
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubOpen(false)}>Close</Button>
          <Button variant="contained" onClick={handleSaveSubtree}>
            Save All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
