/**
 * Internal dependencies
 */

import { isEmpty } from './is-empty';

/**
 * Browser dependencies
 */

const { TEXT_NODE, ELEMENT_NODE } = window.Node;

/**
 * Parse the given HTML into a body element.
 *
 * @param {string} html The HTML to parse.
 *
 * @return {HTMLBodyElement} Body element with parsed HTML.
 */
function createElement( html ) {
	const htmlDocument = document.implementation.createHTMLDocument( '' );

	htmlDocument.body.innerHTML = html;

	return htmlDocument.body;
}

/**
 * Creates rich text value and selection objects from a DOM element and range.
 *
 * @param {HTMLElement} element      Element to create value object from.
 * @param {Range}       range        Range to create selection object from.
 * @param {string}      multilineTag Multiline tag if the structure is multiline.
 * @param {Object}      settings     Settings passed to `createRecord`.
 *
 * @return {Object} A rich text record.
 */
export function create( element, range, multilineTag, settings ) {
	if ( typeof element === 'string' ) {
		element = createElement( element );
	}

	if ( ! multilineTag ) {
		return createRecord( element, range, settings );
	}

	const emptyRecord = {
		formats: [],
		text: '',
	};

	if ( ! element || ! element.hasChildNodes() ) {
		return emptyRecord;
	}

	const children = Array.from( element.children )
		.filter( ( { nodeName } ) => nodeName.toLowerCase() === multilineTag );
	const maxIndex = children.length - 1;

	if ( maxIndex < 0 ) {
		return emptyRecord;
	}

	return children.reduce( ( accumulator, node, index ) => {
		const { start, end, text, formats } = createRecord( node, range, settings );
		const length = accumulator.text.length;

		if ( range ) {
			if ( start !== undefined ) {
				accumulator.start = length + start;
			} else if (
				node.parentNode === range.startContainer &&
				node === range.startContainer.childNodes[ range.startOffset ]
			) {
				accumulator.start = length;
			}

			if ( end !== undefined ) {
				accumulator.end = length + end;
			} else if (
				node.parentNode === range.endContainer &&
				node === range.endContainer.childNodes[ range.endOffset - 1 ]
			) {
				accumulator.end = length + text.length;
			}
		}

		accumulator.formats = accumulator.formats.concat( formats );
		accumulator.text += text;

		if ( index !== maxIndex ) {
			accumulator.formats = accumulator.formats.concat( [ , , ] );
			accumulator.text += '\n\n';
		}

		return accumulator;
	}, emptyRecord );
}

/**
 * Creates a rich text value object from a DOM element.
 *
 * @param {HTMLElement} element      Element to create value object from.
 * @param {string}      multilineTag Multiline tag.
 * @param {Object}      settings     Settings passed to `createRecord`.
 *
 * @return {Object} A rich text value object.
 */
export function createValue( element, multilineTag, settings ) {
	return create( element, null, multilineTag, settings );
}

/**
 * Creates rich text value and selection objects from a DOM element and range.
 *
 * @param {HTMLElement} element                  Element to create value object
 *                                               from.
 * @param {Range}       range                    Range to create selection object
 *                                               from.
 * @param {Object}      settings                 Settings object.
 * @param {Function}    settings.removeNodeMatch Function to declare whether the
 *                                               given node should be removed.
 * @param {Function}    settings.unwrapNodeMatch Function to declare whether the
 *                                               given node should be unwrapped.
 * @param {Function}    settings.filterString    Function to filter the given
 *                                               string.
 * @param {Function}    settings.removeAttribute Match Wether to remove an attribute
 *                                               based on the name.
 *
 * @return {Object} A rich text record.
 */
