// Ctrl+V of a clipboard image into an issue textarea attaches it to the issue:
// - forms with a drop zone (report issue, add note) queue it, uploaded on submit
// - other issue forms (edit issue) upload it right away through the REST API
document.addEventListener('paste', function (e) {
	var textarea = e.target.closest && e.target.closest('textarea');
	if (!textarea || !textarea.form || !e.clipboardData) return;

	// Copying spreadsheet cells puts both text and a picture of them on the clipboard; the text wins
	if (e.clipboardData.getData('text/plain')) return;

	var images = Array.from(e.clipboardData.items)
		.filter(function (item) { return item.kind == 'file' && item.type.indexOf('image/') == 0; })
		.map(function (item) { return item.getAsFile(); });
	if (!images.length) return;

	var form = textarea.form;
	var bugIdInput = form.querySelector('input[name="bug_id"]');
	if (!form.dropzone && !bugIdInput) return;

	e.preventDefault();
	images.forEach(function (image, index) {
		var file = new File([image], pastedImageName(image, index), { type: image.type });
		if (form.dropzone) {
			form.dropzone.addFile(file);
			showPasteStatus(textarea, 'queued', file.name);
		} else {
			uploadImageToIssue(bugIdInput.value, file, textarea);
		}
	});
});

function pastedImageName(image, index) {
	var stamp = new Date().toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '');
	var extension = image.type.split('/')[1].replace('jpeg', 'jpg');
	return 'pasted-' + stamp + (index ? '-' + (index + 1) : '') + '.' + extension;
}

function uploadImageToIssue(bugId, file, textarea) {
	var reader = new FileReader();
	reader.onload = function () {
		var base64 = reader.result.split(',')[1];
		fetch('api/rest/index.php/issues/' + encodeURIComponent(bugId) + '/files', {
			method: 'POST',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ files: [{ name: file.name, content: base64 }] })
		}).then(function (response) {
			showPasteStatus(textarea, response.ok ? 'attached' : 'failed', file.name);
		}, function () {
			showPasteStatus(textarea, 'failed', file.name);
		});
	};
	reader.readAsDataURL(file);
}

function showPasteStatus(textarea, outcome, fileName) {
	var status = document.createElement('div');
	status.className = 'inline-images-status' + (outcome == 'failed' ? ' failed' : '');
	status.textContent = document.getElementById('inline_images_strings').dataset[outcome].replace('%s', fileName);
	textarea.insertAdjacentElement('afterend', status);
}

// Clicking an image preview opens it full size in a modal instead of downloading it
document.addEventListener('click', function (e) {
	var preview = e.target.closest && e.target.closest('.bug-attachment-preview-image a');
	if (!preview || e.ctrlKey || e.metaKey || e.shiftKey || e.button != 0) return;

	var modal = document.getElementById('inline_images_modal');
	if (!modal) return;

	e.preventDefault();
	modal.querySelector('img').src = preview.querySelector('img').src;
	modal.showModal();
});

document.addEventListener('DOMContentLoaded', function () {
	var modal = document.getElementById('inline_images_modal');
	if (!modal) return;
	// Any click while open (image, backdrop, close button) closes it
	modal.addEventListener('click', function () { modal.close(); });
});
