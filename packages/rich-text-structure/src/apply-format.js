/**
 * Applies a given format to a record from the given start to the given end.
 * If either start or end are omitted, the record's selection will be used.
 * If at any index there is already a format of the same type present, it will
 * be removed.
 *
 * @param {Object} record Record or record value to modify.
 * @param {Object} format Format to apply.
 * @param {number} start  Start index.
 * @param {number} end    End index.
 *
 * @return {Object} A new record with the format applied.
 */
export function applyFormat(
	{ value, selection = {} },
	format,
	start = selection.start,
	end = selection.end
) {
	if ( value === undefined ) {
		return applyFormatToValue( ...arguments );
	}

	return {
		selection,
		value: applyFormatToValue( value, format, start, end ),
	};
}

function applyFormatToValue(
	{ formats, text },
	format,
	start,
	end
) {
	for ( let i = start; i < end; i++ ) {
		if ( formats[ i ] ) {
			const newFormats = formats[ i ].filter( ( { type } ) => type !== format.type );
			newFormats.push( format );
			formats[ i ] = newFormats;
		} else {
			formats[ i ] = [ format ];
		}
	}

	return { formats, text };
}
