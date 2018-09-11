/**
 * Extracts a section of a record and returns it as a new record.
 *
 * Works like `String.prototype.slice()`.
 *
 * @param {Object} record Record or record value to modify.
 * @param {number} start  Start index.
 * @param {number} end    End index.
 *
 * @return {Object} A new extracted record.
 */
export function slice(
	{ value, selection },
	start = selection.start,
	end = selection.end
) {
	if ( value === undefined ) {
		return sliceValue( ...arguments );
	}

	if ( start === undefined || end === undefined ) {
		return { value, selection };
	}

	return {
		selection: {},
		value: sliceValue( value, start, end ),
	};
}

function sliceValue( { formats, text }, start, end ) {
	return {
		formats: formats.slice( start, end ),
		text: text.slice( start, end ),
	};
}
