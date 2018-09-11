/**
 * External dependencies
 */

import { find } from 'lodash';

/**
 * Removes a given format from a record from the given start to the given end.
 * If either start or end are omitted, the record's selection will be used.
 * If the selection is collapsed, the start and end will be expanded to the
 * boundaries of the format.
 *
 * @param {Object} record     Record or record value to modify.
 * @param {string} formatType Format type to remove.
 * @param {number} start      Start index.
 * @param {number} end        End index.
 *
 * @return {Object} A new record with the format applied.
 */
export function removeFormat(
	{ value, selection = {} },
	formatType,
	start = selection.start,
	end = selection.end
) {
	if ( value === undefined ) {
		return removeFormatFromValue( ...arguments );
	}

	return {
		selection,
		value: removeFormatFromValue( value, formatType, start, end ),
	};
}

function filterFormats( formats, index, formatType ) {
	const newFormats = formats[ index ].filter( ( { type } ) => type !== formatType );

	if ( newFormats.length ) {
		formats[ index ] = newFormats;
	} else {
		delete formats[ index ];
	}
}

export function removeFormatFromValue(
	{ formats, text },
	formatType,
	start,
	end
) {
	// If the selection is collapsed, expand start and end to the edges of the
	// format.
	if ( start === end ) {
		const format = find( formats[ start ], { type: formatType } );

		while ( find( formats[ start ], format ) ) {
			filterFormats( formats, start, formatType );
			start--;
		}

		end++;

		while ( find( formats[ end ], format ) ) {
			filterFormats( formats, end, formatType );
			end++;
		}
	} else {
		for ( let i = start; i < end; i++ ) {
			if ( formats[ i ] ) {
				filterFormats( formats, i, formatType );
			}
		}
	}

	return { formats, text };
}
