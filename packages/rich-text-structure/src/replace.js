/**
 * Replaces text in the given record with the given replacement text or record.
 *
 * Works like `String.prototype.replace()`.
 *
 * @param {Object}         record       The record or record value te modify.
 * @param {RegExp|string}  pattern      A RegExp object or literal. Can also be
 *                                      a string. It is treated as a verbatim
 *                                      string and is not interpreted as a
 *                                      regular expression. Only the first
 *                                      occurrence will be replaced.
 * @param {Function|string} replacement The match or matches are replaced with
 *                                      the specified or the value returned by
 *                                      the specified function.
 *
 * @return {Object} A new record with replacements applied.
 */
export function replace(
	{ value },
	pattern,
	replacement
) {
	if ( value === undefined ) {
		return replaceValue( ...arguments );
	}

	return {
		selection: {},
		value: replaceValue( value, pattern, replacement ),
	};
}

function replaceValue(
	{ formats, text },
	pattern,
	replacement
) {
	text = text.replace( pattern, ( match, ...rest ) => {
		const offset = rest[ rest.length - 2 ];
		let newText = replacement;
		let newFormats;

		if ( typeof newText === 'function' ) {
			newText = replacement( match, ...rest );
		}

		if ( typeof newText === 'object' ) {
			newFormats = newText.formats;
			newText = newText.text;
		} else {
			newFormats = Array( newText.length ).fill( formats[ offset ] );
		}

		formats.splice( offset, match.length, ...newFormats );

		return newText;
	} );

	return {
		formats,
		text,
	};
}
