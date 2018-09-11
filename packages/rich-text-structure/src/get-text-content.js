/**
 * Gets the text content form a record or record value.
 *
 * @param {Object} record Record or record value to use.
 *
 * @return {string} The text content.
 */
export function getTextContent( { text, value } ) {
	if ( value === undefined ) {
		return text;
	}

	return value.text;
}
