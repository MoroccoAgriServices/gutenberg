/**
 * Combines the given records into one record, separated by the given record or
 * text.
 *
 * Works like `Array.prototype.join()`.
 *
 * @param {Array}         record    An array of records to join.
 * @param {string|Object} separator Separator string or record.
 *
 * @return {Object} A new combined record.
 */
export function join( [ record, ...records ], separator ) {
	if ( ! record ) {
		return {
			formats: [],
			text: '',
		};
	}

	return records.reduce( ( accumlator, { formats, text } ) => {
		if ( typeof separator === 'string' ) {
			separator = {
				formats: Array( separator.length ),
				text: separator,
			};
		}

		accumlator.text += separator.text + text;
		accumlator.formats = accumlator.formats.concat( separator.formats, formats );
		return accumlator;
	}, { ...record } );
}
