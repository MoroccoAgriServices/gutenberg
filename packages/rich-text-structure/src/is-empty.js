/**
 * Checks if a record or record value is empty or not.
 *
 * @param {Object} record Record or record value to use.
 *
 * @return {boolean} True if the record is empty, false if not.
 */
export function isEmpty( { value } ) {
	if ( value === undefined ) {
		return isEmptyValue( ...arguments );
	}

	return isEmptyValue( value );
}

function isEmptyValue( { text, formats } ) {
	return text.length === 0 && formats.length === 0;
}
