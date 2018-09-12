/**
 * Extracts a section of a record and returns it as a new record.
 *
 * Works like `String.prototype.slice()`.
 *
 * @param {Object} record Record to modify.
 * @param {number} start  Start index.
 * @param {number} end    End index.
 *
 * @return {Object} A new extracted record.
 */
export function slice(
	{ formats, text, selection = {} },
	start = selection.start,
	end = selection.end
) {
	if ( start === undefined || end === undefined ) {
		return { formats, text };
	}

	return {
		formats: formats.slice( start, end ),
		text: text.slice( start, end ),
	};
}
