import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
  Box, 
  IconButton, 
  Divider, 
  Toolbar,
  FormHelperText,
  Paper
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Undo,
  Redo,
  Code,
  FormatQuote
} from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const StyledEditor = styled(Box)(({ theme, error }) => ({
  border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '& .ProseMirror': {
    padding: theme.spacing(2),
    minHeight: '200px',
    outline: 'none',
    fontSize: '14px',
    lineHeight: 1.5,
    '& p': {
      margin: '0 0 8px 0',
    },
    '& ul, & ol': {
      paddingLeft: theme.spacing(3),
      margin: '8px 0',
    },
    '& blockquote': {
      borderLeft: `4px solid ${theme.palette.primary.main}`,
      paddingLeft: theme.spacing(2),
      margin: '16px 0',
      fontStyle: 'italic',
      color: theme.palette.text.secondary,
    },
    '& code': {
      backgroundColor: theme.palette.grey[100],
      padding: '2px 4px',
      borderRadius: '4px',
      fontSize: '0.9em',
      fontFamily: 'monospace',
    },
    '& pre': {
      backgroundColor: theme.palette.grey[100],
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      overflow: 'auto',
      '& code': {
        backgroundColor: 'transparent',
        padding: 0,
      },
    },
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      margin: '16px 0 8px 0',
      fontWeight: 600,
    },
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    borderWidth: '2px',
  },
}));

const ToolbarButton = styled(IconButton)(({ theme, active }) => ({
  padding: theme.spacing(0.75),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: active ? theme.palette.primary.main : 'transparent',
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: active 
      ? theme.palette.primary.dark 
      : theme.palette.action.hover,
  },
}));

const EditorToolbar = ({ editor, onImageClick }) => {
  if (!editor) return null;

  return (
    <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar variant="dense" sx={{ minHeight: 48, gap: 0.5 }}>
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <FormatBold fontSize="small" />
        </ToolbarButton>
        
        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <FormatItalic fontSize="small" />
        </ToolbarButton>
        
        <ToolbarButton
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
          title="Code"
        >
          <Code fontSize="small" />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <FormatListBulleted fontSize="small" />
        </ToolbarButton>
        
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered List"
        >
          <FormatListNumbered fontSize="small" />
        </ToolbarButton>
        
        <ToolbarButton
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <FormatQuote fontSize="small" />
        </ToolbarButton>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo fontSize="small" />
        </ToolbarButton>
        
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo fontSize="small" />
        </ToolbarButton>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <ToolbarButton
          onClick={onImageClick}
          title="Insert Image"
        >
          <ImageIcon fontSize="small" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('link')}
          onClick={() => {
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run();
            } else {
              // simple prompt for URL; keeps the component lightweight
              const url = window.prompt('Enter a URL');
              if (url) {
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
              }
            }
          }}
          title="Link"
        >
          <LinkIcon fontSize="small" />
        </ToolbarButton>
      </Toolbar>
    </Paper>
  );
};

const TiptapEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Enter description...', 
  error = false, 
  helperText,
  uploadImage, // optional function(file) => Promise<string> returns uploaded image URL
  ...props 
}) => {
  const editor = useEditor({
  extensions: [StarterKit, Image, Link],
    content: value,
    immediatelyRender: false, // Fix SSR hydration issues
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  // Update editor content when value prop changes
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  // handle input change for image upload
  React.useEffect(() => {
    const input = document.getElementById('tiptap-image-input');
    if (!input) return;
    const onChangeFile = async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (uploadImage && typeof uploadImage === 'function') {
        try {
          const url = await uploadImage(file);
          if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
            onChange(editor.getHTML());
          }
        } catch (err) {
          // swallow - allow caller to handle errors
          console.error('Image upload failed', err);
        }
      }
      // reset input
      e.target.value = '';
    };
    input.addEventListener('change', onChangeFile);
    return () => input.removeEventListener('change', onChangeFile);
  }, [uploadImage, editor, onChange]);

  return (
    <Box>
      <StyledEditor error={error}>
        {/* hidden file input for image uploads */}
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          id="tiptap-image-input"
        />
        <EditorToolbar editor={editor} onImageClick={() => {
          const input = document.getElementById('tiptap-image-input');
          if (!input) return;
          input.click();
        }} />
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
          {...props}
        />
      </StyledEditor>
      {helperText && (
        <FormHelperText error={error} sx={{ mt: 1 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default TiptapEditor;
