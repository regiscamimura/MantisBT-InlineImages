<?php
# Paste clipboard images into notes and descriptions; open image previews in a modal.

class InlineImagesPlugin extends MantisPlugin {
	public function register() {
		$this->name = plugin_lang_get( 'title' );
		$this->description = plugin_lang_get( 'description' );
		$this->version = '1.0.0';
		$this->requires = array( 'MantisCore' => '2.28.0' );
		$this->author = 'Regis Camimura';
		$this->contact = 'regiscamimura@gmail.com';
		$this->url = 'https://github.com/regiscamimura/MantisBT-InlineImages';
	}

	public function hooks() {
		return array(
			'EVENT_LAYOUT_RESOURCES' => 'print_resources',
			'EVENT_LAYOUT_BODY_END' => 'print_image_modal',
		);
	}

	public function print_resources() {
		echo '<link rel="stylesheet" type="text/css" href="' . $this->versioned_file( 'inline_images.css' ) . '" />', "\n";
		echo '<script type="text/javascript" src="' . $this->versioned_file( 'inline_images.js' ) . '" defer></script>', "\n";
	}

	public function print_image_modal() {
		echo '<dialog id="inline_images_modal" class="inline-images-modal">';
		echo '<button type="button" class="inline-images-modal-close" aria-label="' . string_attribute( plugin_lang_get( 'close' ) ) . '">&times;</button>';
		echo '<img alt="" />';
		echo '</dialog>', "\n";
		# Texts the script shows next to the textarea after a paste
		echo '<div id="inline_images_strings" hidden'
			. ' data-attached="' . string_attribute( plugin_lang_get( 'attached' ) ) . '"'
			. ' data-queued="' . string_attribute( plugin_lang_get( 'queued' ) ) . '"'
			. ' data-failed="' . string_attribute( plugin_lang_get( 'failed' ) ) . '"'
			. '></div>', "\n";
	}

	# plugin_file.php lets browsers cache for 3 hours; the mtime makes each edited file a new URL
	private function versioned_file( $p_file ) {
		return plugin_file( $p_file ) . '&amp;v=' . filemtime( __DIR__ . '/files/' . $p_file );
	}
}
