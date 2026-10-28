# MantisBT Inline Images

For MantisBT 2.28+:

- **Paste screenshots**: Ctrl+V an image into the note, description or steps box and it is
  attached to the issue.
- **Image modal**: clicking an attached image preview opens it full size; Ctrl/Cmd/middle
  click still opens it in a new tab.

Where the pasted image goes depends on the form:

| Form | What happens |
|---|---|
| Add note, Report issue (have a drop zone) | added to the drop zone, uploaded on submit |
| Edit issue (no drop zone) | uploaded right away through the REST API, a line under the box confirms it |

```
Will be attached when you submit: pasted-2026-10-28-094512.png
Attached to the issue: pasted-2026-10-28-094530.png
```

If the clipboard also holds text (copying cells from a spreadsheet puts both there),
the text is pasted and the image is ignored.

## Show every image inline

MantisBT only previews images under 256 KB inline, which hides most screenshots. To
preview everything up to the upload limit, add to `config/config_inc.php`:

```php
$g_preview_attachments_inline_max_size = $g_max_file_size;
```

## Install

```sh
cd /path/to/mantis/plugins
git clone https://github.com/regiscamimura/MantisBT-InlineImages.git InlineImages
```

Then **Manage → Manage Plugins → Inline Images → Install**. The folder must be named
`InlineImages`.

## License

GPL-2.0, same as MantisBT.
