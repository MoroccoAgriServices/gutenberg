/**
 * Internal dependencies
 */

import { insert } from './insert';
import { create } from './create';

/**
 * Removes content from the record at the given start and end indices.
 * If no start index or end index is provided, the record's selection will be
 * used.
 *
 * @param {Object} record Record to modify.
 * @param {number} start  Start index.
 * @param {number} end    End index.
 *
 * @return {Object} A new record with the content removed.
 */
export function remove( record, start, end ) {
	return insert( record, create(), start, end );
}