function createRecord( element, range, settings = {} ) {
	const emptyRecord = {
		formats: [],
		text: '',
	};

	if ( ! element || ! element.hasChildNodes() ) {
		return emptyRecord;
	}

	const {
		removeNodeMatch = () => false,
		unwrapNodeMatch = () => false,
		filterString = ( string ) => string,
		removeAttributeMatch,
	} = settings;

	// Remove any line breaks in text nodes. They are not content, but used to
	// format the HTML. Line breaks in HTML are stored as BR elements.
	const filterStringComplete = ( string ) => filterString( string.replace( '\n', '' ) );

	return Array.from( element.childNodes ).reduce( ( accumulator, node ) => {
		if ( node.nodeType === TEXT_NODE ) {
			const nodeValue = node.nodeValue;
			const text = filterStringComplete( nodeValue );

			if ( range ) {
				const textLength = accumulator.text.length;

				if ( node === range.startContainer ) {
					const charactersBefore = nodeValue.slice( 0, range.startOffset );
					const lengthBefore = filterStringComplete( charactersBefore ).length;
					accumulator.start = textLength + lengthBefore;
				}

				if ( node === range.endContainer ) {
					const charactersBefore = nodeValue.slice( 0, range.endOffset );
					const lengthBefore = filterStringComplete( charactersBefore ).length;
					accumulator.end = textLength + lengthBefore;
				}

				if (
					node.parentNode === range.startContainer &&
					node === range.startContainer.childNodes[ range.startOffset ]
				) {
					accumulator.start = textLength;
				}

				if (
					node.parentNode === range.endContainer &&
					node === range.endContainer.childNodes[ range.endOffset - 1 ]
				) {
					accumulator.end = textLength + text.length;
				}
			}

			accumulator.text += text;
			// Create a sparse array of the same length as `text`, in which
			// formats can be added.
			accumulator.formats.length += text.length;
			return accumulator;
		}

		if ( node.nodeType !== ELEMENT_NODE || removeNodeMatch( node ) ) {
			return accumulator;
		}

		if ( range ) {
			if (
				node.parentNode === range.startContainer &&
				node === range.startContainer.childNodes[ range.startOffset ]
			) {
				accumulator.start = accumulator.text.length;
			}

			if (
				node.parentNode === range.endContainer &&
				node === range.endContainer.childNodes[ range.endOffset - 1 ]
			) {
				accumulator.end = accumulator.text.length;
			}
		}

		if ( node.nodeName === 'BR' ) {
			if ( unwrapNodeMatch( node ) ) {
				return accumulator;
			}

			accumulator.text += '\n';
			accumulator.formats.length += 1;
			return accumulator;
		}

		let format;

		if ( ! unwrapNodeMatch( node ) ) {
			const type = node.nodeName.toLowerCase();
			const attributes = getAttributes( node, { removeAttributeMatch } );
			format = attributes ? { type, attributes } : { type };
		}

		const record = createRecord( node, range, settings );
		const text = record.text;
		const start = accumulator.text.length;

		// Expand range if it ends in this node.
		if ( range ) {
			if (
				node.parentNode === range.endContainer &&
				node === range.endContainer.childNodes[ range.endOffset - 1 ]
			) {
				accumulator.end = start + text.length;
			}
		}

		// Don't apply the element as formatting if it has no content.
		if ( isEmpty( record ) && format && ! format.attributes ) {
			return accumulator;
		}

		const { formats } = accumulator;

		if ( format && format.attributes && text.length === 0 ) {
			format.object = true;

			if ( formats[ start ] ) {
				formats[ start ].unshift( format );
			} else {
				formats[ start ] = [ format ];
			}
		} else {
			accumulator.text += text;

			let i = record.formats.length;

			while ( i-- ) {
				const index = start + i;

				if ( format ) {
					if ( formats[ index ] ) {
						formats[ index ].push( format );
					} else {
						formats[ index ] = [ format ];
					}
				}

				if ( record.formats[ i ] ) {
					if ( formats[ index ] ) {
						formats[ index ].push( ...record.formats[ i ] );
					} else {
						formats[ index ] = record.formats[ i ];
					}
				}
			}
		}

		if ( record.start !== undefined ) {
			accumulator.start = start + record.start;
		}

		if ( record.end !== undefined ) {
			accumulator.end = start + record.end;
		}

		return accumulator;
	}, emptyRecord );
}

/**
 * Gets the attributes of an element in object shape.
 *
 * @param {HTMLElement} element                       Element to get attributes from.
 * @param {Function}    settings.removeAttributeMatch Function whose return value
 *                                                    determines whether or not to
 *                                                    remove an attribute based on name.
 *
 * @return {?Object} Attribute object or `undefined` if the element has no
 *                   attributes.
 */
function getAttributes( element, {
	removeAttributeMatch = () => false,
} ) {
	if ( ! element.hasAttributes() ) {
		return;
	}

	return Array.from( element.attributes ).reduce( ( accumulator, { name, value } ) => {
		if ( ! removeAttributeMatch( name ) ) {
			accumulator = accumulator || {};
			accumulator[ name ] = value;
		}

		return accumulator;
	}, undefined );
}
