export const editorConfig = {
  selector: '#notesEditor',
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  toolbar: [
    'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify',
    'bullist numlist outdent indent | removeformat | help'
  ],
  height: 500,
  menubar: true,
  branding: false,
  readonly: false,
  inline: false,
  verify_html: true,
  auto_focus: true,
  content_style: `
    body { 
      font-family: Arial, sans-serif; 
      font-size: 14px; 
      margin: 15px;
    }
  `
}