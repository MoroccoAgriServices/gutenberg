/**
 * Inserts the second given record into the first.
 * The value in between the start and end indices will be removed.
 * If no start index or end index is provided, the record's selection will be
 * used.
 *
 * @param {Object} record         Record to modify.
 * @param {string} recordToInsert Record to insert.
 * @param {number} start          Start index.
 * @param {number} end            End index.
 *
 * @return {Object} A new record with the record inserted.
 */
export function insert(
	{ formats, text, selection = {} },
	recordToInsert,
	start = selection.start,
	end = selection.end
) {
	const index = start + recordToInsert.text.length;

	formats.splice( start, end - start, ...recordToInsert.formats );

	return {
		formats,
		text: text.slice( 0, start ) + recordToInsert.text + text.slice( end ),
		selection: {
			start: index,
			end: index,
		},
	};
}
