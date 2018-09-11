/**
 * Inserts the second given record into the first.
 * The value in between the start and end indices will be removed.
 * If no start index or end index is provided, the record's selection will be
 * used.
 *
 * @param {Object} record         Record or record value to modify.
 * @param {string} recordToInsert Record or record value to insert.
 * @param {number} start          Start index.
 * @param {number} end            End index.
 *
 * @return {Object} A new record with the record inserted.
 */
export function insert(
	{ value, selection = {} },
	recordToInsert,
	start = selection.start,
	end = selection.end
) {
	if ( value === undefined ) {
		return insertValue( ...arguments );
	}

	const index = start + recordToInsert.value.text.length;

	return {
		selection: {
			start: index,
			end: index,
		},
		value: insertValue( value, recordToInsert.value, start, end ),
	};
}

function insertValue(
	{ formats, text },
	valueToInsert,
	start,
	end
) {
	formats.splice( start, end - start, ...valueToInsert.formats );

	return {
		formats,
		text: text.slice( 0, start ) + valueToInsert.text + text.slice( end ),
	};
}
