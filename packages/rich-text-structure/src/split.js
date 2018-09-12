/**
 * Splits a record into an array of records using a specified separator string
 * or start and end indices to determine where to make each split. If indices
 * are provided, the array will always consist of two records and the content in
 * between will not be returned.
 *
 * @param {Object}        record  Record to modify.
 * @param {number|string} string  Start index, or string at which to split.
 * @param {number}        end     End index.
 *
 * @return {Array} An array of new records.
 */
export function split( { formats, text, selection }, string ) {
	if ( typeof string !== 'string' ) {
		return splitAtSelection( ...arguments );
	}

	let nextStart = 0;

	return text.split( string ).map( ( substring ) => {
		const splitSelection = {};
		const start = nextStart;

		nextStart += string.length + substring.length;

		if ( selection ) {
			if ( selection.start > start && selection.start < nextStart ) {
				splitSelection.start = selection.start - start;
			} else if ( selection.start < start && selection.end > start ) {
				splitSelection.start = 0;
			}

			if ( selection.end > start && selection.end < nextStart ) {
				splitSelection.end = selection.end - start;
			} else if ( selection.start < nextStart && selection.end > nextStart ) {
				splitSelection.end = substring.length;
			}
		}

		return {
			formats: formats.slice( start, start + substring.length ),
			text: substring,
			selection: splitSelection,
		};
	} );
}

function splitAtSelection(
	{ formats, text, selection = {} },
	start = selection.start,
	end = selection.end
) {
	return [
		{
			formats: formats.slice( 0, start ),
			text: text.slice( 0, start ),
			selection: {},
		},
		{
			formats: formats.slice( end ),
			text: text.slice( end ),
			selection: {
				start: 0,
				end: 0,
			},
		},
	];
}
