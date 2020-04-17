<?php
/**
 * Server-side rendering of the `core/post-author` block.
 *
 * @package WordPress
 */

/**
 * Renders the `core/post-author` block on the server.
 *
 * @param WP_Block $block Block instance.
 *
 * @return string Returns the filtered post author for the current post wrapped inside "h6" tags.
 */
function render_block_core_post_author( $block ) {
	if ( ! isset( $block->context['postId'] ) ) {
		return '';
	}

	$author_id = get_post_field( 'post_author', $block->context['postId'] );
	if ( empty( $author_id ) ) {
		return '';
	}

	$author_display_name = get_the_author_meta( 'display_name', $author_id );
	if ( empty( $author_id ) ) {
		return '';
	}

	// translators: %s: The author.
	return '<address>' . sprintf( __( 'By %s' ), $author_display_name ) . '</address>';
}

/**
 * Registers the `core/post-author` block on the server.
 */
function register_block_core_post_author() {
	register_block_type_from_metadata(
		__DIR__ . '/post-author',
		array(
			'render_callback' => 'render_block_core_post_author',
		)
	);
}
add_action( 'init', 'register_block_core_post_author' );
