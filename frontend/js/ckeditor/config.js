/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	config.language = 'en';
	config.uiColor = '#CCEAEE';
	config.height = 500;

    config.extraPlugins = 'youtube';
    config.youtube_width = '640';
    config.youtube_height = '480';
    config.youtube_responsive = true;
    config.youtube_related = true;
    config.youtube_privacy = false;
    config.youtube_autoplay = false;
    config.youtube_controls = true;
    config.youtube_disabled_fields = ['txtEmbed', 'chkAutoplay'];
};
