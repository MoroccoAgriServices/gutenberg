/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import {
	ExternalLink,
	Fill,
	IconButton,
	Popover,
	ToggleControl,
	withSpokenMessages,
} from '@wordpress/components';
import { ESCAPE, LEFT, RIGHT, UP, DOWN, BACKSPACE, ENTER } from '@wordpress/keycodes';
import { prependHTTP } from '@wordpress/url';
import {
	create,
	insert,
	isCollapsed,
	applyFormat,
} from '@wordpress/rich-text-structure';

/**
 * Internal dependencies
 */
import PositionedAtSelection from './positioned-at-selection';
import URLInput from '../../url-input';
import { filterURLForDisplay } from '../../../utils/url';

const stopKeyPropagation = ( event ) => event.stopPropagation();

function getInitialState( { link = {} } ) {
	const { attributes = {} } = link;
	const { href = '', target } = attributes;

	return {
		editLink: false,
		inputValue: href,
		opensInNewWindow: target === '_blank',
	};
}

function createLinkFormat( { href, opensInNewWindow } ) {
	const format = {
		type: 'a',
		attributes: {
			href,
		},
	};

	if ( opensInNewWindow ) {
		format.attributes.target = '_blank';
		format.attributes.rel = 'noreferrer noopener';
	}

	return format;
}

class LinkContainer extends Component {
	constructor( props ) {
		super( ...arguments );

		this.editLink = this.editLink.bind( this );
		this.submitLink = this.submitLink.bind( this );
		this.onKeyDown = this.onKeyDown.bind( this );
		this.onChangeInputValue = this.onChangeInputValue.bind( this );
		this.toggleLinkSettingsVisibility = this.toggleLinkSettingsVisibility.bind( this );
		this.setLinkTarget = this.setLinkTarget.bind( this );
		this.resetState = this.resetState.bind( this );
		this.isShowingInput = this.isShowingInput.bind( this );

		this.state = getInitialState( props );
	}

	isShowingInput() {
		return this.props.addingLink || this.state.editLink;
	}

	onKeyDown( event ) {
		if ( event.keyCode === ESCAPE ) {
			event.stopPropagation();
			this.resetState();
		}

		if ( [ LEFT, DOWN, RIGHT, UP, BACKSPACE, ENTER ].indexOf( event.keyCode ) > -1 ) {
			// Stop the key event from propagating up to maybeStartTyping in BlockListBlock.
			event.stopPropagation();
		}
	}

	onChangeInputValue( inputValue ) {
		this.setState( { inputValue } );
	}

	toggleLinkSettingsVisibility() {
		this.setState( ( state ) => ( { settingsVisible: ! state.settingsVisible } ) );
	}

	setLinkTarget( opensInNewWindow ) {
		this.setState( { opensInNewWindow } );

		// Apply now if URL is not being edited.
		if ( ! this.isShowingInput() ) {
			const { href } = this.props.link.attributes;
			this.props.applyFormat( createLinkFormat( { href, opensInNewWindow } ) );
		}
	}

	editLink( event ) {
		this.setState( { editLink: true } );
		event.preventDefault();
	}

	submitLink( event ) {
		const { link, record } = this.props;
		const { inputValue, opensInNewWindow } = this.state;
		const href = prependHTTP( inputValue );
		const format = createLinkFormat( { href, opensInNewWindow } );

		if ( isCollapsed( record ) ) {
			const toInsert = applyFormat( create( href ), format, 0, href.length );
			this.props.onChange( insert( record, toInsert ) );
		} else {
			this.props.applyFormat( format );
		}

		this.resetState();

		if ( ! link ) {
			this.props.speak( __( 'Link added.' ), 'assertive' );
		}

		event.preventDefault();
	}

	resetState() {
		this.props.stopAddingLink();
		this.setState( getInitialState( this.props ) );
	}

	render() {
		const { link, addingLink, record } = this.props;

		if ( ! link && ! addingLink ) {
			return null;
		}

		const { inputValue, settingsVisible, opensInNewWindow } = this.state;
		const { attributes = {} } = link || {};
		const { href = '' } = attributes;
		const isShowingInput = this.isShowingInput();

		const linkSettings = settingsVisible && (
			<div className="editor-format-toolbar__link-modal-line editor-format-toolbar__link-settings">
				<ToggleControl
					label={ __( 'Open in New Window' ) }
					checked={ opensInNewWindow }
					onChange={ this.setLinkTarget } />
			</div>
		);

		return (
			<Fill name="RichText.Siblings">
				<PositionedAtSelection
					className="editor-format-toolbar__link-container"
					key={ `${ record.start }${ record.end }` /* Used to force rerender on selection change */ }
				>
					<Popover
						position="bottom center"
						focusOnMount={ addingLink ? 'firstElement' : false }
						onClickOutside={ this.resetState }
					>
						{ isShowingInput && (
							// Disable reason: KeyPress must be suppressed so the block doesn't hide the toolbar
							/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
							<form
								className="editor-format-toolbar__link-modal"
								onKeyPress={ stopKeyPropagation }
								onKeyDown={ this.onKeyDown }
								onSubmit={ this.submitLink }
							>
								<div className="editor-format-toolbar__link-modal-line">
									<URLInput value={ inputValue } onChange={ this.onChangeInputValue } />
									<IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
									<IconButton
										className="editor-format-toolbar__link-settings-toggle"
										icon="ellipsis"
										label={ __( 'Link Settings' ) }
										onClick={ this.toggleLinkSettingsVisibility }
										aria-expanded={ settingsVisible }
									/>
								</div>
								{ linkSettings }
							</form>
							/* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
						) }

						{ ! isShowingInput && (
							// Disable reason: KeyPress must be suppressed so the block doesn't hide the toolbar
							/* eslint-disable jsx-a11y/no-static-element-interactions */
							<div
								className="editor-format-toolbar__link-modal"
								onKeyPress={ stopKeyPropagation }
							>
								<div className="editor-format-toolbar__link-modal-line">
									<ExternalLink
										className="editor-format-toolbar__link-value"
										href={ href }
									>
										{ filterURLForDisplay( decodeURI( href ) ) }
									</ExternalLink>
									<IconButton icon="edit" label={ __( 'Edit' ) } onClick={ this.editLink } />
									<IconButton
										className="editor-format-toolbar__link-settings-toggle"
										icon="ellipsis"
										label={ __( 'Link Settings' ) }
										onClick={ this.toggleLinkSettingsVisibility }
										aria-expanded={ settingsVisible }
									/>
								</div>
								{ linkSettings }
							</div>
							/* eslint-enable jsx-a11y/no-static-element-interactions */
						) }
					</Popover>
				</PositionedAtSelection>
			</Fill>
		);
	}
}

export default withSpokenMessages( LinkContainer );
